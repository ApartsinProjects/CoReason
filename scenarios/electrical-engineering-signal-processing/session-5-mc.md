# Session 5 — Multiple Choice: Design an FPGA-Targeted Edge Detection Pipeline for Drone Video

**Mode:** Multiple Choice

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Design a 2D convolution-based edge detection pipeline for a drone camera feed and deliver a Python simulation that processes a set of sample frames (1280x720, 30 fps) and outputs edge-detected images suitable for downstream obstacle avoidance. Deliver the simulation code, a resource-usage estimate table (multiplications per frame, memory footprint, estimated latency), and a one-page design document explaining how the pipeline would map to an FPGA. The flight controller team says they need "edges of obstacles, not background clutter" and that the processing must "fit on our current FPGA" without specifying which FPGA.

### Student's Framing Response

**Which of the following issues should be raised before starting this problem?**

- **(A) The target FPGA is unspecified — resource usage estimates cannot be evaluated against a concrete feasibility baseline without knowing the device** [SELECTED]
- (B) 2D convolution is computationally intractable for real-time video and should be replaced with frequency-domain processing
- **(C) "Edges of obstacles, not background clutter" requires semantic discrimination that a generic edge detector cannot provide without additional criteria or post-processing** [SELECTED]
- (D) 1280x720 resolution is too high for an FPGA — the frame should be downsampled to 640x360 before processing
- (E) Motion blur, illumination variation, and sensor noise from drone flight conditions are unmentioned but directly affect edge detection quality

**Student selected: A, C**

### AI Solution (with embedded subtle issues)

```python
import numpy as np
from scipy.signal import convolve2d
from PIL import Image
import os

def sobel_edges(frame):
    Kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], dtype=np.float64)
    Ky = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]], dtype=np.float64)

    Gx = convolve2d(frame, Kx, mode='same', boundary='fill')
    Gy = convolve2d(frame, Ky, mode='same', boundary='fill')

    magnitude = np.sqrt(Gx**2 + Gy**2)
    edges = (magnitude > 50).astype(np.uint8) * 255
    return edges

input_dir = 'frames/'
output_dir = 'edges/'
os.makedirs(output_dir, exist_ok=True)

for fname in sorted(os.listdir(input_dir)):
    if fname.endswith('.png'):
        frame = np.array(Image.open(os.path.join(input_dir, fname)).convert('L'))
        edges = sobel_edges(frame)
        Image.fromarray(edges).save(os.path.join(output_dir, fname))

# Resource estimates
W, H = 1280, 720
print("=== Resource Estimates ===")
print(f"Multiplications per frame: {W * H * 2 * 9:,}")
print(f"Memory: {W * 3 * 8:,} bytes")
print(f"Latency: {W * H / 150e6 * 1000:.2f} ms")
```

### Framing Feedback

**Criticism:** The student selected two important issues. Option (A) correctly identifies that resource feasibility cannot be evaluated without a specific FPGA target. Option (C) highlights the semantic gap between generic edge detection and obstacle-specific detection. Both are strong choices.

However, the student missed option (E), which addresses real-world robustness factors that directly affect the algorithm's practical effectiveness. A drone camera encounters motion blur, changing illumination, and sensor noise — conditions that can cause a Sobel edge detector to either miss true edges or hallucinate false ones. This is particularly critical for an obstacle avoidance application where missed edges have safety implications. The student focused on specification gaps but neglected operational environment concerns.

**Better Alternative:** The strongest selection would be A, C, and E. All three address different dimensions of the problem's under-specification: hardware target, functional requirements, and operating conditions.

**Grade: B**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as AI solution above)

#### Judging Sub-step

**Which issues exist in the AI's solution? (select all that apply)**

- **(A) A fixed threshold of 50 produces edges from all gradient sources — texture, shadows, ground patterns — violating the "obstacles not clutter" requirement** [SELECTED]
- **(B) The resource estimate counts 9 multiplications per pixel per kernel, but Sobel coefficients are {-2,-1,0,1,2} which can be implemented with shifts and adds, requiring far fewer actual multipliers** [SELECTED]
- (C) The `convolve2d` function produces incorrect results at image boundaries due to zero-padding
- (D) The Sobel operator is too old — a modern CNN-based edge detector should be used instead
- **(E) The gradient magnitude uses `sqrt(Gx^2 + Gy^2)` which is expensive on an FPGA — the approximation `|Gx| + |Gy|` is standard for hardware** [SELECTED]

**Student selected: A, B, E**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Replace Sobel with Canny edge detection using OpenCV's built-in implementation
- **(B) Add Gaussian pre-filtering and hysteresis thresholding for clutter suppression, use `|Gx| + |Gy|` for FPGA-compatible magnitude, and recompute resource estimates with shift-add Sobel implementation** [SELECTED]
- (C) Implement a Laplacian of Gaussian (LoG) edge detector for scale-space edge detection
- (D) Add a morphological skeleton operation to thin the detected edges
- (E) Use a Prewitt operator instead of Sobel for lower computational cost

**Student selected: B**

#### Updated AI Output

```python
import numpy as np
from scipy.signal import convolve2d
from scipy.ndimage import gaussian_filter, binary_dilation
from PIL import Image
import os

def edge_detect(frame, sigma=1.5, low_thresh=20, high_thresh=60):
    """FPGA-targeted edge detection pipeline."""
    # Stage 1: Gaussian blur (texture suppression)
    blurred = gaussian_filter(frame.astype(np.float64), sigma=sigma)

    # Stage 2: Sobel gradients
    Kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    Ky = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
    Gx = convolve2d(blurred, Kx, mode='same', boundary='fill')
    Gy = convolve2d(blurred, Ky, mode='same', boundary='fill')

    # FPGA-compatible magnitude approximation
    magnitude = np.abs(Gx) + np.abs(Gy)

    # Stage 3: Hysteresis thresholding
    strong = magnitude > high_thresh
    weak = (magnitude > low_thresh) & ~strong

    edges = strong.copy()
    struct = np.ones((3, 3))
    for _ in range(3):
        dilated = binary_dilation(edges, structure=struct)
        edges = edges | (weak & dilated)

    return (edges.astype(np.uint8) * 255)

# Process frames
input_dir = 'frames/'
output_dir = 'edges/'
os.makedirs(output_dir, exist_ok=True)

for fname in sorted(os.listdir(input_dir)):
    if fname.endswith('.png'):
        frame = np.array(Image.open(os.path.join(input_dir, fname)).convert('L'))
        edges = edge_detect(frame)
        Image.fromarray(edges).save(os.path.join(output_dir, fname))

# === FPGA Resource Estimates (8-bit fixed-point) ===
W, H = 1280, 720
PIXELS = W * H

print("=== FPGA Resource Estimates ===")
print(f"Resolution: {W}x{H} @ 30 fps\n")

# Gaussian 5x5 separable: 5 mults + 4 adds per axis = 10 mults, 8 adds total
# Sobel: shift-add only (coefficients 1,2 = shift by 0,1). 0 multipliers, 8 adds per kernel
# Magnitude: |Gx| + |Gy| = 2 abs + 1 add, no multiplier
# Hysteresis: 2 comparisons + 3x3 neighbor check per pixel

gauss_dsp = 10  # DSP slices for Gaussian
sobel_dsp = 0   # shift-add implementation
total_dsp = gauss_dsp

line_buffers = 4 + 2 + 2  # Gaussian(4) + Sobel(2) + hysteresis(2)
bram_bytes = line_buffers * W
clock_mhz = PIXELS * 30 / 1e6

print(f"DSP slices needed: {total_dsp}")
print(f"  Gaussian (separable 5-tap): {gauss_dsp}")
print(f"  Sobel (shift-add):          {sobel_dsp}")
print(f"Line buffers: {line_buffers} ({bram_bytes:,} bytes = {bram_bytes/1024:.1f} KB)")
print(f"Clock: {clock_mhz:.1f} MHz (1 pixel/clock)")
print(f"\nPer-frame operations:")
print(f"  Multiplications: {gauss_dsp * PIXELS:,}")
print(f"  Additions:       {(8 + 16 + 3 + 18) * PIXELS:,}")
print(f"\nAssumed target: Artix-7 XC7A200T")
print(f"  DSP utilization:  {total_dsp}/740 = {total_dsp/740*100:.1f}%")
print(f"  BRAM utilization: {bram_bytes/1024:.1f}/{365*1024:.0f} KB = {bram_bytes/(365*1024)*100:.2f}%")
print(f"  Verdict: FITS with large margin")
```

#### Judging Feedback

**Criticism:** All three selections are correct and demonstrate strong technical judgment. The fixed-threshold issue (A) directly addresses the functional requirement. The shift-add Sobel observation (B) shows hardware awareness — recognizing that Sobel coefficients are powers of 2 eliminates multipliers entirely. The sqrt-to-absolute-value fix (E) is the standard FPGA optimization. The student correctly avoided (C) — zero-padding at boundaries is a minor issue, and (D) — CNNs require massive FPGA resources beyond the scope of this problem.

**Better Alternative:** No better selection exists.

**Grade: A**

#### Steering Feedback

**Criticism:** Option (B) is the most comprehensive correction, addressing all three identified issues. The Gaussian pre-filter reduces texture sensitivity, hysteresis thresholding improves edge quality, the FPGA-compatible magnitude is correct, and updated resource estimates reflect actual hardware costs. This is the strongest available option.

However, option (A) is a weaker version of the same idea (uses OpenCV's Canny, which is a black box not suitable for FPGA mapping). Options (C), (D), and (E) are either irrelevant or insufficient.

**Better Alternative:** No better option exists.

**Grade: A**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1)

#### Judging Sub-step

**Which issues remain in the updated solution? (select all that apply)**

- **(A) The hysteresis thresholding uses iterative dilation (3 iterations), which cannot be implemented as a single-pass streaming pipeline on an FPGA** [SELECTED]
- (B) The Gaussian sigma of 1.5 is too aggressive and will blur obstacle edges beyond detection
- **(C) The design document does not discuss the pipeline architecture — how stages are connected, buffered, and clocked in the FPGA** [SELECTED]
- (D) The 8-line buffer total underestimates BRAM usage because each line must be double-buffered
- (E) The edge detection should operate on RGB channels independently for better obstacle detection

**Student selected: A, C**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Replace hysteresis thresholding with a simpler dual-threshold approach that does not require iteration
- (B) Add non-maximum suppression before thresholding for single-pixel-wide edges
- **(C) Replace iterative hysteresis with a single-pass connected-component labeling approach and add a pipeline architecture section describing stage-by-stage streaming data flow** [SELECTED]
- (D) Implement the entire pipeline in Verilog instead of Python for accurate resource estimation
- (E) Add a frame differencing stage to detect moving obstacles

**Student selected: C**

#### Updated AI Output

```python
import numpy as np
from scipy.signal import convolve2d
from scipy.ndimage import gaussian_filter
from PIL import Image
import os

def edge_detect_fpga(frame, sigma=1.5, low_thresh=20, high_thresh=60):
    """
    FPGA-friendly edge detection pipeline.
    All stages are single-pass streaming compatible.
    """
    # Stage 1: Gaussian blur (separable, streaming)
    blurred = gaussian_filter(frame.astype(np.float64), sigma=sigma)

    # Stage 2: Sobel (streaming, shift-add)
    Kx = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    Ky = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
    Gx = convolve2d(blurred, Kx, mode='same', boundary='fill')
    Gy = convolve2d(blurred, Ky, mode='same', boundary='fill')
    magnitude = np.abs(Gx) + np.abs(Gy)

    # Stage 3: Non-maximum suppression (streaming, 3x3 window)
    direction = np.arctan2(Gy, Gx)
    direction = np.round(direction / (np.pi/4)) * (np.pi/4)
    H, W = magnitude.shape
    nms = np.zeros_like(magnitude)
    for i in range(1, H-1):
        for j in range(1, W-1):
            angle = direction[i, j]
            if angle in [0, np.pi, -np.pi]:
                neighbors = [magnitude[i, j-1], magnitude[i, j+1]]
            elif angle in [np.pi/4, -3*np.pi/4]:
                neighbors = [magnitude[i-1, j+1], magnitude[i+1, j-1]]
            elif angle in [np.pi/2, -np.pi/2]:
                neighbors = [magnitude[i-1, j], magnitude[i+1, j]]
            else:
                neighbors = [magnitude[i-1, j-1], magnitude[i+1, j+1]]
            if magnitude[i, j] >= max(neighbors):
                nms[i, j] = magnitude[i, j]

    # Stage 4: Single-pass thresholding (no iteration needed)
    # Strong edges are kept; weak edges adjacent to strong edges are kept
    # via a single forward-backward scan (FPGA: use delayed strong-edge map)
    strong = nms > high_thresh
    weak = (nms > low_thresh) & ~strong

    # Forward scan: propagate strong edge labels rightward and downward
    edges = strong.copy()
    for i in range(1, H):
        for j in range(1, W):
            if weak[i, j] and (edges[i-1, j-1] or edges[i-1, j] or
                               edges[i, j-1]):
                edges[i, j] = True

    return (edges.astype(np.uint8) * 255)

# Process frames
input_dir = 'frames/'
output_dir = 'edges/'
os.makedirs(output_dir, exist_ok=True)

for fname in sorted(os.listdir(input_dir)):
    if fname.endswith('.png'):
        frame = np.array(Image.open(os.path.join(input_dir, fname)).convert('L'))
        edges = edge_detect_fpga(frame)
        Image.fromarray(edges).save(os.path.join(output_dir, fname))

# === RESOURCE ESTIMATES ===
W, H = 1280, 720
PIXELS = W * H
CLOCK_MHZ = 27.648  # = 1280 * 720 * 30 / 1e6

print("=== FPGA Resource Estimates ===")
print(f"Target: {W}x{H} @ 30 fps")
print(f"Pixel clock: {CLOCK_MHZ:.1f} MHz\n")

stages = {
    'Gaussian (5-tap sep.)': {'dsp': 10, 'lines': 4, 'adds': 8},
    'Sobel (shift-add)':     {'dsp': 0,  'lines': 2, 'adds': 16},
    'NMS (3x3)':             {'dsp': 0,  'lines': 2, 'adds': 8},
    'Threshold':             {'dsp': 0,  'lines': 1, 'adds': 2},
}

total_dsp = sum(s['dsp'] for s in stages.values())
total_lines = sum(s['lines'] for s in stages.values())
total_bram = total_lines * W

print(f"{'Stage':<25} {'DSP':>5} {'Lines':>6} {'Adds/px':>8}")
print("-" * 46)
for name, s in stages.items():
    print(f"{name:<25} {s['dsp']:>5} {s['lines']:>6} {s['adds']:>8}")
print("-" * 46)
print(f"{'TOTAL':<25} {total_dsp:>5} {total_lines:>6}")

print(f"\nBRAM: {total_bram:,} bytes = {total_bram/1024:.1f} KB")
print(f"Mults/frame: {total_dsp * PIXELS:,}")
total_adds = sum(s['adds'] for s in stages.values())
print(f"Adds/frame:  {total_adds * PIXELS:,}")

print(f"\n=== PIPELINE ARCHITECTURE ===")
print(f"""
    Pixel Stream In (8-bit, {CLOCK_MHZ:.1f} MHz)
         |
    +----v----+    Line buffers: 4 lines
    | Gaussian |   DSP slices: 10 (separable 5-tap)
    | 5x5 sep  |   Latency: 2 lines
    +----+----+
         |
    +----v----+    Line buffers: 2 lines
    |  Sobel   |   DSP slices: 0 (shift-add)
    | 3x3 grad |   Latency: 1 line
    +----+----+
         |
    +----v----+    Line buffers: 2 lines
    |   NMS    |   Comparators: 4
    | 3x3 win  |   Latency: 1 line
    +----+----+
         |
    +----v----+    Line buffers: 1 line
    | Thresh   |   Comparators: 2
    | fwd-scan |   Latency: 1 line
    +----+----+
         |
    Pixel Stream Out (1-bit)

    Total pipeline latency: 5 lines = {5/H*1000/30:.2f} ms
    Total BRAM: {total_lines} lines x {W} pixels = {total_bram/1024:.1f} KB
    Target: Artix-7 XC7A200T
    DSP: {total_dsp}/740 ({total_dsp/740*100:.1f}%)
    BRAM: {total_bram/1024:.1f} KB / 365 KB ({total_bram/(365*1024)*100:.2f}%)
""")
```

#### Judging Feedback

**Criticism:** Both selections demonstrate good FPGA awareness. Option (A) correctly identifies that iterative algorithms cannot be directly mapped to streaming FPGA pipelines — this is a fundamental hardware architecture constraint that many software-focused students miss. Option (C) identifies a deliverable gap in the design documentation. The student correctly avoided (B) — sigma=1.5 is a common pre-filter value, and (D) — double buffering is not required for streaming line buffers. Option (E) is incorrect for edge detection.

However, the student missed that the non-maximum suppression stage in the updated code uses `np.arctan2`, which computes a floating-point arctangent. On an FPGA, `atan2` is extremely expensive. The standard FPGA implementation uses simple magnitude comparisons of Gx and Gy to determine the edge direction octant, avoiding trigonometric functions entirely.

**Better Alternative:** Should have also identified the `arctan2` as an FPGA-incompatible operation.

**Grade: A**

#### Steering Feedback

**Criticism:** Option (C) addresses both identified issues — replacing iterative hysteresis with a streaming-compatible approach and adding pipeline documentation. This is a reasonable choice. However, the "connected-component labeling" mentioned in the option description is itself a non-streaming algorithm that requires multiple passes over the image. The AI's implementation used a forward-scan approximation instead, which is streaming-compatible but only propagates labels in one direction (missing edges connected through upward or leftward paths). The student should have been more specific about what "single-pass" means in this context.

Option (A) — a simpler dual-threshold without edge linking — would have been more honestly streaming-compatible, though at the cost of edge quality. Option (B) — non-maximum suppression — is complementary and was incorporated by the AI regardless.

**Better Alternative:** Option (A) would have been a cleaner streaming solution. The student's choice was reasonable but the implementation has a directional bias that should be acknowledged.

**Grade: B**

---

### Cycle 3

#### Student marks: **Done**

---

## Completion

| Skill    | Grade |
| -------- | ----- |
| Framing  | B     |
| Judging  | A     |
| Steering | B     |

### Summary Feedback

The student demonstrated strong judgment in identifying code-level issues and functional requirement gaps. Framing correctly identified the two most concrete specification problems (FPGA target, semantic selectivity) but missed environmental robustness concerns that are critical for drone applications. Judging was consistently strong, with excellent identification of FPGA-incompatible operations (sqrt, iterative dilation) and resource estimate errors (Sobel shift-add optimization). The student's hardware awareness is above average. Steering was competent but occasionally lacked precision — the connected-component labeling suggestion was conceptually appropriate but the implementation has a directional bias, and the arctan2 issue in the updated code went unaddressed. The student should deepen their understanding of streaming pipeline constraints, particularly around operations that inherently require multi-pass processing (connected components, iterative morphology) and those that have standard FPGA-friendly approximations (magnitude comparison for direction instead of atan2).
