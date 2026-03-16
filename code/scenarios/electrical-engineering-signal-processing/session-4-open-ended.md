# Session 4 — Open-Ended: Implement an Acoustic Echo Canceller for a Speakerphone

**Mode:** Open-Ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Implement an adaptive echo canceller in Python that processes two WAV files — a far-end reference signal and a near-end microphone recording containing echo — and outputs a cleaned near-end WAV file with the echo removed. Deliver the source code, a convergence plot showing the filter error over time, and a brief technical memo comparing your results under single-talk and double-talk conditions. The hardware team says the echo path is "a couple hundred milliseconds" and the system runs at 16 kHz sample rate.

### Student's Framing Response

**Assumption: "A couple hundred milliseconds" means roughly 200 ms, which at 16 kHz corresponds to 3,200 filter taps.** This is a large filter — convergence speed and computational cost are concerns. An NLMS or block-LMS algorithm may be preferable to standard LMS for stability.

**Constraint: The problem asks for both single-talk and double-talk analysis, but does not specify whether the WAV files contain both conditions or whether we need to synthesize them.** I will assume we need to simulate both conditions by mixing the signals appropriately.

**Gap: No double-talk detector (DTD) is specified as a requirement.** Without a DTD, the adaptive filter will diverge during double-talk because the near-end speech acts as uncorrelated interference, driving the filter adaptation in the wrong direction.

### AI Solution (with embedded subtle issues)

```python
import numpy as np
from scipy.io import wavfile
import matplotlib.pyplot as plt

def lms_aec(ref, mic, filter_len, mu):
    """Standard LMS echo canceller"""
    n = len(mic)
    w = np.zeros(filter_len)
    error = np.zeros(n)

    for i in range(filter_len, n):
        x = ref[i - filter_len:i][::-1]
        y_hat = np.dot(w, x)
        e = mic[i] - y_hat
        w = w + mu * e * x
        error[i] = e

    return error, w

# Load signals
fs_ref, ref = wavfile.read('far_end.wav')
fs_mic, mic = wavfile.read('near_end.wav')
ref = ref.astype(np.float64) / 32768.0
mic = mic.astype(np.float64) / 32768.0

# Parameters
filter_len = 2048  # ~128 ms at 16 kHz
mu = 0.01  # step size

# Run AEC
cleaned, weights = lms_aec(ref, mic, filter_len, mu)

# Output
output = np.int16(cleaned * 32768)
wavfile.write('cleaned.wav', fs_ref, output)

# Convergence plot
plt.figure(figsize=(12, 4))
plt.plot(np.abs(cleaned))
plt.title('Error Signal Magnitude')
plt.xlabel('Sample')
plt.ylabel('|e[n]|')
plt.savefig('convergence.png')
print("Done. Check convergence.png and cleaned.wav")
```

### Framing Feedback

**Criticism:** The student correctly computed the filter length from the echo path delay (200 ms * 16 kHz = 3,200 taps) and identified the double-talk detection gap — both are strong observations. However, the student did not question whether the echo path is linear or time-varying. Speakerphone echo paths often include loudspeaker nonlinearity (especially at high volumes) and room changes (people moving), which affect algorithm selection. The student also did not flag the ambiguity between offline and real-time processing — the problem says "processes two WAV files" (offline), but a speakerphone is inherently a real-time system, and the technical memo should address latency and causality constraints even if the implementation is offline.

**Better Alternative:** Should have also flagged: (1) whether the echo path is linear (affects whether LMS variants are sufficient), (2) whether time-variance of the echo path (people moving, doors opening) requires a faster-tracking algorithm, and (3) the offline vs. real-time ambiguity.

**Grade: B**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as AI solution above)

#### Judging Sub-step


gaps:
  - name: "The echo path is described as \"a couple hundred"
    description: "The echo path is described as \"a couple hundred milliseconds,\" meaning the filter is too short by about 50%. An under-dimensioned filter cannot model the full echo path, leaving residual echo in the output."
  - name: "For standard LMS, the step size must satisfy `mu < 2 /"
    description: "For standard LMS, the step size must satisfy `mu < 2 / (L * sigma_x^2)` where L is the filter length and sigma_x^2 is the input signal power. Without this check, the filter may diverge."
  - name: "A meaningful convergence plot would show the echo return"
    description: "A meaningful convergence plot would show the echo return loss enhancement (ERLE) over time, computed as the ratio of the microphone signal power to the error signal power in dB, smoothed over short segments."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Consider 4,000 taps to provide margin for uncertainty in"
    description: "Consider 4,000 taps to provide margin for uncertainty in the \"couple hundred milliseconds\" estimate."
  - name: "Use mu_nlms = 0.5 with regularization delta = 1e-6 and"
    description: "Use mu_nlms = 0.5 with regularization delta = 1e-6 and update rule `w += mu_nlms * e * x / (dot(x,x) + delta)`.

Correction: Replace the error magnitude plot with an ERLE (Echo Return Loss Enhancement) plot computed as `ERLE(n) = 10*log10(mean(mic^2) / mean(error^2))` over 20 ms frames."

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
import matplotlib.pyplot as plt

def nlms_aec(ref, mic, filter_len, mu=0.5, delta=1e-6):
    """NLMS echo canceller"""
    n = len(mic)
    w = np.zeros(filter_len)
    error = np.zeros(n)

    for i in range(filter_len, n):
        x = ref[i - filter_len:i][::-1]
        y_hat = np.dot(w, x)
        e = mic[i] - y_hat
        norm = np.dot(x, x) + delta
        w = w + (mu / norm) * e * x
        error[i] = e

    return error, w

# Load
fs_ref, ref = wavfile.read('far_end.wav')
fs_mic, mic = wavfile.read('near_end.wav')
ref = ref.astype(np.float64) / 32768.0
mic = mic.astype(np.float64) / 32768.0

# Parameters
fs = 16000
filter_len = 4000  # 250 ms — covers "couple hundred ms" with margin
mu = 0.5

# Run NLMS AEC
cleaned, weights = nlms_aec(ref, mic, filter_len, mu)

# Clip and save
cleaned = np.clip(cleaned, -1.0, 1.0)
output = np.int16(cleaned * 32768)
wavfile.write('cleaned.wav', fs, output)

# ERLE plot
frame_len = int(0.02 * fs)  # 20 ms frames
n_frames = len(mic) // frame_len
erle = np.zeros(n_frames)
for i in range(n_frames):
    s = i * frame_len
    e = (i + 1) * frame_len
    mic_power = np.mean(mic[s:e]**2) + 1e-10
    err_power = np.mean(cleaned[s:e]**2) + 1e-10
    erle[i] = 10 * np.log10(mic_power / err_power)

time_axis = np.arange(n_frames) * 0.02
plt.figure(figsize=(12, 4))
plt.plot(time_axis, erle)
plt.xlabel('Time (s)')
plt.ylabel('ERLE (dB)')
plt.title('Echo Return Loss Enhancement')
plt.grid(True)
plt.savefig('convergence.png', dpi=150)
print(f"Average ERLE: {np.mean(erle[n_frames//2:]):.1f} dB")
```

#### Judging Feedback

**Criticism:** All three observations are technically correct and impactful. The under-dimensioned filter is a critical error that would leave residual echo. The unjustified step size could cause divergence. The ERLE suggestion transforms a useless plot into a meaningful performance metric. However, the student did not flag that there is no double-talk analysis — the problem explicitly requires comparing single-talk and double-talk performance, but the code processes the signals only once without distinguishing or simulating these conditions.

**Better Alternative:** Should have also flagged the missing double-talk analysis, which is an explicit deliverable.

**Grade: A**

#### Steering Feedback

**Criticism:** All three corrections are well-targeted. The filter length increase is properly justified with margin. NLMS is the correct upgrade — it solves the step-size stability problem automatically. The ERLE metric is the standard measure for echo canceller performance. However, the student did not steer toward addressing the double-talk problem, which is both a deliverable requirement and a fundamental challenge for adaptive echo cancellers. Without a double-talk detector or analysis, the technical memo cannot compare single-talk and double-talk performance.

**Better Alternative:** Should have also directed the AI to implement a simple double-talk detector (e.g., Geigel DTD or cross-correlation-based) and to run the AEC separately on single-talk and double-talk segments for comparison.

**Grade: B**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1)

#### Judging Sub-step


gaps:
  - name: "The problem explicitly asks for a technical memo"
    description: "The problem explicitly asks for a technical memo comparing results under single-talk and double-talk conditions. Without at minimum simulating both conditions, this deliverable cannot be produced."
  - name: "Gap: The ERLE computation assumes the entire signal is echo."
    description: "During double-talk, the error signal contains near-end speech (which is desired output), so ERLE is not a valid metric for those segments. The evaluation needs to distinguish between echo suppression and near-end speech preservation."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "1. Single-talk: Far-end active, near-end silent (only"
    description: "1. Single-talk: Far-end active, near-end silent (only echo in microphone)
2. Double-talk: Both far-end and near-end active simultaneously"
  - name: "Compare ERLE and near-end speech distortion with and"
    description: "Compare ERLE and near-end speech distortion with and without the DTD active."

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
import matplotlib.pyplot as plt

def nlms_aec_with_dtd(ref, mic, filter_len, mu=0.5, delta=1e-6,
                       dtd_threshold=0.5, dtd_enabled=True):
    """NLMS echo canceller with Geigel double-talk detector"""
    n = len(mic)
    w = np.zeros(filter_len)
    error = np.zeros(n)
    dtd_flags = np.zeros(n, dtype=bool)

    for i in range(filter_len, n):
        x = ref[i - filter_len:i][::-1]
        y_hat = np.dot(w, x)
        e = mic[i] - y_hat
        error[i] = e

        # Geigel DTD: compare mic level to max ref level
        max_ref = np.max(np.abs(x))
        if dtd_enabled and np.abs(mic[i]) > dtd_threshold * max_ref and max_ref > 1e-6:
            dtd_flags[i] = True
            continue  # freeze adaptation

        norm = np.dot(x, x) + delta
        w += (mu / norm) * e * x

    return error, w, dtd_flags

# Load signals
fs = 16000
fs_ref, ref = wavfile.read('far_end.wav')
fs_mic, mic = wavfile.read('near_end.wav')
ref = ref.astype(np.float64) / 32768.0
mic = mic.astype(np.float64) / 32768.0

filter_len = 4000  # 250 ms

# Run with DTD
cleaned_dtd, w_dtd, flags = nlms_aec_with_dtd(ref, mic, filter_len, dtd_enabled=True)
# Run without DTD
cleaned_no_dtd, w_no_dtd, _ = nlms_aec_with_dtd(ref, mic, filter_len, dtd_enabled=False)

# Clip and save
cleaned_dtd = np.clip(cleaned_dtd, -1.0, 1.0)
wavfile.write('cleaned_with_dtd.wav', fs, np.int16(cleaned_dtd * 32768))

# ERLE comparison
frame_len = int(0.02 * fs)

def compute_erle(mic_seg, err_seg, frame_len):
    n_frames = len(mic_seg) // frame_len
    erle = []
    for i in range(n_frames):
        s, e = i * frame_len, (i+1) * frame_len
        mp = np.mean(mic_seg[s:e]**2) + 1e-10
        ep = np.mean(err_seg[s:e]**2) + 1e-10
        erle.append(10 * np.log10(mp / ep))
    return np.array(erle)

n_frames = len(mic) // frame_len
erle_dtd = compute_erle(mic, cleaned_dtd, frame_len)
erle_no_dtd = compute_erle(mic, cleaned_no_dtd, frame_len)

# Classify frames by DTD activity
dtd_per_frame = [np.mean(flags[i*frame_len:(i+1)*frame_len]) for i in range(n_frames)]
st_mask = np.array(dtd_per_frame) < 0.3
dt_mask = ~st_mask

# Plot
fig, axes = plt.subplots(2, 1, figsize=(14, 8))
t = np.arange(n_frames) * 0.02

axes[0].plot(t, erle_dtd, label='With DTD')
axes[0].plot(t, erle_no_dtd, '--', alpha=0.7, label='Without DTD')
axes[0].set_ylabel('ERLE (dB)')
axes[0].set_title('ERLE Convergence')
axes[0].legend()
axes[0].grid(True)

axes[1].fill_between(t, 0, np.array(dtd_per_frame), alpha=0.3, color='red', label='DTD active')
axes[1].set_xlabel('Time (s)')
axes[1].set_ylabel('DTD Activity')
axes[1].set_title('Double-Talk Detector Output')
axes[1].legend()
axes[1].grid(True)

plt.tight_layout()
plt.savefig('convergence.png', dpi=150)

# Technical memo
print("=" * 50)
print("TECHNICAL MEMO: Echo Canceller Performance")
print("=" * 50)
print(f"Filter: NLMS, {filter_len} taps ({filter_len/fs*1000:.0f} ms)")
print(f"DTD: Geigel, threshold=0.5")
print()
print(f"{'Condition':<20} {'ERLE w/ DTD':>12} {'ERLE w/o DTD':>14}")
print("-" * 48)
if np.any(st_mask):
    print(f"{'Single-talk':<20} {np.mean(erle_dtd[st_mask]):>12.1f} {np.mean(erle_no_dtd[st_mask]):>14.1f}")
if np.any(dt_mask):
    print(f"{'Double-talk':<20} {np.mean(erle_dtd[dt_mask]):>12.1f} {np.mean(erle_no_dtd[dt_mask]):>14.1f}")
print()
print(f"DTD activations: {100*np.mean(flags):.1f}% of samples")
```

#### Judging Feedback

**Criticism:** Both observations are correct and important. The missing double-talk analysis was a significant deliverable gap. The insight about ERLE being invalid during double-talk shows good understanding — during double-talk, the error signal should contain near-end speech, so high ERLE would actually indicate speech distortion rather than good echo cancellation. However, the student did not question the assumption that the DTD flag can reliably separate single-talk from double-talk segments. This depends on the DTD threshold, which is set without justification.

**Better Alternative:** Should have also flagged the unjustified DTD threshold and suggested a sensitivity analysis.

**Grade: A**

#### Steering Feedback

**Criticism:** The double-talk simulation and Geigel DTD are appropriate additions that directly address the missing deliverable. The comparison with and without DTD is a sound experimental design. However, the Geigel DTD threshold of 0.5 is set without justification — in practice, typical Geigel thresholds are around 0.5-0.7 depending on the echo path loss. The student could have steered toward analyzing the DTD sensitivity to this threshold, which would strengthen the technical memo.

**Better Alternative:** Should have also directed the AI to evaluate DTD performance across multiple threshold values to show the trade-off between false alarms and missed double-talk detections.

**Grade: A**

---

### Cycle 3

#### Student marks: **Done**

---

## Completion

| Skill    | Grade |
| -------- | ----- |
| Framing  | B     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

Solid performance with consistent B to B+ quality across all three skills. The student demonstrated good understanding of adaptive filter fundamentals — correctly identifying the filter length underestimation, the need for NLMS over LMS, and the importance of ERLE as a metric. The double-talk gap was caught in Cycle 2, and the student's steering toward a Geigel DTD was practical and appropriate. Main weaknesses: the student did not address echo path linearity or time-variance in framing, and did not push toward analyzing the DTD threshold sensitivity. The overall trajectory shows good improvement across cycles, with each intervention moving the solution meaningfully forward.
