# Session 1 — Open-Ended: Build a Real-Time Noise Gate for Live Concert Audio

**Mode:** Open-Ended (structured sections)

---

## Phase 1 — Framing

### Raw Problem Presented to Student

> Design and implement a noise-reduction processing chain in Python (using NumPy/SciPy) that takes a raw 16-bit WAV recording of a live jazz concert and outputs a cleaned WAV file where stage bleed and HVAC rumble are suppressed while preserving the original instrument timbres. Deliver the source code, a before/after spectrogram comparison plot, and a one-page write-up explaining your filter choices. The venue says the room "resonates around 120 Hz" and the recording was made with "standard microphones at 48 kHz."

### Student's Framing Response

**Assumption: The recording is single-channel (mono).** Since the problem doesn't specify the channel count, I'll assume mono. If it were stereo or multi-mic, spatial filtering techniques would be available but we can't plan for that without confirmation.

**Constraint: HVAC rumble is predominantly below 150 Hz, and stage bleed is broadband.** The 120 Hz room resonance suggests a strong low-frequency mode. HVAC noise typically lives below 200 Hz. Stage bleed is harder — it could overlap with instruments spectrally.

**Assumption: "Preserving timbre" means we should avoid aggressive spectral subtraction that introduces musical noise artifacts.** No perceptual metric (PESQ, POLQA) is specified, so I'll aim for minimal audible coloration judged by spectrogram comparison.

**Gap: We don't know the noise floor level relative to the signal.** Without an SNR estimate or a noise-only segment, it's hard to calibrate any noise reduction algorithm. I'll assume the recording contains at least a few seconds of noise-only content (e.g., between songs) that can serve as a noise profile.

### AI Solution (with embedded subtle issues)

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, filtfilt, stft, istft
import matplotlib.pyplot as plt

# Load WAV
fs, data = wavfile.read('concert.wav')
data = data.astype(np.float64) / 32768.0  # normalize 16-bit

# --- Stage 1: High-pass filter for HVAC rumble ---
# Butterworth HPF at 100 Hz, 4th order
b, a = butter(4, 100 / (fs / 2), btype='high')
filtered = filtfilt(b, a, data)

# --- Stage 2: Spectral gating for stage bleed ---
f, t, Zxx = stft(filtered, fs=fs, nperseg=2048)
magnitude = np.abs(Zxx)
phase = np.angle(Zxx)

# Use first 0.5s as noise profile
noise_profile = np.mean(magnitude[:, :int(0.5 * fs / 1024)], axis=1, keepdims=True)
threshold = noise_profile * 2.0

# Apply gate
mask = magnitude > threshold
clean_magnitude = magnitude * mask
clean_stft = clean_magnitude * np.exp(1j * phase)
_, cleaned = istft(clean_stft, fs=fs, nperseg=2048)

# --- Output ---
output = np.int16(cleaned * 32768)
wavfile.write('concert_cleaned.wav', fs, output)

# --- Spectrogram comparison ---
fig, axes = plt.subplots(2, 1, figsize=(12, 8))
axes[0].specgram(data, Fs=fs, NFFT=2048)
axes[0].set_title('Before')
axes[1].specgram(cleaned, Fs=fs, NFFT=2048)
axes[1].set_title('After')
plt.savefig('comparison.png')
```

**Write-up excerpt:** "We applied a 4th-order Butterworth high-pass filter at 100 Hz to remove HVAC rumble, followed by spectral gating using a noise profile estimated from the first 0.5 seconds. The spectral gate suppresses bins where the magnitude falls below twice the average noise level."

### Framing Feedback

**Criticism:** The student correctly identified the mono assumption and the need for a noise profile, which are strong observations. However, the student treated stage bleed and HVAC rumble as only two categories without questioning whether the "120 Hz resonance" might overlap with bass instruments (upright bass fundamental range: 41-250 Hz). A high-pass filter at or near 120 Hz will damage the bass content of a jazz recording. The student also did not question what "preserving timbre" means quantitatively — simply saying "minimal audible coloration" is vague and mirrors the original problem's vagueness rather than proposing a concrete metric.

**Better Alternative:** The student should have flagged that the 120 Hz resonance falls within the bass instrument range and proposed a notch filter or narrow parametric EQ at the resonance frequency instead of a broadband high-pass. They should also have proposed a specific evaluation criterion, such as "less than 1 dB deviation in the 200 Hz-4 kHz band spectral envelope before and after processing."

**Grade: B**

---

## Phase 2 — Judge+Steer Cycles

### Cycle 1

#### Current AI Output

(Same as the AI solution above)

#### Judging Sub-step


gaps:
  - name: "In a jazz concert, the upright bass and kick drum have"
    description: "In a jazz concert, the upright bass and kick drum have significant energy below 100 Hz. Cutting everything below 100 Hz is too aggressive."
  - name: "— harsh tonal remnants where individual bins flicker on and off"
    description: "— harsh tonal remnants where individual bins flicker on and off. No smoothing or soft-knee transition is applied."
  - name: "If the music starts immediately, the noise profile will"
    description: "If the music starts immediately, the noise profile will be contaminated."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Use `scipy.signal.iirnotch` with a Q factor around 10-15"
    description: "Use `scipy.signal.iirnotch` with a Q factor around 10-15 to remove the resonance without damaging surrounding bass content."
  - name: "Correction: Apply spectral smoothing to the gate mask."
    description: "Use a soft threshold transition (e.g., Wiener-style gain `G = max(0, 1 - alpha * noise/signal)`) instead of a binary on/off mask. This reduces musical noise."

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import iirnotch, filtfilt, stft, istft, butter
import matplotlib.pyplot as plt

fs, data = wavfile.read('concert.wav')
data = data.astype(np.float64) / 32768.0

# --- Stage 1: Notch filter at 120 Hz room resonance ---
b_notch, a_notch = iirnotch(120, Q=12, fs=fs)
filtered = filtfilt(b_notch, a_notch, data)

# --- Stage 1b: Gentle high-pass at 30 Hz for sub-bass rumble ---
b_hp, a_hp = butter(2, 30 / (fs / 2), btype='high')
filtered = filtfilt(b_hp, a_hp, filtered)

# --- Stage 2: Wiener-style spectral subtraction for stage bleed ---
f, t, Zxx = stft(filtered, fs=fs, nperseg=2048)
magnitude = np.abs(Zxx)
phase = np.angle(Zxx)

noise_profile = np.mean(magnitude[:, :int(0.5 * fs / 1024)], axis=1, keepdims=True)
alpha = 2.0
gain = np.maximum(0, 1 - alpha * noise_profile / (magnitude + 1e-10))

# Smooth gain over time to reduce musical noise
from scipy.ndimage import uniform_filter1d
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

**Criticism:** The student correctly identified the bass-damage problem and the musical noise issue — these are the two most important flaws. However, the student missed that the STFT hop size and window parameters are not explicitly set (defaults may vary), and did not flag the spectrogram comparison as lacking quantitative interpretation — the write-up just shows plots without computing any metric like segmental SNR improvement.

**Better Alternative:** Should have also flagged that the spectrogram comparison is purely visual and requested an objective metric (e.g., segmental SNR, spectral distortion measure).

**Grade: B**

#### Steering Feedback

**Criticism:** The notch filter suggestion was well-targeted and technically sound. The Wiener-gain suggestion is a clear improvement over binary masking. However, the student did not specify how to handle the case where the noise profile estimation window might contain music. A better approach would have been to steer toward user-selectable or automatically detected noise-only regions (e.g., using an energy threshold to find silent segments).

**Better Alternative:** Should have also directed the AI to add a noise-profile validation step or an automatic silence detector.

**Grade: B**

---

### Cycle 2

#### Current AI Output

(Updated output from Cycle 1 above)

#### Judging Sub-step


gaps:
  - name: "There is no SNR measurement, no spectral distortion"
    description: "There is no SNR measurement, no spectral distortion metric, nothing to objectively assess whether the processing improved or degraded the signal."
  - name: "No normalization or clipping protection is applied"
    description: "No normalization or clipping protection is applied."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step


instructions:
  - name: "Correction: Add a segmental SNR computation comparing"
    description: "Correction: Add a segmental SNR computation comparing 1-second frames before and after processing, and include SNR improvement in the write-up."
  - name: "Correction: Add clipping protection before int16"
    description: "Correction: Add clipping protection before int16 conversion using `np.clip(cleaned, -1.0, 1.0)`."

#### Updated AI Output

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import iirnotch, filtfilt, stft, istft, butter
from scipy.ndimage import uniform_filter1d
import matplotlib.pyplot as plt

fs, data = wavfile.read('concert.wav')
data = data.astype(np.float64) / 32768.0

# --- Stage 1: Notch at 120 Hz + gentle HPF at 30 Hz ---
b_notch, a_notch = iirnotch(120, Q=12, fs=fs)
filtered = filtfilt(b_notch, a_notch, data)
b_hp, a_hp = butter(2, 30 / (fs / 2), btype='high')
filtered = filtfilt(b_hp, a_hp, filtered)

# --- Stage 2: Wiener-style spectral gate ---
f, t, Zxx = stft(filtered, fs=fs, nperseg=2048, noverlap=1536)
magnitude = np.abs(Zxx)
phase = np.angle(Zxx)

noise_profile = np.mean(magnitude[:, :int(0.5 * fs / 512)], axis=1, keepdims=True)
alpha = 2.0
gain = np.maximum(0, 1 - alpha * noise_profile / (magnitude + 1e-10))
gain = uniform_filter1d(gain, size=5, axis=1)

clean_stft = magnitude * gain * np.exp(1j * phase)
_, cleaned = istft(clean_stft, fs=fs, nperseg=2048, noverlap=1536)

# Clip to prevent int16 overflow
cleaned = np.clip(cleaned, -1.0, 1.0)

# --- Quantitative evaluation ---
def segmental_snr(original, processed, frame_len, fs):
    n_frames = len(original) // frame_len
    snr_values = []
    for i in range(n_frames):
        s = original[i*frame_len:(i+1)*frame_len]
        n = s - processed[i*frame_len:(i+1)*frame_len]
        sig_power = np.mean(s**2)
        noise_power = np.mean(n**2)
        if noise_power > 0:
            snr_values.append(10 * np.log10(sig_power / noise_power))
    return np.mean(snr_values)

min_len = min(len(data), len(cleaned))
seg_snr = segmental_snr(data[:min_len], cleaned[:min_len], fs, fs)
print(f"Segmental SNR improvement: {seg_snr:.1f} dB")

# --- Output ---
output = np.int16(cleaned * 32768)
wavfile.write('concert_cleaned.wav', fs, output)

fig, axes = plt.subplots(2, 1, figsize=(12, 8))
axes[0].specgram(data, Fs=fs, NFFT=2048)
axes[0].set_title('Before')
axes[1].specgram(cleaned[:min_len], Fs=fs, NFFT=2048)
axes[1].set_title('After')
plt.tight_layout()
plt.savefig('comparison.png', dpi=150)
```

#### Judging Feedback

**Criticism:** Good catch on the clipping issue — this is a real-world bug that would cause audible distortion. The segmental SNR observation is also valid. However, the student's SNR metric definition is flawed: it computes SNR as `10*log10(original^2 / (original - processed)^2)`, which measures how different the output is from the input — not how much noise was removed. This metric would give high "SNR" even if the processing did nothing. A proper evaluation would require a reference clean signal or at least a noise-only region comparison.

**Better Alternative:** Should have flagged that without a ground-truth clean signal, true SNR improvement cannot be measured. Should have suggested comparing noise-floor levels in known noise-only segments before and after processing.

**Grade: B**

#### Steering Feedback

**Criticism:** The clipping fix is correct and important. The SNR suggestion shows awareness that quantitative evaluation is needed, but the proposed metric is not well-defined for this scenario (no clean reference available). The student should have steered toward a noise-floor reduction measurement in identified silent/noise-only segments rather than a whole-signal SNR.

**Better Alternative:** Should have directed the AI to measure noise power in a known noise-only segment before and after processing, and report the noise reduction in dB.

**Grade: B**

---

### Cycle 3

#### Student marks: **Done**

---

## Completion

| Skill    | Grade |
| -------- | ----- |
| Framing  | B     |
| Judging  | B     |
| Steering | B     |

### Summary Feedback

The student showed moderate ability in identifying missing information during framing but failed to address the critical overlap between the 120 Hz resonance and bass instrument fundamentals until the judging phase. During judging, the student caught important implementation issues (bass damage from HPF, musical noise from binary masking, clipping risk) but missed subtler problems like the flawed SNR metric definition. Steering interventions were generally in the right direction but lacked precision — the notch filter suggestion was strong, but the quantitative evaluation guidance led to an incorrect metric. Overall, the student demonstrates awareness of DSP concepts but needs to develop more rigorous analytical habits, particularly around evaluation methodology.
