# Session 3 — Multiple Choice: Build a Bearing-Fault Detector from Accelerometer Data

**Mode:** Multiple Choice

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Write a Python script that reads a CSV file of accelerometer vibration data sampled from an industrial pump, computes the power spectral density, and outputs a diagnostic report classifying the machine state as "healthy," "watch," or "alarm." Deliver the script, a PSD plot with annotated fault frequencies, and a decision-logic flowchart. The maintenance engineer says the pump runs "at about 1,800 RPM" and that bearings "usually fail first." The CSV has a single column of acceleration values with no header.

### Student's Framing Response

**Which of the following issues should be raised before starting this problem?**

- **(A) The CSV file has no sample rate, timestamps, or acceleration units — spectral analysis requires knowing the sample rate to compute meaningful frequencies** [SELECTED]
- (B) Python is not suitable for industrial vibration monitoring; LabVIEW should be used instead
- **(C) "About 1,800 RPM" introduces uncertainty that propagates into fault frequency estimates, potentially causing misidentification of spectral peaks** [SELECTED]
- (D) The PSD is unnecessary — a simple time-domain RMS threshold would be sufficient for fault detection
- **(E) The classification categories "healthy," "watch," and "alarm" have no defined thresholds, baselines, or reference standards** [SELECTED]

**Student selected: A, C, E**

### AI Solution (with embedded subtle issues)

```python
import numpy as np
import matplotlib.pyplot as plt

data = np.loadtxt('vibration.csv', delimiter=',')

fs = 10000  # assumed
rpm = 1800
shaft_freq = rpm / 60  # 30 Hz

# Bearing fault frequencies (typical ratios)
BPFO = shaft_freq * 7.2
BPFI = shaft_freq * 9.8
BSF = shaft_freq * 4.7
FTF = shaft_freq * 0.4

# Raw FFT PSD
N = len(data)
fft_vals = np.fft.rfft(data)
psd = (2.0 / N) * np.abs(fft_vals)**2
freqs = np.fft.rfftfreq(N, 1/fs)

# Classification
peak_psd = np.max(psd)
if peak_psd > 0.1:
    status = "ALARM"
elif peak_psd > 0.01:
    status = "WATCH"
else:
    status = "HEALTHY"

print(f"Status: {status}")

plt.figure(figsize=(12, 6))
plt.semilogy(freqs, psd)
plt.axvline(BPFO, color='r', linestyle='--', label=f'BPFO={BPFO:.0f}Hz')
plt.axvline(BPFI, color='g', linestyle='--', label=f'BPFI={BPFI:.0f}Hz')
plt.xlabel('Frequency (Hz)')
plt.ylabel('PSD')
plt.legend()
plt.savefig('psd_plot.png')
```

### Framing Feedback

**Criticism:** Excellent selection. Option (A) identifies the most fundamental data gap — without a sample rate, no spectral analysis is valid. Option (C) demonstrates understanding that parameter uncertainty propagates through the analysis chain. Option (E) correctly flags the undefined classification criteria. All three are high-impact framing issues.

The student missed the fact that bearing geometry parameters are unspecified (number of rolling elements, ball/pitch diameter, contact angle), which means the fault frequency ratios like 7.2 and 9.8 cannot be verified. This was not among the options, but recognizing it would strengthen the framing.

**Better Alternative:** A, C, E is the optimal selection from the available options. Option (D) is incorrect — frequency-domain analysis is essential for bearing diagnostics since time-domain RMS cannot distinguish fault types.

**Grade: A**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as AI solution above)

#### Judging Sub-step

**Which issues exist in the AI's solution? (select all that apply)**

- **(A) The PSD uses a raw FFT without windowing or segment averaging, producing a high-variance estimate with spectral leakage** [SELECTED]
- (B) The `rfftfreq` function returns incorrect frequency values for real-valued signals
- **(C) The classification thresholds (0.1 and 0.01) are arbitrary hardcoded values with no physical basis or sensitivity analysis** [SELECTED]
- (D) The semilogy plot will crash if any PSD values are zero or negative
- **(E) The bearing fault frequency ratios (7.2, 9.8, 4.7) are used without deriving them from actual bearing geometry** [SELECTED]

**Student selected: A, C, E**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Replace the FFT with a short-time Fourier transform (STFT) for time-frequency analysis
- **(B) Use Welch's method with a Hanning window and 50% overlap for proper PSD estimation, and replace hardcoded thresholds with peak-to-median ratio logic using configurable parameters** [SELECTED]
- (C) Apply a bandpass filter to isolate each fault frequency before computing the PSD
- (D) Use an autoregressive (AR) spectral estimator instead of the FFT for higher resolution
- (E) Compute the PSD using a multitaper method for minimum spectral leakage

**Student selected: B**

#### Updated AI Output

```python
import numpy as np
from scipy.signal import welch
import matplotlib.pyplot as plt

# Parameters
fs = 10000
rpm = 1800
shaft_freq = rpm / 60

# Bearing fault frequencies (assumed geometry - needs verification)
BPFO = shaft_freq * 7.2
BPFI = shaft_freq * 9.8
BSF = shaft_freq * 4.7
FTF = shaft_freq * 0.4

# Configuration
WATCH_RATIO = 10    # peak-to-median ratio
ALARM_RATIO = 100
SEARCH_BW = 3       # Hz around each fault freq

# Load and compute PSD
data = np.loadtxt('vibration.csv', delimiter=',')
f, Pxx = welch(data, fs=fs, nperseg=4096, window='hann', noverlap=2048, scaling='density')

# Fault peak detection
median_psd = np.median(Pxx)
fault_results = {}
for name, fc in [('BPFO', BPFO), ('BPFI', BPFI), ('BSF', BSF), ('FTF', FTF)]:
    band = Pxx[(f > fc - SEARCH_BW) & (f < fc + SEARCH_BW)]
    peak = np.max(band) if len(band) > 0 else 0
    ratio = peak / median_psd if median_psd > 0 else 0
    fault_results[name] = {'freq': fc, 'peak': peak, 'ratio': ratio}

max_ratio = max(r['ratio'] for r in fault_results.values())

if max_ratio > ALARM_RATIO:
    status = "ALARM"
elif max_ratio > WATCH_RATIO:
    status = "WATCH"
else:
    status = "HEALTHY"

# Report
print(f"Machine Status: {status}")
for name, info in fault_results.items():
    flag = " ** ELEVATED **" if info['ratio'] > WATCH_RATIO else ""
    print(f"  {name} ({info['freq']:.1f} Hz): {info['ratio']:.1f}x median{flag}")

# Plot
plt.figure(figsize=(14, 6))
plt.semilogy(f, Pxx, 'b-', linewidth=0.5)
colors = {'BPFO': 'red', 'BPFI': 'green', 'BSF': 'blue', 'FTF': 'purple'}
for name, info in fault_results.items():
    plt.axvline(info['freq'], color=colors[name], linestyle='--', alpha=0.7,
                label=f"{name}={info['freq']:.0f}Hz ({info['ratio']:.0f}x)")
plt.xlabel('Frequency (Hz)')
plt.ylabel('PSD (units^2/Hz)')
plt.title(f'PSD - Status: {status}')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('psd_plot.png', dpi=150)
```

#### Judging Feedback

**Criticism:** All three selections are valid and well-targeted. The raw FFT issue (A) is the most technically impactful — spectral leakage from an unwindowed FFT corrupts the entire PSD estimate. The arbitrary thresholds (C) are a genuine engineering concern. The unverified bearing ratios (E) highlight a domain-knowledge gap. Option (B) is a distractor (`rfftfreq` is correct), and (D) is unlikely to crash in practice since PSD values from |FFT|^2 are non-negative.

**Better Alternative:** A, C, E is the optimal selection.

**Grade: A**

#### Steering Feedback

**Criticism:** Option (B) is the strongest available correction. Welch's method resolves the windowing and averaging issues, and configurable peak-to-median ratios replace the arbitrary thresholds. The other options are either inappropriate (STFT is for time-frequency analysis, not PSD), overly specialized (multitaper is uncommon in industrial practice), or tangential (bandpass filtering is a pre-processing step, not a PSD fix).

**Better Alternative:** No better option exists.

**Grade: A**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1)

#### Judging Sub-step

**Which issues remain in the updated solution? (select all that apply)**

- (A) Welch's method with nperseg=4096 provides insufficient frequency resolution for this application
- **(B) The classification only checks fundamental fault frequencies, ignoring harmonics (2x, 3x BPFO, etc.) which are more reliable fault indicators** [SELECTED]
- (C) The Hanning window is suboptimal — a flat-top window would give more accurate amplitude readings
- **(D) The decision-logic flowchart deliverable is missing** [SELECTED]
- (E) The PSD scaling='density' parameter produces incorrect units for vibration analysis

**Student selected: B, D**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Switch to a Blackman-Harris window for lower spectral leakage sidelobes
- (B) Add an envelope analysis stage using the Hilbert transform to detect amplitude modulation at fault frequencies
- **(C) Add harmonic series detection (check 2x, 3x, 4x of each fault frequency) and generate a matplotlib flowchart of the classification logic** [SELECTED]
- (D) Implement order tracking to handle RPM variation
- (E) Apply cepstral analysis to detect periodic components in the spectrum

**Student selected: C**

#### Updated AI Output

```python
# (Previous Welch-based PSD code, plus:)

def analyze_fault(f, Pxx, base_freq, n_harmonics=4, bw=3.0, threshold=10):
    median_psd = np.median(Pxx)
    harmonics_found = 0
    max_ratio = 0
    for h in range(1, n_harmonics + 1):
        fc = base_freq * h
        band = Pxx[(f > fc - bw) & (f < fc + bw)]
        if len(band) > 0:
            ratio = np.max(band) / median_psd
            max_ratio = max(max_ratio, ratio)
            if ratio > threshold:
                harmonics_found += 1
    return max_ratio, harmonics_found

results = {}
for name, fc in [('BPFO', BPFO), ('BPFI', BPFI), ('BSF', BSF), ('FTF', FTF)]:
    ratio, n_harm = analyze_fault(f, Pxx, fc, N_HARMONICS, SEARCH_BW, WATCH_RATIO)
    results[name] = {'freq': fc, 'ratio': ratio, 'harmonics': n_harm}

# Classification with harmonics
any_alarm_ratio = any(r['ratio'] > ALARM_RATIO for r in results.values())
any_alarm_harmonics = any(r['harmonics'] >= 3 for r in results.values())
any_watch = any(r['ratio'] > WATCH_RATIO for r in results.values())

if any_alarm_ratio or any_alarm_harmonics:
    status = "ALARM"
elif any_watch:
    status = "WATCH"
else:
    status = "HEALTHY"

# Decision Flowchart
fig2, ax2 = plt.subplots(figsize=(10, 12))
ax2.axis('off')
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 14)

boxes = [
    (5, 13, 'Load CSV &\nCompute PSD\n(Welch method)', 'lightyellow'),
    (5, 11, 'For each fault freq\n(BPFO, BPFI, BSF, FTF):\nCheck peak/median ratio\nat 1x, 2x, 3x, 4x', 'lightcyan'),
    (5, 8.5, 'Any peak > 100x median\nOR >= 3 harmonics\nabove 10x median?', 'lightsalmon'),
    (2, 7, 'ALARM\n+ identify fault type', 'red'),
    (8, 7, 'Any peak > 10x\nmedian?', 'lightsalmon'),
    (6, 5.5, 'WATCH', 'orange'),
    (9.5, 5.5, 'HEALTHY', 'lightgreen'),
]

for x, y, text, color in boxes:
    ax2.text(x, y, text, ha='center', va='center', fontsize=9,
             bbox=dict(boxstyle='round,pad=0.5', facecolor=color, alpha=0.8))

ax2.text(2.8, 8.2, 'Yes', fontsize=9, color='red')
ax2.text(7, 8.2, 'No', fontsize=9)
ax2.text(6.3, 6.7, 'Yes', fontsize=9, color='orange')
ax2.text(9.3, 6.7, 'No', fontsize=9, color='green')

plt.savefig('flowchart.png', dpi=150, bbox_inches='tight')
```

#### Judging Feedback

**Criticism:** Both selections are correct. The harmonics observation (B) is particularly valuable — checking multiple harmonics is standard industrial practice for distinguishing real faults from coincidental peaks. The missing flowchart (D) is a clear deliverable gap. Option (A) is debatable — nperseg=4096 at fs=10 kHz gives ~2.4 Hz resolution, which is acceptable for most bearing fault frequencies. Option (C) is a distractor — Hanning is the standard for PSD estimation. Option (E) is incorrect — `scaling='density'` is the correct choice for PSD.

**Better Alternative:** B and D are the correct selections.

**Grade: A**

#### Steering Feedback

**Criticism:** Option (C) addresses both identified issues — harmonics detection and the flowchart. This is a good practical choice. However, option (B) — envelope analysis using the Hilbert transform — is the more impactful technique for bearing fault detection. Envelope analysis can detect bearing faults at much earlier stages by revealing amplitude modulation patterns that are invisible in the direct PSD. The student chose the safer, more incremental option over the more transformative one.

**Better Alternative:** Option (B) would have been more impactful for fault detection capability, though option (C) is still a valid improvement.

**Grade: B**

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

The student demonstrated strong analytical skills across framing and judging. Framing selections were nearly optimal, identifying the three most critical missing specifications. Judging was thorough — the student correctly identified raw FFT issues, arbitrary thresholds, and the need for harmonic analysis. Steering was competent but conservative — the student consistently chose safe, incremental improvements (Welch's method, harmonic counting) over more transformative techniques (envelope analysis, spectral kurtosis). In industrial vibration monitoring, envelope analysis is the standard technique for early bearing fault detection, and missing this represents the most significant gap. The student should study demodulation-based diagnostic methods to strengthen their vibration analysis toolkit.
