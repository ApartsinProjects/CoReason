# Session 2 — Open-Ended: Design a Multi-Rate Audio Codec Prototype

**Mode:** Open-Ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a MATLAB or Python prototype of a sample-rate conversion module that takes a 96 kHz / 24-bit studio master track and produces three output files: a "high" stream, a "standard" stream, and a "low" stream suitable for mobile playback over limited bandwidth. Deliver the conversion code, a table comparing THD+N and SNR measurements for each output quality tier, and a block diagram of your signal processing pipeline. The product manager says "just make sure it sounds good" and that the low tier should "use as little bandwidth as possible."

### Student's Framing Response

**Assumption: "High" = 48 kHz/16-bit, "Standard" = 44.1 kHz/16-bit, "Low" = 22.05 kHz/16-bit.** These are standard rates used in consumer audio. The high tier matches professional playback, standard matches CD quality, and low is suitable for speech-oriented mobile playback.

**Constraint: The 96-to-44.1 kHz conversion is non-integer ratio (160/147), requiring a rational rate converter.** A simple decimation-by-integer won't work here. We'll need interpolation followed by decimation, or a polyphase implementation.

**Gap: "Sounds good" has no engineering definition.** I'll use THD+N < -90 dB and SNR > 90 dB as targets for the high tier, relaxing to THD+N < -70 dB and SNR > 70 dB for the low tier.

### AI Solution (with embedded subtle issues)

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample, firwin, lfilter
import matplotlib.pyplot as plt

def convert_rate(data, fs_in, fs_out):
    """Simple resampling using scipy.signal.resample"""
    num_samples = int(len(data) * fs_out / fs_in)
    return resample(data, num_samples)

def quantize(data, bits):
    """Reduce bit depth"""
    scale = 2**(bits - 1)
    return np.round(data * scale) / scale

# Load 96 kHz / 24-bit master
fs_master = 96000
master = np.random.randn(96000 * 10)  # placeholder 10s signal
master = master / np.max(np.abs(master))  # normalize

# --- High: 48 kHz / 16-bit ---
high = convert_rate(master, 96000, 48000)
high = quantize(high, 16)

# --- Standard: 44.1 kHz / 16-bit ---
standard = convert_rate(master, 96000, 44100)
standard = quantize(standard, 16)

# --- Low: 22.05 kHz / 16-bit ---
low = convert_rate(master, 96000, 22050)
low = quantize(low, 16)

# --- THD+N and SNR measurements ---
def compute_thd_n(original, processed, fs_in, fs_out):
    ref = convert_rate(original, fs_in, fs_out)
    ref = ref[:len(processed)]
    noise = processed - ref
    thd_n = 10 * np.log10(np.mean(noise**2) / np.mean(ref**2))
    return thd_n

def compute_snr(signal):
    return 10 * np.log10(np.mean(signal**2) / (1.0 / (2**16))**2)

print("Quality Metrics:")
print(f"High  (48k):  THD+N = {compute_thd_n(master, high, 96000, 48000):.1f} dB")
print(f"Std   (44.1k): THD+N = {compute_thd_n(master, standard, 96000, 44100):.1f} dB")
print(f"Low   (22k):  THD+N = {compute_thd_n(master, low, 96000, 22050):.1f} dB")
print(f"High SNR:  {compute_snr(high):.1f} dB")
print(f"Std  SNR:  {compute_snr(standard):.1f} dB")
print(f"Low  SNR:  {compute_snr(low):.1f} dB")
```

**Block diagram:** "Input (96k/24-bit) -> Resample -> Quantize -> Output"

### Framing Feedback

**Criticism:** The student made a strong observation about the non-integer conversion ratio for 44.1 kHz and proposed concrete numeric targets for quality metrics. However, several important issues were missed. The student did not question what "bandwidth" means in the product manager's context — it could mean network bitrate (requiring lossy compression, not just sample rate reduction) rather than audio bandwidth. The student also chose to keep all tiers at 16-bit, which means the "low" tier only reduces sample rate without addressing the bit-depth axis of the quality/bandwidth trade-off. Additionally, the student did not flag that reducing to 22.05 kHz limits audio bandwidth to ~10 kHz, which is acceptable for speech but may be too aggressive for music.

**Better Alternative:** Should have questioned whether "bandwidth" means network throughput (bits/second) or audio bandwidth, proposed variable bit depths (e.g., 12-bit for low tier), and flagged the perceptual impact of a 10 kHz audio bandwidth limit on music.

**Grade: B**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as AI solution above)

#### Judging Sub-step


gaps:
  - name: "For the 96k-to-48k conversion (factor of 2), this may be"
    description: "For the 96k-to-48k conversion (factor of 2), this may be acceptable since `resample` implicitly bandlimits, but for non-integer ratios the spectral truncation in the frequency domain can introduce Gibbs-phenomenon-like ringing."
  - name: "Truncation or rounding without dither creates correlated"
    description: "Truncation or rounding without dither creates correlated quantization noise that manifests as harmonic distortion, especially at low signal levels. This will inflate THD+N measurements."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Use `scipy.signal.upfirdn` with a properly designed FIR"
    description: "Use `scipy.signal.upfirdn` with a properly designed FIR anti-aliasing/anti-imaging filter. The filter should have a passband up to 20 kHz and a stopband starting at 22.05 kHz."
  - name: "Correction: Add TPDF dither before quantization."
    description: "Generate triangular-PDF noise with amplitude of 2 LSBs and add it to the signal before rounding. This de-correlates quantization noise from the signal."
  - name: "Correction: Expand the block diagram to show separate"
    description: "Correction: Expand the block diagram to show separate paths for each tier, with explicit anti-aliasing filter, rate change, dither, and quantization stages."

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import firwin, upfirdn
import matplotlib.pyplot as plt

def rational_resample(data, up, down, num_taps=8192):
    """Rational rate conversion with polyphase FIR filter"""
    # Design anti-aliasing/anti-imaging filter
    cutoff = min(1.0/up, 1.0/down) * 0.95  # slight margin
    fir = firwin(num_taps, cutoff, window='kaiser', beta=10) * up
    return upfirdn(fir, data, up, down)

def quantize_with_dither(data, bits):
    """Quantize with TPDF dither"""
    scale = 2**(bits - 1)
    # TPDF dither: sum of two uniform [-0.5, 0.5) LSB noise sources
    dither = (np.random.uniform(-0.5, 0.5, len(data)) +
              np.random.uniform(-0.5, 0.5, len(data))) / scale
    return np.round((data + dither) * scale) / scale

# Load master
fs_master = 96000
master = np.random.randn(96000 * 10)
master = master / np.max(np.abs(master)) * 0.9  # headroom

# --- High: 96k -> 48k (decimate by 2) ---
high = rational_resample(master, 1, 2)
high = quantize_with_dither(high, 16)

# --- Standard: 96k -> 44.1k (up 147, down 320) ---
# 96000 * 147 / 320 = 44100
standard = rational_resample(master, 147, 320)
standard = quantize_with_dither(standard, 16)

# --- Low: 96k -> 22.05k (up 147, down 640) ---
low = rational_resample(master, 147, 640)
low = quantize_with_dither(low, 16)

# Measurements...
```

#### Judging Feedback

**Criticism:** The student identified three genuine issues: the FFT-based resampling limitations, the missing dither, and the oversimplified block diagram. All are valid and well-articulated. However, the student did not catch that the THD+N measurement methodology is incorrect — it computes "distortion" as the difference between the processed signal and a reference that was itself resampled using the same flawed method, which would make the distortion measurement circular. The SNR computation is also wrong: it uses a fixed quantization noise floor formula that doesn't account for the actual signal content or dither noise.

**Better Alternative:** Should have also flagged the circular THD+N measurement and the incorrect SNR formula.

**Grade: B**

#### Steering Feedback

**Criticism:** The polyphase FIR suggestion is technically excellent — it's the correct architecture for rational rate conversion. The dither suggestion is also spot-on. However, the student specified incorrect up/down ratios: 96000 to 44100 requires up-by-147, down-by-320 (since 96000 * 147 / 320 = 44100), which the student got right, but the filter design cutoff formula `min(1/up, 1/down)` evaluates to `1/320` which is far too narrow. The correct cutoff should be `min(fs_out, fs_in) / (2 * fs_in * up)` to place the cutoff at the Nyquist of the lower rate relative to the upsampled rate.

**Better Alternative:** Should have specified the anti-aliasing filter cutoff as `0.5 * min(fs_in, fs_out) / max(fs_in, fs_out)` in normalized frequency.

**Grade: B**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1)

#### Judging Sub-step


gaps:
  - name: "True THD+N should be measured using a known test signal"
    description: "True THD+N should be measured using a known test signal (e.g., 1 kHz sine wave) where the expected output is analytically known."
  - name: "This may be insufficient for the required stopband attenuation"
    description: "This may be insufficient for the required stopband attenuation. The filter design should be verified by checking its frequency response."
  - name: "Gap: No block diagram is actually generated in the code."
    description: "The deliverable asks for a block diagram but none is produced."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Generate a 96 kHz sine at 1 kHz, process it through each"
    description: "Generate a 96 kHz sine at 1 kHz, process it through each tier's pipeline, then compute THD+N by measuring the ratio of non-fundamental energy to total energy in the output spectrum."
  - name: "Correction: Add a function to plot the block diagram"
    description: "Correction: Add a function to plot the block diagram using matplotlib, showing the signal flow for each tier with labeled filter specifications."

#### Updated AI Output

```python
import numpy as np
from scipy.signal import firwin, upfirdn, welch
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

def rational_resample(data, up, down, num_taps=16384):
    cutoff = 0.95 * min(1.0/up, 1.0/down)
    fir = firwin(num_taps, cutoff, window=('kaiser', 12)) * up
    return upfirdn(fir, data, up, down)

def quantize_with_dither(data, bits):
    scale = 2**(bits - 1)
    dither = (np.random.uniform(-0.5, 0.5, len(data)) +
              np.random.uniform(-0.5, 0.5, len(data))) / scale
    return np.round((data + dither) * scale) / scale

def measure_thd_n(pipeline_func, fs_in, fs_out, bits, f_test=1000, duration=1.0):
    """Measure THD+N using a sine test signal"""
    t = np.arange(int(fs_in * duration)) / fs_in
    test_signal = 0.5 * np.sin(2 * np.pi * f_test * t)
    output = pipeline_func(test_signal)

    # Compute spectrum
    f, Pxx = welch(output, fs=fs_out, nperseg=min(8192, len(output)))

    # Find fundamental bin
    fund_idx = np.argmin(np.abs(f - f_test))
    fund_power = Pxx[fund_idx]
    total_power = np.sum(Pxx)
    noise_power = total_power - fund_power

    thd_n = 10 * np.log10(noise_power / fund_power)
    snr = 10 * np.log10(fund_power / noise_power)
    return thd_n, snr

# Pipeline functions
def high_pipeline(x):
    y = rational_resample(x, 1, 2)
    return quantize_with_dither(y, 16)

def standard_pipeline(x):
    y = rational_resample(x, 147, 320)
    return quantize_with_dither(y, 16)

def low_pipeline(x):
    y = rational_resample(x, 147, 640)
    return quantize_with_dither(y, 16)

# Measurements
tiers = [
    ("High (48 kHz/16-bit)", high_pipeline, 96000, 48000, 16),
    ("Standard (44.1 kHz/16-bit)", standard_pipeline, 96000, 44100, 16),
    ("Low (22.05 kHz/16-bit)", low_pipeline, 96000, 22050, 16),
]

print(f"{'Tier':<30} {'THD+N (dB)':>12} {'SNR (dB)':>10}")
print("-" * 55)
for name, func, fs_in, fs_out, bits in tiers:
    thd_n, snr = measure_thd_n(func, fs_in, fs_out, bits)
    print(f"{name:<30} {thd_n:>12.1f} {snr:>10.1f}")

# Block diagram
fig, ax = plt.subplots(figsize=(14, 8))
ax.set_xlim(0, 14)
ax.set_ylim(0, 8)
ax.set_aspect('equal')
ax.axis('off')
ax.set_title('Multi-Rate Codec Pipeline', fontsize=14)
# ... (block drawing code)
plt.savefig('block_diagram.png', dpi=150, bbox_inches='tight')
```

#### Judging Feedback

**Criticism:** The student correctly identified the circular THD+N issue — this is a fundamental measurement methodology error. The block diagram gap was also a valid deliverable observation. The filter length concern, while technically reasonable, was less critical than the measurement issue. The student missed that the `welch` function's frequency resolution depends on `nperseg` and may not isolate the fundamental bin precisely, potentially contaminating the THD+N measurement with spectral leakage of the fundamental into adjacent bins.

**Better Alternative:** Should have also flagged the spectral leakage issue in the THD+N measurement and suggested using a coherent test frequency (one that falls exactly on a DFT bin) or a longer measurement window.

**Grade: A**

#### Steering Feedback

**Criticism:** The sine-wave THD+N approach is the correct fix — it establishes an analytically known reference. The block diagram suggestion addresses a missing deliverable. However, the student did not address the spectral leakage concern: the `welch`-based measurement will spread the fundamental's energy across adjacent bins, making the single-bin `fund_power` estimate inaccurate. Should have recommended choosing a coherent test frequency or using a flat-top window.

**Better Alternative:** Should have specified using a test frequency that aligns with a DFT bin center, or applying a flat-top window for accurate amplitude measurement.

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

The student demonstrated solid understanding of multi-rate processing fundamentals, correctly identifying the non-integer conversion ratio challenge and proposing appropriate architectures (polyphase FIR). Framing was weakened by not questioning whether "bandwidth" referred to network bitrate or audio bandwidth. Judging improved across cycles, culminating in the important catch of the circular THD+N measurement. Steering was generally appropriate but missed filter design subtleties (cutoff frequency specification, spectral leakage in measurements). The student should focus on end-to-end verification of measurement methodology — ensuring that quality metrics are computed correctly is as important as implementing the processing itself.
