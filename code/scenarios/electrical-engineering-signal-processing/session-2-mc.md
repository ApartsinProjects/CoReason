# Session 2 — Multiple Choice: Design a Multi-Rate Audio Codec Prototype

**Mode:** Multiple Choice

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Build a MATLAB or Python prototype of a sample-rate conversion module that takes a 96 kHz / 24-bit studio master track and produces three output files: a "high" stream, a "standard" stream, and a "low" stream suitable for mobile playback over limited bandwidth. Deliver the conversion code, a table comparing THD+N and SNR measurements for each output quality tier, and a block diagram of your signal processing pipeline. The product manager says "just make sure it sounds good" and that the low tier should "use as little bandwidth as possible."

### Student's Framing Response

**Which of the following issues should be raised before starting this problem?**

- **(A) The output sample rates are unspecified — "high," "standard," and "low" are qualitative labels that require concrete engineering parameters** [SELECTED]
- (B) Python is too slow for audio processing; this should be implemented in C++
- **(C) The 96-to-44.1 kHz conversion involves a non-integer ratio (160/147), which fundamentally changes the required multi-rate architecture** [SELECTED]
- (D) 24-bit audio has no perceptual advantage over 16-bit, so all tiers should keep 24-bit depth
- **(E) "Sounds good" is not an engineering specification — a quantitative quality threshold is needed** [SELECTED]

**Student selected: A, C, E**

### AI Solution (with embedded subtle issues)

```python
import numpy as np
from scipy.signal import resample

def convert(data, fs_in, fs_out, bits_out):
    ratio = fs_out / fs_in
    n_out = int(len(data) * ratio)
    resampled = resample(data, n_out)
    scale = 2**(bits_out - 1)
    quantized = np.round(resampled * scale) / scale
    return quantized

# Assume master is loaded as float64, 96 kHz, 24-bit
# High: 48 kHz / 16-bit
high = convert(master, 96000, 48000, 16)
# Standard: 44.1 kHz / 16-bit
standard = convert(master, 96000, 44100, 16)
# Low: 8 kHz / 8-bit
low = convert(master, 96000, 8000, 8)

# THD+N: compare output to ideal
for name, sig, fs in [("High", high, 48000), ("Std", standard, 44100), ("Low", low, 8000)]:
    ref = resample(master, len(sig))
    diff = sig - ref[:len(sig)]
    thd = 10*np.log10(np.mean(diff**2) / np.mean(ref**2))
    print(f"{name}: THD+N = {thd:.1f} dB")
```

### Framing Feedback

**Criticism:** The student made three strong selections. Option (A) correctly identifies that the quality tiers lack concrete parameters. Option (C) demonstrates understanding that non-integer ratios require fundamentally different multi-rate architectures. Option (E) addresses the subjective quality requirement. This is a thorough framing response.

However, the student missed the ambiguity around what "bandwidth" means — the product manager could mean network bitrate (kbps) rather than audio bandwidth (Hz), which would imply lossy compression is needed rather than just sample rate reduction. This is not among the options, but it represents a gap in the available choices.

**Better Alternative:** The selection A, C, E is the strongest available combination. No improvement possible within the given options.

**Grade: A**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as AI solution above)

#### Judging Sub-step

**Which issues exist in the AI's solution? (select all that apply)**

- **(A) The FFT-based `resample` function does not apply a proper anti-aliasing filter, risking aliasing artifacts especially for large rate changes** [SELECTED]
- **(B) Quantization is performed without dither, creating correlated quantization noise that appears as harmonic distortion** [SELECTED]
- (C) The `resample` function cannot handle non-integer ratios
- **(D) The THD+N measurement uses a re-resampled version of the input as reference, making the measurement circular** [SELECTED]
- (E) The code will crash because NumPy cannot handle 24-bit integer formats

**Student selected: A, B, D**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Replace `scipy.signal.resample` with `scipy.signal.decimate` for all conversions
- (B) Add a brickwall FIR filter after each resampling stage
- **(C) Use `scipy.signal.upfirdn` with a polyphase FIR filter for proper rational rate conversion, add TPDF dither before quantization, and measure THD+N using a known test tone** [SELECTED]
- (D) Switch to the `librosa.resample` function which handles everything automatically
- (E) Add zero-padding before the FFT in `resample` to improve frequency resolution

**Student selected: C**

#### Updated AI Output

```python
import numpy as np
from scipy.signal import firwin, upfirdn, welch

def rational_resample(data, up, down, ntaps=8192):
    cutoff = 0.95 * min(1.0/up, 1.0/down)
    h = firwin(ntaps, cutoff, window=('kaiser', 10)) * up
    return upfirdn(h, data, up, down)

def quantize_dither(data, bits):
    scale = 2**(bits - 1)
    dither = (np.random.uniform(-0.5, 0.5, len(data)) +
              np.random.uniform(-0.5, 0.5, len(data))) / scale
    return np.round((data + dither) * scale) / scale

def measure_thd_n(pipeline_fn, fs_out, f_test=997, dur=2.0):
    t = np.arange(int(96000 * dur)) / 96000
    x = 0.5 * np.sin(2 * np.pi * f_test * t)
    y = pipeline_fn(x)
    f, P = welch(y, fs=fs_out, nperseg=8192)
    k = np.argmin(np.abs(f - f_test))
    sig_pow = P[k]
    noise_pow = np.sum(P) - sig_pow
    return 10 * np.log10(noise_pow / sig_pow)

# High: 96k -> 48k = downsample by 2
high_fn = lambda x: quantize_dither(rational_resample(x, 1, 2), 16)
# Standard: 96k -> 44.1k = up 147, down 320
std_fn = lambda x: quantize_dither(rational_resample(x, 147, 320), 16)
# Low: 96k -> 8k = down by 12
low_fn = lambda x: quantize_dither(rational_resample(x, 1, 12), 8)

for name, fn, fs in [("High", high_fn, 48000), ("Std", std_fn, 44100), ("Low", low_fn, 8000)]:
    thdn = measure_thd_n(fn, fs)
    print(f"{name}: THD+N = {thdn:.1f} dB")
```

#### Judging Feedback

**Criticism:** Excellent selection. All three issues (A, B, D) are genuine and impactful. The student correctly avoided distractor (C) — `resample` can handle non-integer ratios — and distractor (E) — the code normalizes to float64. The student identified the three most consequential problems: architectural (no proper anti-aliasing), implementation (no dither), and measurement (circular reference).

**Better Alternative:** No better selection exists.

**Grade: A**

#### Steering Feedback

**Criticism:** Option (C) is the comprehensive fix that addresses all three identified issues in a single directive. This is the correct choice. Options (A) and (B) are partial fixes, (D) is a black-box approach that doesn't demonstrate understanding, and (E) is irrelevant.

**Better Alternative:** No better option exists.

**Grade: A**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1)

#### Judging Sub-step

**Which issues remain? (select all that apply)**

- (A) The 997 Hz test tone is not a standard measurement frequency
- **(B) The polyphase filter cutoff formula `min(1/up, 1/down)` gives an incorrect cutoff for the 147/320 conversion — it should be based on the lower Nyquist rate** [SELECTED]
- (C) The Kaiser window beta of 10 is too low for audio-quality stopband attenuation
- **(D) The block diagram deliverable is still missing from the output** [SELECTED]
- (E) TPDF dither amplitude should be 1 LSB, not 2 LSBs

**Student selected: B, D**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Switch from Kaiser to Hamming window for the FIR filter
- **(B) Fix the filter cutoff to `min(fs_in, fs_out) / (2 * max(fs_in, fs_out))` in normalized frequency and add a matplotlib block diagram showing each tier's signal flow** [SELECTED]
- (C) Increase the number of FIR taps to 32768 for better stopband attenuation
- (D) Use a multiband FIR filter instead of a single lowpass
- (E) Replace the polyphase implementation with a cascade of half-band filters

**Student selected: B**

#### Updated AI Output

```python
import numpy as np
from scipy.signal import firwin, upfirdn, welch
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

def rational_resample(data, up, down, fs_in, ntaps=8192):
    fs_out = fs_in * up / down
    # Cutoff at the lower Nyquist, normalized to upsampled rate
    cutoff = min(fs_in, fs_out) / (2 * fs_in * up)
    cutoff *= 0.95  # transition margin
    h = firwin(ntaps, cutoff, window=('kaiser', 12)) * up
    return upfirdn(h, data, up, down)

def quantize_dither(data, bits):
    scale = 2**(bits - 1)
    dither = (np.random.uniform(-0.5, 0.5, len(data)) +
              np.random.uniform(-0.5, 0.5, len(data))) / scale
    return np.round((data + dither) * scale) / scale

def measure_thd_n(pipeline_fn, fs_out, f_test=997, dur=2.0):
    t = np.arange(int(96000 * dur)) / 96000
    x = 0.5 * np.sin(2 * np.pi * f_test * t)
    y = pipeline_fn(x)
    f, P = welch(y, fs=fs_out, nperseg=min(16384, len(y)))
    k = np.argmin(np.abs(f - f_test))
    sig = P[k]
    noise = np.sum(P) - sig
    thdn = 10 * np.log10(noise / sig)
    snr = -thdn
    return thdn, snr

# Pipelines
high_fn = lambda x: quantize_dither(rational_resample(x, 1, 2, 96000), 16)
std_fn = lambda x: quantize_dither(rational_resample(x, 147, 320, 96000), 16)
low_fn = lambda x: quantize_dither(rational_resample(x, 1, 12, 96000), 8)

# Measurements table
print(f"{'Tier':<28} {'THD+N (dB)':>12} {'SNR (dB)':>10}")
print("-" * 52)
for name, fn, fs in [("High (48k/16b)", high_fn, 48000),
                      ("Standard (44.1k/16b)", std_fn, 44100),
                      ("Low (8k/8b)", low_fn, 8000)]:
    thdn, snr = measure_thd_n(fn, fs)
    print(f"{name:<28} {thdn:>12.1f} {snr:>10.1f}")

# Block diagram
fig, ax = plt.subplots(figsize=(16, 10))
ax.axis('off')
ax.set_title('Multi-Rate Codec Block Diagram', fontsize=14, fontweight='bold')

y_positions = [7, 4.5, 2]
tier_labels = [
    'High: 96k→48k/16-bit\n↑1 → LPF(fc=24kHz) → ↓2 → Dither → Q16',
    'Standard: 96k→44.1k/16-bit\n↑147 → LPF(fc=22.05kHz) → ↓320 → Dither → Q16',
    'Low: 96k→8k/8-bit\n↑1 → LPF(fc=4kHz) → ↓12 → Dither → Q8',
]
for y, label in zip(y_positions, tier_labels):
    ax.text(7, y, label, ha='center', va='center', fontsize=11,
            bbox=dict(boxstyle='round,pad=0.5', facecolor='lightblue'))

ax.text(1, 4.5, 'Input\n96kHz/24-bit', ha='center', va='center', fontsize=12,
        bbox=dict(boxstyle='round,pad=0.5', facecolor='lightyellow'))
for y in y_positions:
    ax.annotate('', xy=(3.5, y), xytext=(2.5, 4.5),
                arrowprops=dict(arrowstyle='->', lw=1.5))

plt.savefig('block_diagram.png', dpi=150, bbox_inches='tight')
print("\nBlock diagram saved to block_diagram.png")
```

#### Judging Feedback

**Criticism:** The student correctly identified the filter cutoff error (B) — this is a subtle but important issue that would cause the 44.1 kHz conversion to either alias or excessively attenuate the passband. The missing block diagram (D) is a valid deliverable gap. However, the student incorrectly dismissed option (E): standard TPDF dither uses peak amplitude of 2 LSBs (sum of two uniform [-0.5, 0.5] distributions gives [-1, 1] LSB peak), which is actually what the code implements. The student may have confused peak and RMS amplitudes.

**Better Alternative:** B and D is a reasonable selection. Option (A) is a distractor — 997 Hz is actually a common test frequency specifically chosen to avoid harmonics landing on power-line frequencies.

**Grade: A**

#### Steering Feedback

**Criticism:** Option (B) addresses both identified issues concisely. The filter cutoff formula correction is technically accurate, and the block diagram request completes the missing deliverable. Good choice.

**Better Alternative:** No better option available.

**Grade: A**

---

### Cycle 3

#### Student marks: **Done**

---

## Completion

| Skill    | Grade |
| -------- | ----- |
| Framing  | A     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

Strong performance across all three skills. The student's framing correctly identified the three most important ambiguities and constraints. Judging was thorough — the student caught architectural, implementation, and measurement methodology errors, including the subtle circular THD+N reference issue. Steering choices were consistently optimal, selecting the most comprehensive correction at each stage. Minor weaknesses include occasional confusion about implementation details (e.g., dither amplitude) and missing the "bandwidth" ambiguity in framing. Overall, this reflects solid multi-rate DSP knowledge and good critical analysis skills.
