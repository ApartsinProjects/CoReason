# Session 5 — Open-Ended: Design an FPGA-Targeted Edge Detection Pipeline for Drone Video

**Mode:** Open-Ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Design a 2D convolution-based edge detection pipeline for a drone camera feed and deliver a Python simulation that processes a set of sample frames (1280x720, 30 fps) and outputs edge-detected images suitable for downstream obstacle avoidance. Deliver the simulation code, a resource-usage estimate table (multiplications per frame, memory footprint, estimated latency), and a one-page design document explaining how the pipeline would map to an FPGA. The flight controller team says they need "edges of obstacles, not background clutter" and that the processing must "fit on our current FPGA" without specifying which FPGA.

### Student's Framing Response

**Gap: The FPGA is unspecified.** Without knowing the target device (Xilinx Artix-7? Zynq? Intel Cyclone V?), we cannot evaluate whether the pipeline "fits." Different FPGAs have vastly different numbers of DSP slices, block RAM, and logic elements. I'll assume a mid-range device (e.g., Artix-7 XC7A200T with 740 DSP slices and 365 KB BRAM) and flag this assumption prominently.

**Constraint: 1280x720 at 30 fps imposes a throughput requirement of ~27.6 million pixels per second.** Each pixel must be processed within ~36 ns. This constrains the pipeline depth and parallelism required.

**Gap: "Edges of obstacles, not background clutter" implies semantic selectivity, but no definition of "obstacle" is given.** A standard edge detector (Sobel, Canny) responds to all intensity gradients, including texture, shadows, and ground patterns. Distinguishing obstacles from background requires either post-processing (morphological filtering, edge linking) or domain-specific tuning, but no criteria for that distinction are provided.

**Assumption: The input is raw grayscale or Bayer-pattern data.** The problem says "camera feed" but does not specify color format. I'll assume 8-bit grayscale to simplify the pipeline and note that a color pipeline would require a demosaicing stage.

### AI Solution (with embedded subtle issues)

```python
import numpy as np
from scipy.signal import convolve2d
from PIL import Image
import os
import time

def edge_detect(frame):
    """Apply Sobel edge detection to a grayscale frame."""
    # Sobel kernels
    Kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float64)
    Ky = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float64)

    Gx = convolve2d(frame, Kx, mode='same', boundary='fill')
    Gy = convolve2d(frame, Ky, mode='same', boundary='fill')

    magnitude = np.sqrt(Gx**2 + Gy**2)
    edges = (magnitude > 50).astype(np.uint8) * 255
    return edges

# Process sample frames
input_dir = 'frames/'
output_dir = 'edges/'
os.makedirs(output_dir, exist_ok=True)

frame_files = sorted([f for f in os.listdir(input_dir) if f.endswith('.png')])
times = []

for fname in frame_files:
    frame = np.array(Image.open(os.path.join(input_dir, fname)).convert('L'))
    t0 = time.time()
    edges = edge_detect(frame)
    times.append(time.time() - t0)
    Image.fromarray(edges).save(os.path.join(output_dir, fname))

avg_time = np.mean(times)
print(f"Average processing time: {avg_time*1000:.1f} ms/frame")
print(f"Throughput: {1/avg_time:.1f} fps")

# Resource estimates
print("\n=== Resource Usage Estimates ===")
print(f"Multiplications per frame: {1280 * 720 * 2 * 9:,}")  # 2 kernels, 9 mults each
print(f"Memory: {1280 * 3 * 8:,} bytes (3-line buffer)")
print(f"Latency: {1280 * 720 / 150e6 * 1000:.2f} ms (at 150 MHz clock)")
```

**Write-up excerpt:** "We use Sobel edge detection with a fixed threshold of 50. The pipeline can be mapped to an FPGA using a 3-line buffer for the sliding window and parallel multipliers for the two 3x3 kernels."

### Framing Feedback

**Criticism:** The student made several strong observations. The FPGA specification gap is correctly identified with a concrete assumption. The throughput calculation is well-quantified. The semantic selectivity concern is the most insightful observation — it goes beyond the technical pipeline to question whether the system can meet its functional requirement.

However, the student did not address image degradation factors specific to drone operation: motion blur from camera movement, varying illumination (sun glare, shadows), and noise from a small CMOS sensor. These factors directly affect edge detector performance and parameter selection. A Sobel edge detector tuned for clean indoor images will produce very different results on drone footage with motion blur and high-contrast shadows. The student also did not question whether the 30 fps throughput target includes the edge detection latency budget or whether there is additional downstream processing that competes for FPGA resources.

**Better Alternative:** Should have identified at least one environmental robustness factor (motion blur, illumination variation, noise) and questioned the latency budget allocation within the overall obstacle avoidance pipeline.

**Grade: A**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as the AI solution above)

#### Judging Sub-step


gaps:
  - name: "The requirement is \"edges of obstacles, not background"
    description: "The requirement is \"edges of obstacles, not background clutter,\" but no mechanism exists to distinguish obstacle edges from background. The output will be overwhelmed with irrelevant edges, making it useless for obstacle avoidance."
  - name: "Each 3x3 Sobel convolution requires 6 multiplications"
    description: "Each 3x3 Sobel convolution requires 6 multiplications (exploiting symmetry) and 8 additions, not 9 multiplications. The memory estimate of 3 line buffers is correct in concept but the calculation `1280 * 3 * 8` uses 8 bytes per pixel (float64), whereas an FPGA implementation would use 8-bit integers (1 byte per pixel)."
  - name: "Gap: The FPGA mapping discussion is superficial."
    description: "\"Use a 3-line buffer and parallel multipliers\" is a sentence, not a design document. There is no analysis of DSP slice usage, BRAM utilization, clock frequency requirement, or pipeline architecture."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Apply Gaussian blur before Sobel to reduce texture"
    description: "Apply Gaussian blur before Sobel to reduce texture sensitivity, use hysteresis thresholding (Canny-style) instead of a single threshold, and add morphological closing to connect edge fragments and remove isolated noise edges."
  - name: "Count multiplications, additions, and comparisons separately"
    description: "Count multiplications, additions, and comparisons separately. Account for the Gaussian pre-filter stage. Compute BRAM usage for line buffers at 1 byte per pixel."
  - name: "Correction: Expand the FPGA mapping section to include"
    description: "Correction: Expand the FPGA mapping section to include: DSP slice count, BRAM tile count, estimated clock frequency, pipeline architecture (streaming pixel-by-pixel vs. frame-buffered), and comparison against the assumed FPGA's resource budget."

#### Updated AI Output

```python
import numpy as np
from scipy.signal import convolve2d
from scipy.ndimage import gaussian_filter, binary_dilation, binary_erosion
from PIL import Image
import os

def edge_detect_pipeline(frame, sigma=1.5, low_thresh=20, high_thresh=60,
                          morph_kernel_size=3):
    """
    Edge detection pipeline:
    1. Gaussian blur (noise/texture suppression)
    2. Sobel gradient computation
    3. Hysteresis thresholding (Canny-style)
    4. Morphological closing (edge linking)
    """
    # Stage 1: Gaussian blur
    blurred = gaussian_filter(frame.astype(np.float64), sigma=sigma)

    # Stage 2: Sobel
    Kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    Ky = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
    Gx = convolve2d(blurred, Kx, mode='same', boundary='fill')
    Gy = convolve2d(blurred, Ky, mode='same', boundary='fill')
    magnitude = np.sqrt(Gx**2 + Gy**2)

    # Stage 3: Hysteresis thresholding
    strong = magnitude > high_thresh
    weak = (magnitude > low_thresh) & ~strong

    # Connect weak edges adjacent to strong edges
    edges = strong.copy()
    struct = np.ones((3, 3))
    for _ in range(3):
        dilated = binary_dilation(edges, structure=struct)
        edges = edges | (weak & dilated)

    # Stage 4: Morphological closing
    kernel = np.ones((morph_kernel_size, morph_kernel_size))
    edges = binary_dilation(edges, structure=kernel, iterations=1)
    edges = binary_erosion(edges, structure=kernel, iterations=1)

    return (edges.astype(np.uint8) * 255)

# Process frames
input_dir = 'frames/'
output_dir = 'edges/'
os.makedirs(output_dir, exist_ok=True)

for fname in sorted(os.listdir(input_dir)):
    if fname.endswith('.png'):
        frame = np.array(Image.open(os.path.join(input_dir, fname)).convert('L'))
        edges = edge_detect_pipeline(frame)
        Image.fromarray(edges).save(os.path.join(output_dir, fname))

# === RESOURCE USAGE ESTIMATES (8-bit fixed-point FPGA implementation) ===
W, H = 1280, 720
PIXELS = W * H

# Stage 1: 5x5 Gaussian (separable = two 1x5 passes)
gauss_mults_per_pixel = 5 + 5       # 10 (separable)
gauss_adds_per_pixel = 4 + 4        # 8 (separable)
gauss_line_buffers = 4              # 4-line buffer for 5-tap vertical

# Stage 2: 3x3 Sobel (exploit coefficient symmetry: 2 mults per kernel, 8 adds)
sobel_mults_per_pixel = 2 * 2       # 4 total (Kx + Ky, using symmetry)
sobel_adds_per_pixel = 2 * 8        # 16 total
sobel_line_buffers = 2              # 2-line buffer for 3-tap vertical

# Stage 3: Magnitude approximation |Gx| + |Gy| (no multiplier, just absolute + add)
mag_adds_per_pixel = 3              # abs(Gx) + abs(Gy) + threshold compare

# Stage 4: Morphological (3x3 OR/AND operations)
morph_line_buffers = 2
morph_ops_per_pixel = 18            # 9 compare + 9 compare

total_mults = (gauss_mults_per_pixel + sobel_mults_per_pixel) * PIXELS
total_adds = (gauss_adds_per_pixel + sobel_adds_per_pixel + mag_adds_per_pixel) * PIXELS
total_line_buffers = gauss_line_buffers + sobel_line_buffers + morph_line_buffers  # = 8

print("=== FPGA Resource Usage Estimates ===")
print(f"Resolution: {W}x{H} @ 30 fps")
print(f"\nPer-frame operations:")
print(f"  Multiplications: {total_mults:,}")
print(f"  Additions:       {total_adds:,}")
print(f"\nBRAM usage (line buffers):")
print(f"  Lines needed:    {total_line_buffers}")
print(f"  Bytes:           {total_line_buffers * W:,} ({total_line_buffers * W / 1024:.1f} KB)")
print(f"\nDSP slice estimate:")
print(f"  Gaussian (separable): 10 DSP slices (5 per axis)")
print(f"  Sobel:                4 DSP slices")
print(f"  Total:                14 DSP slices")
print(f"\nClock requirement:")
print(f"  Pixels/sec:      {PIXELS * 30:,}")
print(f"  At 1 pixel/clock: {PIXELS * 30 / 1e6:.1f} MHz minimum")
print(f"\nTarget FPGA: Xilinx Artix-7 XC7A200T")
print(f"  Available DSP:   740 (using {14/740*100:.1f}%)")
print(f"  Available BRAM:  365 KB (using {total_line_buffers * W / 1024 / 365 * 100:.2f}%)")
print(f"  Verdict:         FITS with large margin")
```

#### Judging Feedback

**Criticism:** The student made three strong observations. The background clutter issue is the most important — it directly addresses the functional requirement gap. The resource estimate corrections are technically accurate (symmetry exploitation, 8-bit vs. float64). The FPGA mapping weakness is a valid deliverable concern. However, the student did not catch that the magnitude computation uses `np.sqrt(Gx**2 + Gy**2)`, which requires a square root operation. On an FPGA, square root is expensive. The common FPGA approximation `|Gx| + |Gy|` avoids this entirely, and the AI's updated solution mentions it in the resource estimate section but still uses `np.sqrt` in the actual code — an inconsistency.

**Better Alternative:** Should have flagged the sqrt inconsistency between the code (uses sqrt) and the FPGA resource estimate (assumes |Gx| + |Gy| approximation).

**Grade: A**

#### Steering Feedback

**Criticism:** The Gaussian pre-filter and hysteresis thresholding suggestions are well-targeted for clutter suppression. The 8-bit resource re-estimate is the correct approach for FPGA analysis. The expanded FPGA section with DSP slice and BRAM counts provides actionable estimates. However, the student's Gaussian blur suggestion adds significant computational cost — a 5x5 Gaussian kernel adds 10 multiplications per pixel and requires 4 additional line buffers. The student did not consider lighter alternatives such as a 3x3 box filter (no multiplications, just shifts and adds) or bilateral filtering for edge-preserving smoothing. Additionally, the morphological closing with iterative dilation/erosion is expensive on an FPGA due to multi-pass requirements.

**Better Alternative:** Should have considered computationally cheaper pre-filtering alternatives suitable for FPGA implementation and flagged the morphological operations' multi-pass cost.

**Grade: B**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1 above)

#### Judging Sub-step


gaps:
  - name: "2 + Gy2)` but the resource estimate assumes `|Gx| + |Gy|`"
    description: "2 + Gy2)` but the resource estimate assumes `|Gx| + |Gy|`. This is an inconsistency — the simulation does not match the proposed FPGA implementation. The FPGA design document should be consistent with the simulated pipeline."
  - name: "A drone flying outdoors will encounter strong shadows"
    description: "A drone flying outdoors will encounter strong shadows, sun glare, and motion-induced blur, all of which affect edge detection. No robustness analysis or adaptive thresholding is included."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Correction: Replace `np.sqrt(Gx"
    description: "2 + Gy2)` with `np.abs(Gx) + np.abs(Gy)` in the simulation to match the FPGA resource estimate. This also eliminates the need for a multiplier in the magnitude computation stage, simplifying the FPGA mapping."
  - name: "Instead of fixed thresholds, compute the threshold as a"
    description: "Instead of fixed thresholds, compute the threshold as a function of the local mean and standard deviation of the gradient magnitude. This helps handle varying illumination conditions across the frame."

#### Updated AI Output

```python
import numpy as np
from scipy.signal import convolve2d
from scipy.ndimage import gaussian_filter, binary_dilation, binary_erosion
from scipy.ndimage import uniform_filter
from PIL import Image
import os

def edge_detect_pipeline(frame, sigma=1.5, k_low=0.5, k_high=1.5,
                          morph_size=3, adapt_window=31):
    """
    FPGA-targeted edge detection pipeline:
    1. Gaussian blur (texture/noise suppression)
    2. Sobel gradient (|Gx| + |Gy| approximation)
    3. Adaptive hysteresis thresholding
    4. Morphological closing
    """
    # Stage 1: Gaussian blur
    blurred = gaussian_filter(frame.astype(np.float64), sigma=sigma)

    # Stage 2: Sobel with FPGA-compatible magnitude
    Kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    Ky = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
    Gx = convolve2d(blurred, Kx, mode='same', boundary='fill')
    Gy = convolve2d(blurred, Ky, mode='same', boundary='fill')
    magnitude = np.abs(Gx) + np.abs(Gy)  # FPGA-friendly approximation

    # Stage 3: Adaptive thresholding
    local_mean = uniform_filter(magnitude, size=adapt_window)
    local_std = np.sqrt(uniform_filter(magnitude**2, size=adapt_window) - local_mean**2)
    local_std = np.maximum(local_std, 1.0)  # avoid division by zero

    low_thresh = local_mean + k_low * local_std
    high_thresh = local_mean + k_high * local_std

    strong = magnitude > high_thresh
    weak = (magnitude > low_thresh) & ~strong

    edges = strong.copy()
    struct = np.ones((3, 3))
    for _ in range(3):
        dilated = binary_dilation(edges, structure=struct)
        edges = edges | (weak & dilated)

    # Stage 4: Morphological closing
    kernel = np.ones((morph_size, morph_size))
    edges = binary_dilation(edges, structure=kernel, iterations=1)
    edges = binary_erosion(edges, structure=kernel, iterations=1)

    return (edges.astype(np.uint8) * 255)

# Process frames
input_dir = 'frames/'
output_dir = 'edges/'
os.makedirs(output_dir, exist_ok=True)

for fname in sorted(os.listdir(input_dir)):
    if fname.endswith('.png'):
        frame = np.array(Image.open(os.path.join(input_dir, fname)).convert('L'))
        edges = edge_detect_pipeline(frame)
        Image.fromarray(edges).save(os.path.join(output_dir, fname))

# === RESOURCE ESTIMATES (updated, consistent with simulation) ===
W, H = 1280, 720
PIXELS = W * H

# All stages use 8-bit fixed-point on FPGA
# Magnitude: |Gx| + |Gy| (no sqrt, no multiplier for this stage)

gauss_mults = 10  # separable 5-tap: 5+5
gauss_adds = 8
gauss_lines = 4

sobel_mults = 4   # symmetry-exploited
sobel_adds = 16
sobel_lines = 2

mag_adds = 3      # |Gx| + |Gy| + threshold compare
mag_mults = 0     # no sqrt needed

# Adaptive threshold: local mean via box filter (no multiplier, shift-based)
adapt_lines = 30  # 31-tap vertical buffer
adapt_adds = 4    # running sum updates

morph_lines = 2
morph_ops = 18

total_dsp = gauss_mults + sobel_mults  # 14 DSP slices
total_bram_bytes = (gauss_lines + sobel_lines + adapt_lines + morph_lines) * W
total_clock_mhz = PIXELS * 30 / 1e6

print("=== UPDATED RESOURCE ESTIMATES ===")
print(f"Target: {W}x{H} @ 30 fps")
print(f"\nDSP slices: {total_dsp} (Artix-7 200T has 740 -> {total_dsp/740*100:.1f}%)")
print(f"BRAM: {total_bram_bytes:,} bytes = {total_bram_bytes/1024:.1f} KB "
      f"(Artix-7 200T has 365 KB -> {total_bram_bytes/1024/365*100:.1f}%)")
print(f"Clock: {total_clock_mhz:.1f} MHz minimum (1 pixel/clock)")
print(f"\nPer-frame multiplications: {(gauss_mults + sobel_mults) * PIXELS:,}")
print(f"Per-frame additions: {(gauss_adds + sobel_adds + mag_adds + adapt_adds) * PIXELS:,}")
print(f"\nNote: Adaptive thresholding adds {adapt_lines} line buffers ({adapt_lines*W/1024:.1f} KB)")
print(f"      This is the dominant BRAM consumer.")
print(f"\n=== FPGA DESIGN NOTES ===")
print(f"Architecture: Streaming pixel pipeline, 1 pixel/clock")
print(f"  - All stages operate on a sliding window using line buffers")
print(f"  - Gaussian is implemented as separable 1D filters (horizontal then vertical)")
print(f"  - Sobel uses hardwired shift-and-add (coefficients are powers of 2)")
print(f"  - Adaptive threshold uses a running-sum box filter (no multiplier)")
print(f"  - Pipeline latency: ~{gauss_lines + sobel_lines + 2} lines = "
      f"{(gauss_lines + sobel_lines + 2)/H*1000/30:.2f} ms")
print(f"  - ASSUMPTION: Target FPGA is Artix-7 XC7A200T. Must be verified.")
```

#### Judging Feedback

**Criticism:** Both observations are valid. The sqrt inconsistency is a concrete code-vs-design-document mismatch that would cause simulation results to differ from FPGA behavior. The illumination robustness concern is relevant for a drone application. However, the student did not flag that the adaptive thresholding with a 31x31 window requires 30 additional line buffers on the FPGA, which becomes the dominant BRAM consumer. For a resource-constrained FPGA, this is a significant cost that should be analyzed. The student also did not note that the hysteresis thresholding requires iterative dilation (the `for _ in range(3)` loop), which cannot be implemented as a single-pass streaming pipeline on an FPGA without significant architectural changes.

**Better Alternative:** Should have flagged the BRAM cost of adaptive thresholding and the non-streaming nature of iterative hysteresis thresholding.

**Grade: B**

#### Steering Feedback

**Criticism:** The sqrt-to-absolute-value fix is correct and important for FPGA consistency. The adaptive thresholding suggestion addresses illumination variation, which is a real drone-specific concern. However, the student did not consider the FPGA implementation cost of adaptive thresholding — a 31x31 local statistics window requires 30 line buffers and computing a local variance, which involves squaring and accumulating. This substantially increases BRAM usage and may require additional DSP slices. A more FPGA-friendly alternative would be a simpler adaptive scheme, such as dividing the frame into tiles and computing per-tile thresholds, or using a smaller window with a recursive running-mean implementation.

**Better Alternative:** Should have steered toward an FPGA-efficient adaptive thresholding scheme (tile-based or small-window recursive) and flagged the iterative hysteresis as non-streamable.

**Grade: B**

---

### Cycle 3

#### Student marks: **Done**

---

## Completion

| Skill    | Grade |
| -------- | ----- |
| Framing  | A     |
| Judging  | B     |
| Steering | B     |

### Summary Feedback

The student demonstrated good awareness of both signal processing and FPGA constraints. Framing was strong — identifying the unspecified FPGA, throughput constraints, and the semantic selectivity gap showed broad thinking. Judging correctly caught the most visible issues (background clutter, resource estimate errors, sqrt inconsistency) but consistently missed FPGA-specific implementation concerns such as the cost of adaptive thresholding in BRAM and the non-streaming nature of iterative morphological operations. Steering directions improved the algorithm's functional correctness but did not adequately consider hardware implementation costs — adding a 31x31 adaptive window and iterative hysteresis without analyzing their FPGA resource impact shows a gap between algorithmic thinking and hardware-aware design. The student should develop stronger intuition for mapping algorithms to streaming hardware architectures, particularly around line buffer costs and single-pass processing constraints.
