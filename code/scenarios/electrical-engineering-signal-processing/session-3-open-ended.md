# Session 3 — Open-Ended: Build a Bearing-Fault Detector from Accelerometer Data

**Mode:** Open-Ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Write a Python script that reads a CSV file of accelerometer vibration data sampled from an industrial pump, computes the power spectral density, and outputs a diagnostic report classifying the machine state as "healthy," "watch," or "alarm." Deliver the script, a PSD plot with annotated fault frequencies, and a decision-logic flowchart. The maintenance engineer says the pump runs "at about 1,800 RPM" and that bearings "usually fail first." The CSV has a single column of acceleration values with no header.

### Student's Framing Response

**Assumption: The sample rate of the accelerometer is 10 kHz.** The CSV has no header and no time column, so the sample rate is unknown. 10 kHz is a reasonable default for industrial vibration monitoring (covers bearing fault frequencies up to 5 kHz).

**Constraint: "About 1,800 RPM" means the shaft frequency is approximately 30 Hz.** This gives us the base frequency for computing expected bearing fault harmonics (BPFO, BPFI, BSF, FTF), but those harmonics also depend on bearing geometry which is unspecified.

**Gap: No bearing model number or geometry is given.** Without knowing the number of rolling elements, ball diameter, pitch diameter, and contact angle, the characteristic fault frequencies cannot be computed. I'll assume a typical industrial bearing (e.g., SKF 6205 or equivalent) and document the assumed geometry.

### AI Solution (with embedded subtle issues)

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import welch

# Load data
data = np.loadtxt('vibration.csv', delimiter=',')

# Parameters
fs = 10000  # assumed sample rate
rpm = 1800
shaft_freq = rpm / 60  # 30 Hz

# Bearing fault frequencies (assumed generic bearing)
n_balls = 9
ball_dia = 7.94e-3  # meters
pitch_dia = 39.04e-3
contact_angle = 0  # radians

FTF = (shaft_freq / 2) * (1 - ball_dia/pitch_dia)
BPFO = (n_balls * shaft_freq / 2) * (1 - ball_dia/pitch_dia)
BPFI = (n_balls * shaft_freq / 2) * (1 + ball_dia/pitch_dia)
BSF = (pitch_dia / (2 * ball_dia)) * shaft_freq * (1 - (ball_dia/pitch_dia)**2)

# Compute PSD
f, Pxx = welch(data, fs=fs, nperseg=4096)

# Plot
plt.figure(figsize=(14, 6))
plt.semilogy(f, Pxx)
plt.axvline(BPFO, color='r', linestyle='--', label=f'BPFO={BPFO:.1f} Hz')
plt.axvline(BPFI, color='g', linestyle='--', label=f'BPFI={BPFI:.1f} Hz')
plt.axvline(BSF, color='b', linestyle='--', label=f'BSF={BSF:.1f} Hz')
plt.axvline(shaft_freq, color='k', linestyle='--', label=f'1x={shaft_freq:.1f} Hz')
plt.xlabel('Frequency (Hz)')
plt.ylabel('PSD (g²/Hz)')
plt.title('Power Spectral Density — Vibration Analysis')
plt.legend()
plt.grid(True)
plt.savefig('psd_plot.png', dpi=150)

# Classification
bpfo_band = Pxx[(f > BPFO-2) & (f < BPFO+2)]
bpfi_band = Pxx[(f > BPFI-2) & (f < BPFI+2)]
baseline = np.median(Pxx)

if np.max(bpfo_band) > baseline * 100 or np.max(bpfi_band) > baseline * 100:
    status = "ALARM"
elif np.max(bpfo_band) > baseline * 10 or np.max(bpfi_band) > baseline * 10:
    status = "WATCH"
else:
    status = "HEALTHY"

print(f"Machine Status: {status}")
print(f"Shaft frequency: {shaft_freq:.1f} Hz")
print(f"BPFO: {BPFO:.1f} Hz, BPFI: {BPFI:.1f} Hz, BSF: {BSF:.1f} Hz")
```

### Framing Feedback

**Criticism:** The student correctly identified the three most critical missing parameters: sample rate, exact RPM, and bearing geometry. The bearing geometry observation is particularly strong — without it, computed fault frequencies are unreliable. However, the student did not flag that the data has no units specified (could be m/s^2, g, or raw ADC counts), which affects threshold calibration. The student also did not question what "healthy," "watch," and "alarm" mean quantitatively — are these based on ISO 10816 vibration severity standards, or are they relative thresholds? The classification criteria are just as ill-defined as the noise reduction "quality" in Challenge 1.

**Better Alternative:** Should have also flagged: (1) unknown acceleration units affecting absolute threshold comparisons, (2) absence of a baseline "healthy" measurement for comparison, and (3) the need to define classification criteria against a standard (e.g., ISO 10816 or ISO 20816).

**Grade: B**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as AI solution above)

#### Judging Sub-step


gaps:
  - name: "SciPy defaults to a Hann window, which is reasonable"
    description: "SciPy defaults to a Hann window, which is reasonable, but this choice is not documented or justified. More importantly, the frequency resolution is `fs / nperseg = 10000/4096 ≈ 2.44 Hz`, which may be too coarse to resolve closely spaced fault harmonics."
  - name: "There is no sensitivity analysis, no reference to"
    description: "There is no sensitivity analysis, no reference to vibration severity standards, and no discussion of false alarm vs. missed detection trade-offs."
  - name: "Real bearing faults produce harmonic series, and the"
    description: "Real bearing faults produce harmonic series, and the presence of multiple harmonics is a more reliable fault indicator than a single peak."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Correction: Increase `nperseg` to 16384 for better"
    description: "Correction: Increase `nperseg` to 16384 for better frequency resolution (~0.61 Hz) and explicitly specify `window='hann'` and `noverlap=nperseg//2` to document the PSD estimation parameters."
  - name: "A single peak could be coincidental"
    description: "A single peak could be coincidental; multiple harmonics at integer multiples of a fault frequency strongly indicate a real fault."
  - name: "Correction: Replace the hardcoded thresholds with"
    description: "Correction: Replace the hardcoded thresholds with configurable parameters and add a comment explaining that they should be calibrated against baseline measurements from a known-healthy machine."

#### Updated AI Output

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import welch

# === CONFIGURABLE PARAMETERS ===
FS = 10000           # Sample rate (Hz) — ASSUMED, verify with sensor datasheet
RPM = 1800           # Nominal RPM — APPROXIMATE
NPERSEG = 16384      # PSD segment length (freq resolution: fs/nperseg ≈ 0.61 Hz)
WINDOW = 'hann'
OVERLAP = NPERSEG // 2

# Bearing geometry — ASSUMED (typical 6205-class bearing)
N_BALLS = 9
BALL_DIA = 7.94e-3
PITCH_DIA = 39.04e-3
CONTACT_ANGLE = 0

# Classification thresholds — MUST BE CALIBRATED against baseline
WATCH_THRESHOLD = 10   # x above median PSD
ALARM_THRESHOLD = 100  # x above median PSD
MIN_HARMONICS_FOR_ALARM = 3

# === LOAD DATA ===
data = np.loadtxt('vibration.csv', delimiter=',')

shaft_freq = RPM / 60

# Bearing fault frequencies
FTF = (shaft_freq / 2) * (1 - BALL_DIA / PITCH_DIA)
BPFO = (N_BALLS * shaft_freq / 2) * (1 - BALL_DIA / PITCH_DIA)
BPFI = (N_BALLS * shaft_freq / 2) * (1 + BALL_DIA / PITCH_DIA)
BSF = (PITCH_DIA / (2 * BALL_DIA)) * shaft_freq * (1 - (BALL_DIA / PITCH_DIA)**2)

# === COMPUTE PSD ===
f, Pxx = welch(data, fs=FS, nperseg=NPERSEG, window=WINDOW, noverlap=OVERLAP)

# === FAULT DETECTION WITH HARMONICS ===
def count_harmonics(f, Pxx, base_freq, n_harmonics=5, bandwidth=2.0, threshold_mult=10):
    median_psd = np.median(Pxx)
    detected = 0
    for h in range(1, n_harmonics + 1):
        fc = base_freq * h
        band = Pxx[(f > fc - bandwidth) & (f < fc + bandwidth)]
        if len(band) > 0 and np.max(band) > median_psd * threshold_mult:
            detected += 1
    return detected

bpfo_harmonics = count_harmonics(f, Pxx, BPFO)
bpfi_harmonics = count_harmonics(f, Pxx, BPFI)
bsf_harmonics = count_harmonics(f, Pxx, BSF)

# === CLASSIFICATION ===
max_harmonics = max(bpfo_harmonics, bpfi_harmonics, bsf_harmonics)
median_psd = np.median(Pxx)

# Check peak levels at fault frequencies
fault_freqs = {'BPFO': BPFO, 'BPFI': BPFI, 'BSF': BSF}
max_ratio = 0
dominant_fault = None
for name, fc in fault_freqs.items():
    band = Pxx[(f > fc - 2) & (f < fc + 2)]
    if len(band) > 0:
        ratio = np.max(band) / median_psd
        if ratio > max_ratio:
            max_ratio = ratio
            dominant_fault = name

if max_ratio > ALARM_THRESHOLD or max_harmonics >= MIN_HARMONICS_FOR_ALARM:
    status = "ALARM"
elif max_ratio > WATCH_THRESHOLD:
    status = "WATCH"
else:
    status = "HEALTHY"

# === REPORT ===
print(f"=== VIBRATION DIAGNOSTIC REPORT ===")
print(f"Machine Status: {status}")
print(f"Shaft frequency: {shaft_freq:.1f} Hz")
print(f"BPFO: {BPFO:.1f} Hz ({bpfo_harmonics} harmonics detected)")
print(f"BPFI: {BPFI:.1f} Hz ({bpfi_harmonics} harmonics detected)")
print(f"BSF:  {BSF:.1f} Hz ({bsf_harmonics} harmonics detected)")
if dominant_fault:
    print(f"Dominant fault signature: {dominant_fault} ({max_ratio:.1f}x median)")

# === PLOT ===
plt.figure(figsize=(14, 6))
plt.semilogy(f, Pxx, 'b-', alpha=0.7, linewidth=0.5)
colors = {'BPFO': 'red', 'BPFI': 'green', 'BSF': 'blue'}
for name, fc in fault_freqs.items():
    for h in range(1, 6):
        lbl = f'{name} {h}x = {fc*h:.1f} Hz' if h == 1 else None
        plt.axvline(fc * h, color=colors[name], linestyle='--', alpha=0.5, label=lbl)
plt.axvline(shaft_freq, color='k', linestyle='--', alpha=0.7, label=f'1x = {shaft_freq:.1f} Hz')
plt.xlabel('Frequency (Hz)')
plt.ylabel('PSD (units²/Hz)')
plt.title(f'PSD — Machine Status: {status}')
plt.legend(loc='upper right')
plt.grid(True, alpha=0.3)
plt.xlim(0, 1000)
plt.savefig('psd_plot.png', dpi=150, bbox_inches='tight')
```

#### Judging Feedback

**Criticism:** All three observations are technically sound. The frequency resolution concern is valid — 2.44 Hz resolution could merge adjacent fault frequencies. The arbitrary thresholds are correctly flagged as the weakest part of the solution. The harmonics observation demonstrates good domain knowledge. However, the student did not flag that the bearing fault frequency formulas use `contact_angle = 0`, which is only valid for deep-groove ball bearings and may be incorrect for the actual pump bearing. Also, the PSD y-axis label says "g^2/Hz" but the data units are unknown.

**Better Alternative:** Should have also caught the contact angle assumption and the unknown data units.

**Grade: A**

#### Steering Feedback

**Criticism:** The three corrections form a coherent improvement plan. The frequency resolution increase is well-justified numerically. The harmonic detection suggestion adds significant diagnostic value. The configurable thresholds with calibration notes are practical. However, the student could have gone further by steering toward envelope analysis (demodulation), which is the standard industrial technique for bearing fault detection. Envelope analysis detects amplitude modulation at fault frequencies even when they are buried in broadband noise. This is a significant missed opportunity.

**Better Alternative:** Should have steered toward implementing envelope analysis (Hilbert transform-based demodulation) as the primary fault detection technique, since it is more sensitive to early-stage bearing faults than direct PSD peak detection.

**Grade: B**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1)

#### Judging Sub-step


gaps:
  - name: "This means fault frequency estimates could be off by"
    description: "This means fault frequency estimates could be off by several Hz, and the 2 Hz bandwidth for peak detection may not be wide enough for higher harmonics where the error compounds."
  - name: "The problem explicitly asks for it"
    description: "The problem explicitly asks for it."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Correction: Widen the frequency search bandwidth"
    description: "Correction: Widen the frequency search bandwidth proportionally for higher harmonics — use `bandwidth = base_bandwidth * harmonic_number` to account for compounding RPM uncertainty."
  - name: "Correction: Add a simple text-based or matplotlib"
    description: "Correction: Add a simple text-based or matplotlib decision flowchart showing the classification logic: check fault frequency peaks -> count harmonics -> compare against thresholds -> classify."

#### Updated AI Output

```python
# (Previous code with the following modifications)

def count_harmonics(f, Pxx, base_freq, n_harmonics=5, base_bandwidth=2.0, threshold_mult=10):
    median_psd = np.median(Pxx)
    detected = 0
    for h in range(1, n_harmonics + 1):
        fc = base_freq * h
        bw = base_bandwidth * h  # wider search for higher harmonics
        band = Pxx[(f > fc - bw) & (f < fc + bw)]
        if len(band) > 0 and np.max(band) > median_psd * threshold_mult:
            detected += 1
    return detected

# ... (rest of analysis code unchanged) ...

# === DECISION FLOWCHART ===
fig2, ax2 = plt.subplots(figsize=(10, 12))
ax2.axis('off')
ax2.set_title('Decision Logic Flowchart', fontsize=14, fontweight='bold')

steps = [
    (5, 11, 'Load vibration data\n& compute PSD', 'lightyellow'),
    (5, 9.5, 'Compute expected fault\nfrequencies from RPM\n& bearing geometry', 'lightyellow'),
    (5, 7.8, 'Search for peaks at\nBPFO, BPFI, BSF\n& their harmonics', 'lightblue'),
    (5, 6.2, 'Peak > 100x median\nOR >= 3 harmonics?', 'lightsalmon'),
    (2, 5, 'ALARM', 'red'),
    (5, 4.5, 'Peak > 10x median?', 'lightsalmon'),
    (2, 3.3, 'WATCH', 'orange'),
    (8, 3.3, 'HEALTHY', 'lightgreen'),
]

for x, y, text, color in steps:
    ax2.text(x, y, text, ha='center', va='center', fontsize=10,
             bbox=dict(boxstyle='round,pad=0.4', facecolor=color))

# Arrows
arrows = [(5,10.7,5,10), (5,9,5,8.3), (5,7.3,5,6.7),
          (3.8,6.2,2.5,5.3), (5,5.7,5,5), (3.8,4.5,2.5,3.6), (6.2,4.5,7.5,3.6)]
for x1,y1,x2,y2 in arrows:
    ax2.annotate('', xy=(x2,y2), xytext=(x1,y1),
                arrowprops=dict(arrowstyle='->', lw=1.5))

ax2.text(3, 6.2, 'Yes', fontsize=9, color='red')
ax2.text(5.3, 5.7, 'No', fontsize=9)
ax2.text(3, 4.5, 'Yes', fontsize=9, color='orange')
ax2.text(7, 4.5, 'No', fontsize=9, color='green')

plt.savefig('flowchart.png', dpi=150, bbox_inches='tight')
```

#### Judging Feedback

**Criticism:** The RPM uncertainty observation is excellent — recognizing that measurement uncertainty propagates into fault frequency estimates and compounds at higher harmonics shows strong analytical thinking. The flowchart gap is a straightforward deliverable catch. However, the student missed a more fundamental issue: the classification still relies entirely on peak magnitude relative to the median PSD, which is sensitive to the overall noise floor. A machine with high broadband vibration (e.g., from misalignment) could mask bearing fault peaks. The student should have flagged the need for spectral kurtosis or an envelope analysis approach.

**Better Alternative:** Should have also flagged the vulnerability of median-relative thresholds to broadband interference.

**Grade: B**

#### Steering Feedback

**Criticism:** The proportional bandwidth correction is a clever and correct fix for the RPM uncertainty problem. The flowchart request completes the deliverables. However, the steering did not push toward more robust detection methods. The entire classification logic remains based on simple peak-to-median ratios, which is fragile in practice. A stronger correction would steer toward computing spectral kurtosis or the envelope spectrum to improve detection sensitivity.

**Better Alternative:** Should have also steered toward envelope spectrum analysis for more reliable bearing fault detection.

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

The student demonstrated solid foundational knowledge of vibration analysis and PSD estimation. Framing correctly identified the critical missing parameters (sample rate, bearing geometry) but missed data-unit ambiguity and the need for classification standard references. Judging was consistently good — catching frequency resolution issues, arbitrary thresholds, and RPM uncertainty propagation. However, the student never pushed toward envelope analysis, which is the industry-standard technique for bearing fault detection and represents the most significant gap in the AI's approach. Steering corrections were practical and correct but incremental rather than transformative. To improve, the student should study envelope analysis and spectral kurtosis as primary bearing diagnostic tools.
