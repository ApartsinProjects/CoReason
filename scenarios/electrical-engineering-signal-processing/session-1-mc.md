# Session 1 — Multiple Choice: Build a Real-Time Noise Gate for Live Concert Audio

**Mode:** Multiple Choice

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Design and implement a noise-reduction processing chain in Python (using NumPy/SciPy) that takes a raw 16-bit WAV recording of a live jazz concert and outputs a cleaned WAV file where stage bleed and HVAC rumble are suppressed while preserving the original instrument timbres. Deliver the source code, a before/after spectrogram comparison plot, and a one-page write-up explaining your filter choices. The venue says the room "resonates around 120 Hz" and the recording was made with "standard microphones at 48 kHz."

### Student's Framing Response

**Which of the following issues should be raised before starting this problem?**

- (A) The 48 kHz sample rate is insufficient for audio processing and should be increased to 96 kHz
- **(B) The number of recording channels is unspecified, which determines whether spatial filtering techniques are available** [SELECTED]
- (C) The problem is fully specified — a high-pass filter at 120 Hz and spectral subtraction will solve it
- **(D) "Preserving original instrument timbres" is vague — no perceptual or quantitative quality metric is defined** [SELECTED]
- (E) The 120 Hz room resonance overlaps with bass instrument fundamentals, so a broadband high-pass filter would damage the music content

**Student selected: B, D**

### AI Solution (with embedded subtle issues)

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, filtfilt, stft, istft
import matplotlib.pyplot as plt

fs, data = wavfile.read('concert.wav')
data = data.astype(np.float64) / 32768.0

# High-pass at 100 Hz to remove HVAC rumble
b, a = butter(4, 100 / (fs / 2), btype='high')
filtered = filtfilt(b, a, data)

# Spectral gating
f, t, Zxx = stft(filtered, fs=fs, nperseg=2048)
magnitude = np.abs(Zxx)
phase = np.angle(Zxx)

noise_profile = np.mean(magnitude[:, :int(0.5 * fs / 1024)], axis=1, keepdims=True)
mask = magnitude > (noise_profile * 2.0)
clean_stft = magnitude * mask * np.exp(1j * phase)
_, cleaned = istft(clean_stft, fs=fs, nperseg=2048)

output = np.int16(cleaned * 32768)
wavfile.write('concert_cleaned.wav', fs, output)

fig, axes = plt.subplots(2, 1, figsize=(12, 8))
axes[0].specgram(data, Fs=fs, NFFT=2048)
axes[0].set_title('Before')
axes[1].specgram(cleaned, Fs=fs, NFFT=2048)
axes[1].set_title('After')
plt.savefig('comparison.png')
```

### Framing Feedback

**Criticism:** The student correctly identified two important issues: the missing channel count (B) and the vague quality metric (D). However, the student missed option (E), which is arguably the most critical framing issue — the 120 Hz room resonance sits squarely in the range of bass instruments, and failing to flag this leads directly to the AI's flawed high-pass filter approach. Options B and D are both valid but less impactful than the spectral overlap concern.

**Better Alternative:** The strongest selection would have been B, D, and E. Option E directly prevents the most damaging design error in the AI's solution. The student should recognize that when a noise frequency coincides with signal content, the entire noise-reduction strategy must change from broadband filtering to narrowband or adaptive approaches.

**Grade: B**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as AI solution above)

#### Judging Sub-step

**Which issues exist in the AI's solution? (select all that apply)**

- **(A) The high-pass filter at 100 Hz removes bass instrument content along with HVAC noise** [SELECTED]
- (B) The STFT window size of 2048 samples is too large for real-time processing
- **(C) The binary spectral mask will produce "musical noise" artifacts due to hard on/off switching** [SELECTED]
- (D) The `filtfilt` function introduces phase distortion that damages stereo imaging
- (E) The noise profile assumes the first 0.5 seconds is noise-only, which is unverified

**Student selected: A, C**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Increase the STFT window to 4096 for better frequency resolution
- **(B) Replace the broadband high-pass with a notch filter at 120 Hz and use a soft spectral gain function instead of a binary mask** [SELECTED]
- (C) Switch from Butterworth to Chebyshev Type II for a steeper roll-off
- (D) Add a pre-emphasis filter before the spectral gating stage
- (E) Use a median filter on the spectrogram to remove impulsive noise

**Student selected: B**

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import iirnotch, filtfilt, stft, istft, butter
from scipy.ndimage import uniform_filter1d
import matplotlib.pyplot as plt

fs, data = wavfile.read('concert.wav')
data = data.astype(np.float64) / 32768.0

# Notch filter at 120 Hz room resonance
b_notch, a_notch = iirnotch(120, Q=12, fs=fs)
filtered = filtfilt(b_notch, a_notch, data)

# Gentle HPF at 30 Hz for sub-bass
b_hp, a_hp = butter(2, 30 / (fs / 2), btype='high')
filtered = filtfilt(b_hp, a_hp, filtered)

# Wiener-style spectral gate
f, t, Zxx = stft(filtered, fs=fs, nperseg=2048)
magnitude = np.abs(Zxx)
phase = np.angle(Zxx)

noise_profile = np.mean(magnitude[:, :int(0.5 * fs / 1024)], axis=1, keepdims=True)
gain = np.maximum(0, 1 - 2.0 * noise_profile / (magnitude + 1e-10))
gain = uniform_filter1d(gain, size=5, axis=1)

clean_stft = magnitude * gain * np.exp(1j * phase)
_, cleaned = istft(clean_stft, fs=fs, nperseg=2048)

output = np.int16(cleaned * 32768)
wavfile.write('concert_cleaned.wav', fs, output)

fig, axes = plt.subplots(2, 1, figsize=(12, 8))
axes[0].specgram(data, Fs=fs, NFFT=2048)
axes[0].set_title('Before')
axes[1].specgram(cleaned, Fs=fs, NFFT=2048)
axes[1].set_title('After')
plt.savefig('comparison.png')
```

#### Judging Feedback

**Criticism:** The student correctly identified the two most impactful issues: the bass-damaging HPF (A) and the musical noise from binary masking (C). These are both significant and well-chosen. However, option (E) — the unverified noise profile — is also a real issue that the student missed. If the recording starts with music rather than silence, the entire spectral gating stage will malfunction. Option (D) is a distractor (`filtfilt` is zero-phase), and (B) is debatable (2048 at 48 kHz gives ~43 ms windows, which is reasonable).

**Better Alternative:** The optimal selection was A, C, and E.

**Grade: B**

#### Steering Feedback

**Criticism:** Option (B) is the strongest correction available — it addresses both critical issues in a single directive. The notch filter preserves bass content, and the soft gain function eliminates musical noise. This was the correct choice. Options A, C, D, and E are either irrelevant or would not address the core problems.

**Better Alternative:** No better single option exists. The student could have elaborated on desired Q factor and gain function parameters, but within the MC framework this is the best choice.

**Grade: A**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1)

#### Judging Sub-step

**Which issues remain in the updated AI solution? (select all that apply)**

- (A) The notch filter Q factor of 12 is too narrow and misses the HVAC rumble bandwidth
- **(B) The spectrogram comparison is purely visual — no quantitative metric evaluates the noise reduction effectiveness** [SELECTED]
- (C) The Wiener gain `alpha = 2.0` is too aggressive and will suppress quiet musical passages
- **(D) No clipping protection exists before int16 conversion — values outside [-1, 1] will wrap around** [SELECTED]
- (E) The code is missing the one-page write-up deliverable

**Student selected: B, D**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

**Which correction should be sent to the AI?**

- (A) Add dithering before quantization to 16-bit
- (B) Switch to a Hann window for the STFT to reduce spectral leakage
- **(C) Add `np.clip` before int16 conversion and compute noise-floor reduction in dB using a noise-only segment** [SELECTED]
- (D) Replace the spectrogram with a Mel-frequency spectrogram for perceptual relevance
- (E) Add a de-esser stage to handle sibilance artifacts from the spectral gating

**Student selected: C**

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import iirnotch, filtfilt, stft, istft, butter
from scipy.ndimage import uniform_filter1d
import matplotlib.pyplot as plt

fs, data = wavfile.read('concert.wav')
data = data.astype(np.float64) / 32768.0

# Notch at 120 Hz + gentle HPF at 30 Hz
b_notch, a_notch = iirnotch(120, Q=12, fs=fs)
filtered = filtfilt(b_notch, a_notch, data)
b_hp, a_hp = butter(2, 30 / (fs / 2), btype='high')
filtered = filtfilt(b_hp, a_hp, filtered)

# Wiener-style spectral gate
f, t, Zxx = stft(filtered, fs=fs, nperseg=2048, noverlap=1536)
magnitude = np.abs(Zxx)
phase = np.angle(Zxx)
noise_profile = np.mean(magnitude[:, :int(0.5 * fs / 512)], axis=1, keepdims=True)
gain = np.maximum(0, 1 - 2.0 * noise_profile / (magnitude + 1e-10))
gain = uniform_filter1d(gain, size=5, axis=1)
clean_stft = magnitude * gain * np.exp(1j * phase)
_, cleaned = istft(clean_stft, fs=fs, nperseg=2048, noverlap=1536)

# Clip and convert
cleaned = np.clip(cleaned, -1.0, 1.0)
output = np.int16(cleaned * 32768)
wavfile.write('concert_cleaned.wav', fs, output)

# Noise-floor measurement (using first 0.5s as noise segment)
noise_seg_orig = data[:int(0.5 * fs)]
noise_seg_clean = cleaned[:int(0.5 * fs)]
nf_orig = 10 * np.log10(np.mean(noise_seg_orig**2) + 1e-20)
nf_clean = 10 * np.log10(np.mean(noise_seg_clean**2) + 1e-20)
print(f"Noise floor before: {nf_orig:.1f} dB")
print(f"Noise floor after:  {nf_clean:.1f} dB")
print(f"Reduction:          {nf_orig - nf_clean:.1f} dB")

# Spectrogram comparison
fig, axes = plt.subplots(2, 1, figsize=(12, 8))
axes[0].specgram(data, Fs=fs, NFFT=2048)
axes[0].set_title('Before')
axes[1].specgram(cleaned, Fs=fs, NFFT=2048)
axes[1].set_title('After')
plt.tight_layout()
plt.savefig('comparison.png', dpi=150)
```

#### Judging Feedback

**Criticism:** Both selections are valid. The clipping issue (D) is a real bug that would cause audible artifacts. The lack of quantitative evaluation (B) is also a genuine deliverable gap. However, the student missed option (E) — the write-up deliverable is still absent from the AI output. While (C) is debatable (alpha=2.0 is a common choice), (A) could have been flagged too since the HVAC rumble bandwidth may exceed the notch filter's reach.

**Better Alternative:** The strongest selection would include B, D, and E.

**Grade: B**

#### Steering Feedback

**Criticism:** Option (C) addresses both identified issues in a single correction — clipping protection and noise-floor measurement. This is the most impactful option. The noise-floor measurement approach (using a noise-only segment) is more appropriate than whole-signal SNR since no clean reference exists. Good selection.

**Better Alternative:** No better option was available.

**Grade: A**

---

### Cycle 3

#### Student marks: **Done**

---

## Completion

| Skill    | Grade |
| -------- | ----- |
| Framing  | B     |
| Judging  | B     |
| Steering | A     |

### Summary Feedback

The student's framing missed the critical spectral overlap issue between the 120 Hz resonance and bass instruments, which is the most consequential framing gap. During judging, the student consistently identified the most impactful errors (bass damage, musical noise, clipping) but missed secondary issues like the unverified noise profile and the missing write-up deliverable. Steering selections were strong throughout — the student chose the most effective correction in both cycles. The pattern suggests the student is better at prescribing fixes than at comprehensively diagnosing problems. To improve, focus on exhaustive issue scanning before deciding which corrections to prioritize.
