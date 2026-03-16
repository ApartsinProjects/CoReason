# Session 4 — Multiple Choice: Implement an Acoustic Echo Canceller for a Speakerphone

**Mode:** Multiple Choice

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Implement an adaptive echo canceller in Python that processes two WAV files — a far-end reference signal and a near-end microphone recording containing echo — and outputs a cleaned near-end WAV file with the echo removed. Deliver the source code, a convergence plot showing the filter error over time, and a brief technical memo comparing your results under single-talk and double-talk conditions. The hardware team says the echo path is "a couple hundred milliseconds" and the system runs at 16 kHz sample rate.

### Student's Framing Response

**Which of the following issues should be raised before starting this problem?**

- **(A) "A couple hundred milliseconds" is imprecise — the difference between 150 ms and 300 ms changes the filter length from 2,400 to 4,800 taps, affecting both convergence speed and computation** [SELECTED]
- (B) Python is too slow for adaptive filtering; this should be implemented in C with fixed-point arithmetic
- **(C) The problem does not specify whether double-talk detection is a separate module or must be handled by the adaptive algorithm itself** [SELECTED]
- (D) The 16 kHz sample rate is too low for wideband echo cancellation and should be increased to 48 kHz
- (E) The echo path is certainly nonlinear due to loudspeaker distortion, making linear adaptive filters inadequate

**Student selected: A, C**

### AI Solution (with embedded subtle issues)

```python
import numpy as np
from scipy.io import wavfile
import matplotlib.pyplot as plt

fs, far_end = wavfile.read('far_end.wav')
_, near_end = wavfile.read('near_end.wav')
far_end = far_end.astype(np.float64) / 32768.0
near_end = near_end.astype(np.float64) / 32768.0

# LMS echo canceller
N = 2048  # filter length
mu = 0.01
w = np.zeros(N)
output = np.zeros(len(near_end))
error = np.zeros(len(near_end))

for n in range(N, len(near_end)):
    x = far_end[n-N:n][::-1]
    y_hat = np.dot(w, x)
    e = near_end[n] - y_hat
    w = w + mu * e * x
    output[n] = e
    error[n] = e**2

wavfile.write('cleaned.wav', fs, np.int16(output * 32768))

plt.figure(figsize=(12, 4))
plt.plot(10 * np.log10(error + 1e-20))
plt.xlabel('Sample')
plt.ylabel('Error (dB)')
plt.title('LMS Convergence')
plt.savefig('convergence.png')
```

### Framing Feedback

**Criticism:** Both selections are valid. Option (A) correctly quantifies the impact of echo path uncertainty on filter dimensioning, which is the most concrete framing issue. Option (C) addresses an architectural ambiguity in the deliverables. These are solid choices.

However, the student missed option (E), which raises a legitimate concern. While linear adaptive filters are the standard approach, acknowledging that real echo paths include loudspeaker nonlinearity — and stating that a linear model is a starting assumption — would strengthen the framing. The student also did not raise any concern about the echo-to-noise ratio in the near-end signal, or whether ambient noise affects the adaptive filter's convergence.

**Better Alternative:** The strongest selection would be A, C, and E. While (E) is somewhat advanced, it demonstrates awareness that the LTI assumption underlying linear adaptive filters is an approximation.

**Grade: B**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as AI solution above)

#### Judging Sub-step

**Which issues exist in the AI's solution? (select all that apply)**

- **(A) The filter length of 2048 taps (128 ms) is shorter than the stated echo path, leaving residual echo** [SELECTED]
- **(B) The LMS step size mu=0.01 is unnormalized — convergence depends on the input signal power, which varies over time** [SELECTED]
- (C) The `filtfilt` function should be used instead of sample-by-sample processing for better performance
- (D) The far-end reference signal should be whitened before feeding it to the adaptive filter
- **(E) No ERLE (Echo Return Loss Enhancement) metric is computed — the convergence plot shows raw error, not echo cancellation performance** [SELECTED]

**Student selected: A, B, E**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Switch to the RLS algorithm for faster convergence at the cost of higher computation
- **(B) Increase filter length to 4800 taps (300 ms), switch to NLMS with normalized step size, and compute ERLE over time** [SELECTED]
- (C) Implement a frequency-domain adaptive filter (FDAF) for computational efficiency
- (D) Add a pre-whitening filter to the far-end reference to decorrelate the input
- (E) Use the Kalman filter framework instead of LMS for optimal estimation

**Student selected: B**

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
import matplotlib.pyplot as plt

fs, far_end = wavfile.read('far_end.wav')
_, near_end = wavfile.read('near_end.wav')
far_end = far_end.astype(np.float64) / 32768.0
near_end = near_end.astype(np.float64) / 32768.0

# NLMS parameters
N = 4800         # 300 ms at 16 kHz
mu = 0.5         # NLMS step size
delta = 1e-6     # regularization

w = np.zeros(N)
output = np.zeros(len(near_end))
error_sq = np.zeros(len(near_end))

for n in range(N, len(near_end)):
    x = far_end[n-N:n][::-1]
    y_hat = np.dot(w, x)
    e = near_end[n] - y_hat
    x_power = np.dot(x, x) + delta
    w = w + (mu / x_power) * e * x
    output[n] = e
    error_sq[n] = e**2

# Clip and save
output = np.clip(output, -1.0, 1.0)
wavfile.write('cleaned.wav', fs, np.int16(output * 32768))

# ERLE
win = int(0.1 * fs)
erle = np.zeros(len(near_end))
for n in range(win, len(near_end)):
    d_pow = np.mean(near_end[n-win:n]**2) + 1e-20
    e_pow = np.mean(output[n-win:n]**2) + 1e-20
    erle[n] = 10 * np.log10(d_pow / e_pow)

# Plot
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
smooth = np.convolve(error_sq, np.ones(1000)/1000, mode='same')
ax1.plot(np.arange(len(smooth))/fs, 10*np.log10(smooth+1e-20))
ax1.set_ylabel('Smoothed MSE (dB)')
ax1.set_title('NLMS Convergence')
ax1.grid(True)

ax2.plot(np.arange(len(erle))/fs, erle)
ax2.set_xlabel('Time (s)')
ax2.set_ylabel('ERLE (dB)')
ax2.set_title('Echo Return Loss Enhancement')
ax2.grid(True)
plt.tight_layout()
plt.savefig('convergence.png', dpi=150)

print(f"Filter: {N} taps ({N/fs*1000:.0f} ms)")
print(f"Steady-state ERLE: {np.mean(erle[int(2*fs):]):.1f} dB")
```

#### Judging Feedback

**Criticism:** Excellent selection. All three issues (A, B, E) are genuine, high-impact problems correctly identified. The filter under-dimensioning (A) is the most critical since it creates irreducible residual echo. The unnormalized step size (B) is a well-known LMS limitation. The missing ERLE metric (E) is the standard echo canceller performance measure. The student correctly avoided distractor (C) — `filtfilt` is for offline filtering and is not applicable to adaptive algorithms — and (D) — while pre-whitening can improve convergence, it is not a primary issue.

**Better Alternative:** No better selection exists.

**Grade: A**

#### Steering Feedback

**Criticism:** Option (B) is the most comprehensive correction, addressing all three identified issues in one directive. The specific parameters (4800 taps, NLMS with mu=0.5) are well-chosen. This is the correct selection. Options (A) and (E) are algorithmically more complex but not necessary for this problem. Option (C) improves efficiency but not correctness. Option (D) is a secondary optimization.

**Better Alternative:** No better option exists.

**Grade: A**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1)

#### Judging Sub-step

**Which issues remain in the updated solution? (select all that apply)**

- **(A) No double-talk detection is implemented — the adaptive filter will diverge when the near-end talker speaks** [SELECTED]
- (B) The NLMS step size of 0.5 is too aggressive and will cause instability
- (C) The regularization parameter delta=1e-6 is too small for 16-bit audio signals
- **(D) The technical memo deliverable comparing single-talk and double-talk performance is missing** [SELECTED]
- (E) The convergence plot should use a logarithmic time axis for better visualization

**Student selected: A, D**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Add a simple energy-based voice activity detector to mute the output during silence
- (B) Implement a two-path echo canceller with separate foreground and background filters
- **(C) Add a Geigel-style double-talk detector that freezes adaptation when near-end energy exceeds a threshold relative to far-end energy, and generate a technical memo with ERLE comparison** [SELECTED]
- (D) Switch to a variable step-size NLMS that reduces mu during double-talk
- (E) Add a nonlinear processor (NLP) after the adaptive filter to suppress residual echo

**Student selected: C**

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
import matplotlib.pyplot as plt

fs, far_end = wavfile.read('far_end.wav')
_, near_end = wavfile.read('near_end.wav')
far_end = far_end.astype(np.float64) / 32768.0
near_end = near_end.astype(np.float64) / 32768.0

# Parameters
N = 4800
mu = 0.5
delta = 1e-6
DTD_THRESH = 0.6
DTD_WIN = int(0.02 * fs)

# NLMS + DTD
w = np.zeros(N)
output = np.zeros(len(near_end))
error_sq = np.zeros(len(near_end))
is_doubletalk = np.zeros(len(near_end), dtype=bool)

for n in range(N, len(near_end)):
    x = far_end[n-N:n][::-1]
    y_hat = np.dot(w, x)
    e = near_end[n] - y_hat
    output[n] = e
    error_sq[n] = e**2

    # DTD
    if n >= DTD_WIN:
        ne_pow = np.mean(near_end[n-DTD_WIN:n]**2)
        fe_pow = np.mean(far_end[n-DTD_WIN:n]**2)
        if fe_pow > 1e-10 and ne_pow / fe_pow > DTD_THRESH:
            is_doubletalk[n] = True

    if not is_doubletalk[n]:
        x_pow = np.dot(x, x) + delta
        w = w + (mu / x_pow) * e * x

# Output
output = np.clip(output, -1.0, 1.0)
wavfile.write('cleaned.wav', fs, np.int16(output * 32768))

# ERLE
win = int(0.1 * fs)
erle = np.zeros(len(near_end))
for n in range(win, len(near_end)):
    d_pow = np.mean(near_end[n-win:n]**2) + 1e-20
    e_pow = np.mean(output[n-win:n]**2) + 1e-20
    erle[n] = 10 * np.log10(d_pow / e_pow)

# Segment ERLE
st_erle = np.mean(erle[win:][~is_doubletalk[win:]]) if np.any(~is_doubletalk[win:]) else 0
dt_erle = np.mean(erle[win:][is_doubletalk[win:]]) if np.any(is_doubletalk[win:]) else 0

conv_idx = np.where(erle > 10)[0]
conv_time = conv_idx[0] / fs if len(conv_idx) > 0 else float('inf')

# Plots
fig, axes = plt.subplots(3, 1, figsize=(14, 10))

smooth = np.convolve(error_sq, np.ones(1000)/1000, mode='same')
axes[0].plot(np.arange(len(smooth))/fs, 10*np.log10(smooth+1e-20))
axes[0].set_ylabel('MSE (dB)')
axes[0].set_title('Convergence')
axes[0].grid(True)

axes[1].plot(np.arange(len(erle))/fs, erle, 'b-', linewidth=0.5)
axes[1].fill_between(np.arange(len(is_doubletalk))/fs, -5, 35,
                      where=is_doubletalk, color='red', alpha=0.15, label='DT detected')
axes[1].set_ylabel('ERLE (dB)')
axes[1].set_title('ERLE')
axes[1].legend()
axes[1].grid(True)

axes[2].plot(np.arange(len(near_end))/fs, near_end, 'gray', alpha=0.5, label='Near-end mic')
axes[2].plot(np.arange(len(output))/fs, output, 'b', alpha=0.7, label='Cleaned')
axes[2].set_xlabel('Time (s)')
axes[2].set_ylabel('Amplitude')
axes[2].set_title('Waveform Comparison')
axes[2].legend()
axes[2].grid(True)

plt.tight_layout()
plt.savefig('convergence.png', dpi=150)

# Technical memo
print("=" * 60)
print("TECHNICAL MEMO: Acoustic Echo Canceller Performance")
print("=" * 60)
print(f"\n1. SYSTEM CONFIGURATION")
print(f"   Algorithm: NLMS with Geigel DTD")
print(f"   Filter length: {N} taps ({N/fs*1000:.0f} ms)")
print(f"   Step size (mu): {mu}")
print(f"   DTD threshold: {DTD_THRESH}")
print(f"\n2. PERFORMANCE RESULTS")
print(f"   Convergence time (10 dB ERLE): {conv_time:.2f} s")
print(f"   Overall ERLE (steady-state): {np.mean(erle[int(2*fs):]):.1f} dB")
print(f"\n3. SINGLE-TALK vs DOUBLE-TALK COMPARISON")
print(f"   Single-talk ERLE: {st_erle:.1f} dB")
print(f"   Double-talk ERLE: {dt_erle:.1f} dB")
print(f"   Double-talk ratio: {100*np.mean(is_doubletalk):.1f}%")
print(f"\n4. OBSERVATIONS")
print(f"   - NLMS provides stable convergence with input-power normalization")
print(f"   - DTD prevents divergence during double-talk by freezing adaptation")
print(f"   - Single-talk ERLE exceeds double-talk ERLE as expected")
print(f"   - Limitation: Geigel DTD may false-trigger during high echo levels")
```

#### Judging Feedback

**Criticism:** Both selections are correct and important. The missing double-talk handling (A) is the most critical remaining gap given the deliverable requirements. The missing technical memo (D) is a straightforward deliverable observation. The student correctly avoided (B) — mu=0.5 is within the stable range for NLMS (0 < mu < 2). Option (C) is incorrect — delta=1e-6 is a standard regularization value. Option (E) is cosmetic.

However, the student could have gone further by noting that even with a DTD, the echo canceller has no mechanism to handle echo path changes (e.g., someone moving in the room). The filter converges to a static echo path estimate and has no re-convergence or tracking analysis.

**Better Alternative:** A and D are the strongest selections. Should have also considered tracking behavior as a concern.

**Grade: A**

#### Steering Feedback

**Criticism:** Option (C) addresses both critical issues — DTD implementation and the technical memo. The Geigel DTD is a reasonable choice for a first implementation. However, option (B) — the two-path approach — is the industry-standard solution for double-talk handling. In the two-path approach, a background filter adapts continuously while a foreground filter only copies the background coefficients when the background filter's ERLE improves. This avoids the binary freeze/adapt decision of the Geigel DTD and is more robust. The student chose the simpler option over the more robust one.

**Better Alternative:** Option (B) would have been more impactful for double-talk robustness, though (C) is still a valid improvement.

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

The student demonstrated solid understanding of adaptive filtering and echo cancellation. Framing correctly identified echo path uncertainty and the double-talk question but missed the echo path nonlinearity concern. Judging was consistently strong — the student identified all primary issues (under-dimensioned filter, unnormalized step size, missing ERLE, absent DTD) across both cycles with no false positives. Steering showed good practical judgment, choosing comprehensive corrections that addressed multiple issues simultaneously, though the student consistently chose simpler approaches (LMS to NLMS, Geigel DTD) over more robust alternatives (frequency-domain adaptive filter, two-path architecture). For future development, the student should explore two-path echo cancellation and nonlinear post-processing techniques used in commercial speakerphone systems.
