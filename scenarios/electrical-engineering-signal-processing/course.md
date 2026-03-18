# Course: Digital Signal Processing
**Department:** Electrical Engineering
**Institution:** Technion

---

## Subject Tree

```
Digital Signal Processing
├── Signals & Systems Fundamentals
│   ├── Continuous vs Discrete Signals
│   ├── Sampling & Aliasing
│   │   ├── Nyquist Theorem
│   │   └── Anti-aliasing Filters
│   └── Quantization
│       ├── Uniform Quantization
│       └── Non-uniform Quantization
├── Frequency Domain Analysis
│   ├── Discrete Fourier Transform (DFT)
│   │   ├── FFT Algorithms
│   │   └── Windowing
│   ├── Z-Transform
│   │   ├── Region of Convergence
│   │   └── Inverse Z-Transform
│   └── Spectral Analysis
│       ├── Power Spectral Density
│       └── Spectrogram
├── Filter Design
│   ├── FIR Filters
│   │   ├── Window Method
│   │   └── Parks-McClellan
│   ├── IIR Filters
│   │   ├── Butterworth
│   │   ├── Chebyshev
│   │   └── Bilinear Transform
│   └── Adaptive Filters
│       ├── LMS Algorithm
│       └── RLS Algorithm
├── Multi-rate Signal Processing
│   ├── Decimation
│   ├── Interpolation
│   └── Polyphase Filters
└── Applications
    ├── Audio Processing
    │   ├── Noise Reduction
    │   └── Echo Cancellation
    ├── Image Processing
    │   ├── 2D Convolution
    │   └── Edge Detection
    └── Communications
        ├── Modulation/Demodulation
        └── Channel Equalization
```

---

## Challenge Examples

### Challenge 1: Build a Real-Time Noise Gate for Live Concert Audio
**Subject:** Applications > Audio Processing > Noise Reduction
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Design and implement a noise-reduction processing chain in Python (using NumPy/SciPy) that takes a raw 16-bit WAV recording of a live jazz concert and outputs a cleaned WAV file where stage bleed and HVAC rumble are suppressed while preserving the original instrument timbres. Deliver the source code, a before/after spectrogram comparison plot, and a one-page write-up explaining your filter choices. The venue says the room "resonates around 120 Hz" and the recording was made with "standard microphones at 48 kHz."

**Framing Rubric:**

#### Criterion 1: Multiple distinct noise sources are present that require separate reduction strategies
- **Description:** Identifies when multiple distinct noise sources are present that require separate reduction strategies, rather than treating all unwanted signal content as a single noise type
- **Excellent (A):** Clearly and specifically identifies when multiple distinct noise sources are present that require separate reduction strategies, rather than treating all unwanted signal content as a single noise type
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Vague quality-preservation requirements by asking what perceptual
- **Description:** Questions vague quality-preservation requirements by asking what perceptual or quantitative metrics define acceptable output quality when no objective targets are specified
- **Excellent (A):** Clearly and specifically questions vague quality-preservation requirements by asking what perceptual or quantitative metrics define acceptable output quality when no objective targets are specified
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Ambiguous or imprecise descriptions of noise characteristics
- **Description:** Detects ambiguous or imprecise descriptions of noise characteristics (frequency content, bandwidth, temporal behavior) and articulates how that ambiguity impacts filter design decisions
- **Excellent (A):** Clearly and specifically detects ambiguous or imprecise descriptions of noise characteristics (frequency content, bandwidth, temporal behavior) and articulates how that ambiguity impacts filter design decisions
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Critical recording or signal-chain metadata is missing
- **Description:** Recognizes when critical recording or signal-chain metadata (channel count, spatial configuration, signal format) is missing and explains how its absence constrains the set of applicable noise-reduction techniques
- **Excellent (A):** Clearly and specifically recognizes when critical recording or signal-chain metadata (channel count, spatial configuration, signal format) is missing and explains how its absence constrains the set of applicable noise-reduction techniques
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Applies an overly simplistic filtering approach that fails to account for
- **Description:** Detects when the AI applies an overly simplistic filtering approach that fails to account for spectral overlap between the noise and the desired signal
- **Excellent (A):** Accurately detects when the AI applies an overly simplistic filtering approach that fails to account for spectral overlap between the noise and the desired signal and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Filter design parameters are chosen
- **Description:** Identifies when filter design parameters are chosen without justification against the actual or assumed spectral characteristics of the signal and noise
- **Excellent (A):** Accurately identifies when filter design parameters are chosen without justification against the actual or assumed spectral characteristics of the signal and noise and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Analysis outputs are generated but not interpreted — producing a visualization
- **Description:** Catches when analysis outputs are generated but not interpreted — producing a visualization or measurement without explaining what it reveals about noise-reduction effectiveness
- **Excellent (A):** Accurately catches when analysis outputs are generated but not interpreted — producing a visualization or measurement without explaining what it reveals about noise-reduction effectiveness and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Fails to consider that noise energy may coincide with important signal content
- **Description:** Recognizes when the AI fails to consider that noise energy may coincide with important signal content and does not address how to suppress noise without degrading the desired signal
- **Excellent (A):** Accurately recognizes when the AI fails to consider that noise energy may coincide with important signal content and does not address how to suppress noise without degrading the desired signal and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts guide the AI toward decomposing the noise-reduction problem into
- **Description:** Prompts guide the AI toward decomposing the noise-reduction problem into distinct sub-problems matched to the spectral and temporal characteristics of each noise source
- **Excellent (A):** Effectively addresses Prompts guide the AI toward decomposing the noise-reduction problem into distinct sub-problems matched to the spectral and temporal characteristics of each noise source with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Specify and justify concrete filter
- **Description:** Directs the AI to specify and justify concrete filter or algorithm parameters against the signal characteristics and constraints, whether given or assumed
- **Excellent (A):** Effectively directs the AI to specify and justify concrete filter or algorithm parameters against the signal characteristics and constraints, whether given or assumed with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Steers the AI toward producing all required deliverables with internal consistency
- **Description:** Steers the AI toward producing all required deliverables with internal consistency, ensuring that analysis outputs are generated from the implemented processing chain
- **Excellent (A):** Effectively addresses Steers the AI toward producing all required deliverables with internal consistency, ensuring that analysis outputs are generated from the implemented processing chain with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Pushes the AI to explicitly state
- **Description:** Pushes the AI to explicitly state and document all assumptions about missing signal or environmental information rather than silently adopting defaults
- **Excellent (A):** Effectively addresses Pushes the AI to explicitly state and document all assumptions about missing signal or environmental information rather than silently adopting defaults with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 2: Design a Multi-Rate Audio Codec Prototype
**Subject:** Multi-rate Signal Processing > Decimation, Interpolation
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Build a MATLAB or Python prototype of a sample-rate conversion module that takes a 96 kHz / 24-bit studio master track and produces three output files: a "high" stream, a "standard" stream, and a "low" stream suitable for mobile playback over limited bandwidth. Deliver the conversion code, a table comparing THD+N and SNR measurements for each output quality tier, and a block diagram of your signal processing pipeline. The product manager says "just make sure it sounds good" and that the low tier should "use as little bandwidth as possible."

**Framing Rubric:**

#### Criterion 1: Output specifications are given as qualitative labels
- **Description:** Identifies when output specifications are given as qualitative labels rather than engineering parameters, and recognizes that the student must propose concrete sample rates, bit depths, or ratios and justify them
- **Excellent (A):** Clearly and specifically identifies when output specifications are given as qualitative labels rather than engineering parameters, and recognizes that the student must propose concrete sample rates, bit depths, or ratios and justify them
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Vague quality requirements by asking what objective metric
- **Description:** Questions vague quality requirements by asking what objective metric or perceptual evaluation framework defines acceptable output when no quantitative target is provided
- **Excellent (A):** Clearly and specifically questions vague quality requirements by asking what objective metric or perceptual evaluation framework defines acceptable output when no quantitative target is provided
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Required rate-conversion ratios are non-integer
- **Description:** Detects when the required rate-conversion ratios are non-integer, recognizing that this fundamentally changes the applicable multi-rate processing architecture
- **Excellent (A):** Clearly and specifically detects when the required rate-conversion ratios are non-integer, recognizing that this fundamentally changes the applicable multi-rate processing architecture
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Competing constraints create an inherent trade-off that requires the student to
- **Description:** Recognizes when competing constraints (e.g., minimizing resource usage while maintaining quality) create an inherent trade-off that requires the student to define an explicit quality floor or operating point
- **Excellent (A):** Clearly and specifically recognizes when competing constraints (e.g., minimizing resource usage while maintaining quality) create an inherent trade-off that requires the student to define an explicit quality floor or operating point
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Performs sample-rate conversion
- **Description:** Detects when the AI performs sample-rate conversion without proper anti-aliasing or anti-imaging filtering, introducing aliasing or imaging artifacts into the output
- **Excellent (A):** Accurately detects when the AI performs sample-rate conversion without proper anti-aliasing or anti-imaging filtering, introducing aliasing or imaging artifacts into the output and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Neglects quantization effects during bit-depth
- **Description:** Identifies when the AI neglects quantization effects during bit-depth or word-length changes, omitting necessary dither, noise shaping, or error analysis
- **Excellent (A):** Accurately identifies when the AI neglects quantization effects during bit-depth or word-length changes, omitting necessary dither, noise shaping, or error analysis and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Signal-quality measurements are computed with incorrect methodology
- **Description:** Catches when signal-quality measurements are computed with incorrect methodology, such as wrong reference levels, inappropriate measurement bandwidths, or missing noise contributions
- **Excellent (A):** Accurately catches when signal-quality measurements are computed with incorrect methodology, such as wrong reference levels, inappropriate measurement bandwidths, or missing noise contributions and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: System block diagram or architecture description omits critical processing
- **Description:** Recognizes when a system block diagram or architecture description omits critical processing stages required by multi-rate signal processing theory
- **Excellent (A):** Accurately recognizes when a system block diagram or architecture description omits critical processing stages required by multi-rate signal processing theory and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts push the AI to commit to specific
- **Description:** Prompts push the AI to commit to specific, justified numerical parameters for each processing stage rather than leaving design choices vague or unsubstantiated
- **Excellent (A):** Effectively addresses Prompts push the AI to commit to specific, justified numerical parameters for each processing stage rather than leaving design choices vague or unsubstantiated with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Toward architecturally correct multi-rate implementations when the conversion
- **Description:** Guides the AI toward architecturally correct multi-rate implementations (polyphase, cascade, or equivalent) when the conversion ratios demand them, rather than using approximate or naive methods
- **Excellent (A):** Effectively guides the AI toward architecturally correct multi-rate implementations (polyphase, cascade, or equivalent) when the conversion ratios demand them, rather than using approximate or naive methods with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Account for quantization
- **Description:** Directs the AI to account for quantization and word-length effects at each stage of the processing chain, including their impact on measured output quality
- **Excellent (A):** Effectively directs the AI to account for quantization and word-length effects at each stage of the processing chain, including their impact on measured output quality with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Steers toward producing all required deliverables with internal consistency —
- **Description:** Steers toward producing all required deliverables with internal consistency — measurements derived from the implemented code, and diagrams that accurately reflect the implemented architecture
- **Excellent (A):** Effectively addresses Steers toward producing all required deliverables with internal consistency — measurements derived from the implemented code, and diagrams that accurately reflect the implemented architecture with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 3: Build a Bearing-Fault Detector from Accelerometer Data
**Subject:** Frequency Domain Analysis > Spectral Analysis > Power Spectral Density
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Write a Python script that reads a CSV file of accelerometer vibration data sampled from an industrial pump, computes the power spectral density, and outputs a diagnostic report classifying the machine state as "healthy," "watch," or "alarm." Deliver the script, a PSD plot with annotated fault frequencies, and a decision-logic flowchart. The maintenance engineer says the pump runs "at about 1,800 RPM" and that bearings "usually fail first." The CSV has a single column of acceleration values with no header.

**Framing Rubric:**

#### Criterion 1: Critical signal metadata is missing from the input data
- **Description:** Identifies when critical signal metadata (sample rate, units, duration, time base) is missing from the input data, making spectral computations impossible without explicit assumptions
- **Excellent (A):** Clearly and specifically identifies when critical signal metadata (sample rate, units, duration, time base) is missing from the input data, making spectral computations impossible without explicit assumptions
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Imprecise physical or operational parameters by recognizing that small
- **Description:** Questions imprecise physical or operational parameters by recognizing that small uncertainties in system operating conditions propagate into significant shifts in expected spectral features
- **Excellent (A):** Clearly and specifically questions imprecise physical or operational parameters by recognizing that small uncertainties in system operating conditions propagate into significant shifts in expected spectral features
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Classification or diagnostic categories are provided
- **Description:** Detects when classification or diagnostic categories are provided without defined thresholds, baseline references, or labeled examples, requiring the student to propose and defend a decision strategy
- **Excellent (A):** Clearly and specifically detects when classification or diagnostic categories are provided without defined thresholds, baseline references, or labeled examples, requiring the student to propose and defend a decision strategy
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Domain-specific physical parameters needed to compute expected spectral
- **Description:** Recognizes when domain-specific physical parameters needed to compute expected spectral signatures are left unspecified, and identifies what information would be required to resolve the gap
- **Excellent (A):** Clearly and specifically recognizes when domain-specific physical parameters needed to compute expected spectral signatures are left unspecified, and identifies what information would be required to resolve the gap
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Computes a raw FFT and labels peaks
- **Description:** Detects when the AI computes a raw FFT and labels peaks without applying proper PSD estimation techniques (appropriate windowing, segment averaging, correct spectral scaling)
- **Excellent (A):** Accurately detects when the AI computes a raw FFT and labels peaks without applying proper PSD estimation techniques (appropriate windowing, segment averaging, correct spectral scaling) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Uses generic or arbitrary frequency bands for spectral feature identification
- **Description:** Identifies when the AI uses generic or arbitrary frequency bands for spectral feature identification rather than deriving expected frequencies from the physical parameters of the system
- **Excellent (A):** Accurately identifies when the AI uses generic or arbitrary frequency bands for spectral feature identification rather than deriving expected frequencies from the physical parameters of the system and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Classification or diagnostic thresholds are hardcoded
- **Description:** Catches when classification or diagnostic thresholds are hardcoded without justification, sensitivity analysis, or discussion of the trade-off between false alarms and missed detections
- **Excellent (A):** Accurately catches when classification or diagnostic thresholds are hardcoded without justification, sensitivity analysis, or discussion of the trade-off between false alarms and missed detections and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Neglects fundamental spectral-analysis trade-offs such as frequency resolution
- **Description:** Recognizes when the AI neglects fundamental spectral-analysis trade-offs such as frequency resolution versus variance, spectral leakage, or the effect of window and segment-length selection
- **Excellent (A):** Accurately recognizes when the AI neglects fundamental spectral-analysis trade-offs such as frequency resolution versus variance, spectral leakage, or the effect of window and segment-length selection and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts direct the AI to explicitly state all assumed signal
- **Description:** Prompts direct the AI to explicitly state all assumed signal and system parameters and to make those assumptions configurable rather than buried in the implementation
- **Excellent (A):** Effectively addresses Prompts direct the AI to explicitly state all assumed signal and system parameters and to make those assumptions configurable rather than buried in the implementation with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Toward statistically robust PSD estimation methods with justified choices for window type
- **Description:** Guides the AI toward statistically robust PSD estimation methods with justified choices for window type, segment length, and overlap
- **Excellent (A):** Effectively guides the AI toward statistically robust PSD estimation methods with justified choices for window type, segment length, and overlap with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Steers the AI toward identifying
- **Description:** Steers the AI toward identifying and annotating physically meaningful spectral features on the PSD output, even when underlying system parameters must be assumed
- **Excellent (A):** Effectively addresses Steers the AI toward identifying and annotating physically meaningful spectral features on the PSD output, even when underlying system parameters must be assumed with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Pushes the AI to define diagnostic
- **Description:** Pushes the AI to define diagnostic or classification logic as an explicit, documented decision procedure with threshold values tied to quantitative spectral features
- **Excellent (A):** Effectively addresses Pushes the AI to define diagnostic or classification logic as an explicit, documented decision procedure with threshold values tied to quantitative spectral features with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 4: Implement an Acoustic Echo Canceller for a Speakerphone
**Subject:** Filter Design > Adaptive Filters > LMS Algorithm
**Type:** Assessment

**Raw Problem (intentionally ill-defined):**
> Implement an adaptive echo canceller in Python that processes two WAV files — a far-end reference signal and a near-end microphone recording containing echo — and outputs a cleaned near-end WAV file with the echo removed. Deliver the source code, a convergence plot showing the filter error over time, and a brief technical memo comparing your results under single-talk and double-talk conditions. The hardware team says the echo path is "a couple hundred milliseconds" and the system runs at 16 kHz sample rate.

**Framing Rubric:**

#### Criterion 1: Imprecise system timing
- **Description:** Identifies when imprecise system timing or delay estimates lead to large uncertainty in adaptive filter dimensioning, and explains how that uncertainty affects convergence behavior and computational cost
- **Excellent (A):** Clearly and specifically identifies when imprecise system timing or delay estimates lead to large uncertainty in adaptive filter dimensioning, and explains how that uncertainty affects convergence behavior and computational cost
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Auxiliary detection or control mechanisms are required as separate modules or
- **Description:** Questions whether auxiliary detection or control mechanisms (e.g., double-talk detection, voice activity detection) are required as separate modules or whether the adaptive algorithm itself must handle those scenarios
- **Excellent (A):** Clearly and specifically questions whether auxiliary detection or control mechanisms (e.g., double-talk detection, voice activity detection) are required as separate modules or whether the adaptive algorithm itself must handle those scenarios
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Critical channel or environment characteristics are unspecified
- **Description:** Detects when critical channel or environment characteristics (linearity, time-variance, noise floor, interference statistics) are unspecified, and explains how each missing parameter affects algorithm selection and tuning
- **Excellent (A):** Clearly and specifically detects when critical channel or environment characteristics (linearity, time-variance, noise floor, interference statistics) are unspecified, and explains how each missing parameter affects algorithm selection and tuning
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Ambiguity between offline
- **Description:** Recognizes ambiguity between offline and real-time processing contexts, and identifies how that ambiguity impacts architectural choices such as block size, latency constraints, and causality requirements
- **Excellent (A):** Clearly and specifically recognizes ambiguity between offline and real-time processing contexts, and identifies how that ambiguity impacts architectural choices such as block size, latency constraints, and causality requirements
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Selects adaptive filter parameters
- **Description:** Detects when the AI selects adaptive filter parameters (step size, regularization, forgetting factor) without analyzing the trade-off between convergence speed and steady-state misadjustment, or when chosen values violate known stability bounds
- **Excellent (A):** Accurately detects when the AI selects adaptive filter parameters (step size, regularization, forgetting factor) without analyzing the trade-off between convergence speed and steady-state misadjustment, or when chosen values violate known stability bounds and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Omits analysis of a required operating condition
- **Description:** Identifies when the AI omits analysis of a required operating condition or scenario that is explicitly called for in the deliverables
- **Excellent (A):** Accurately identifies when the AI omits analysis of a required operating condition or scenario that is explicitly called for in the deliverables and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Convergence or performance plots are generated
- **Description:** Catches when convergence or performance plots are generated without meaningful quantitative interpretation — reporting visual output without extracting key metrics such as convergence time, steady-state error, or tracking behavior
- **Excellent (A):** Accurately catches when convergence or performance plots are generated without meaningful quantitative interpretation — reporting visual output without extracting key metrics such as convergence time, steady-state error, or tracking behavior and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Adaptive filter order
- **Description:** Recognizes when the adaptive filter order or structure is chosen without relating it to the physical system characteristics it must model, leading to under- or over-parameterization
- **Excellent (A):** Accurately recognizes when the adaptive filter order or structure is chosen without relating it to the physical system characteristics it must model, leading to under- or over-parameterization and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts guide the AI to derive filter dimensioning from physical system parameters
- **Description:** Prompts guide the AI to derive filter dimensioning from physical system parameters and sample rate, and to discuss the trade-off between model capacity and convergence speed
- **Excellent (A):** Effectively addresses Prompts guide the AI to derive filter dimensioning from physical system parameters and sample rate, and to discuss the trade-off between model capacity and convergence speed with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Consider and compare algorithmic variants with explicit reasoning about why one
- **Description:** Directs the AI to consider and compare algorithmic variants (e.g., normalized vs. unnormalized, variable step-size schemes) with explicit reasoning about why one suits the problem conditions better
- **Excellent (A):** Effectively directs the AI to consider and compare algorithmic variants (e.g., normalized vs. unnormalized, variable step-size schemes) with explicit reasoning about why one suits the problem conditions better with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Steers the AI toward generating quantitative performance comparisons across
- **Description:** Steers the AI toward generating quantitative performance comparisons across different operating conditions from the implemented code, not from theoretical discussion alone
- **Excellent (A):** Effectively addresses Steers the AI toward generating quantitative performance comparisons across different operating conditions from the implemented code, not from theoretical discussion alone with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Pushes the AI to address the algorithm's tracking
- **Description:** Pushes the AI to address the algorithm's tracking and re-convergence behavior under time-varying conditions, and to evaluate whether the chosen parameters support adequate adaptation speed
- **Excellent (A):** Effectively addresses Pushes the AI to address the algorithm's tracking and re-convergence behavior under time-varying conditions, and to evaluate whether the chosen parameters support adequate adaptation speed with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect


---

### Challenge 5: Design an FPGA-Targeted Edge Detection Pipeline for Drone Video
**Subject:** Applications > Image Processing > Edge Detection
**Type:** Practice

**Raw Problem (intentionally ill-defined):**
> Design a 2D convolution-based edge detection pipeline for a drone camera feed and deliver a Python simulation that processes a set of sample frames (1280x720, 30 fps) and outputs edge-detected images suitable for downstream obstacle avoidance. Deliver the simulation code, a resource-usage estimate table (multiplications per frame, memory footprint, estimated latency), and a one-page design document explaining how the pipeline would map to an FPGA. The flight controller team says they need "edges of obstacles, not background clutter" and that the processing must "fit on our current FPGA" without specifying which FPGA.

**Framing Rubric:**

#### Criterion 1: Problem requires distinguishing semantically meaningful image features from
- **Description:** Identifies when the problem requires distinguishing semantically meaningful image features from irrelevant texture or noise responses, but no formal definition, labeled data, or threshold criteria are provided for that distinction
- **Excellent (A):** Clearly and specifically identifies when the problem requires distinguishing semantically meaningful image features from irrelevant texture or noise responses, but no formal definition, labeled data, or threshold criteria are provided for that distinction
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 2: Hardware or platform constraints are referenced but not specified
- **Description:** Detects when hardware or platform constraints are referenced but not specified, making resource-usage or feasibility estimates impossible without assumptions the student must state and justify
- **Excellent (A):** Clearly and specifically detects when hardware or platform constraints are referenced but not specified, making resource-usage or feasibility estimates impossible without assumptions the student must state and justify
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 3: Throughput requirements impose hard latency
- **Description:** Recognizes when throughput requirements (frame rate, resolution) impose hard latency or computational budgets, and questions whether architectural strategies like pipelining or parallelism are permitted or required
- **Excellent (A):** Clearly and specifically recognizes when throughput requirements (frame rate, resolution) impose hard latency or computational budgets, and questions whether architectural strategies like pipelining or parallelism are permitted or required
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value

#### Criterion 4: Domain-specific image degradation factors that are unmentioned in the problem
- **Description:** Identifies domain-specific image degradation factors (motion blur, illumination variation, scale changes, noise) that are unmentioned in the problem but directly affect algorithm parameter selection and robustness
- **Excellent (A):** Clearly and specifically identifies domain-specific image degradation factors (motion blur, illumination variation, scale changes, noise) that are unmentioned in the problem but directly affect algorithm parameter selection and robustness
- **Unsatisfactory (C):** Overlooks this issue entirely and accepts the problem formulation at face value


**Judging Rubric:**

#### Criterion 1: Selects an image-processing operator
- **Description:** Detects when the AI selects an image-processing operator or kernel without justifying its suitability for the stated detection objective, or without discussing its computational cost relative to the target platform
- **Excellent (A):** Accurately detects when the AI selects an image-processing operator or kernel without justifying its suitability for the stated detection objective, or without discussing its computational cost relative to the target platform and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 2: Resource-usage or performance estimates are asserted from general knowledge
- **Description:** Identifies when resource-usage or performance estimates are asserted from general knowledge rather than derived analytically from the actual pipeline parameters (kernel dimensions, image size, bit width, number of stages)
- **Excellent (A):** Accurately identifies when resource-usage or performance estimates are asserted from general knowledge rather than derived analytically from the actual pipeline parameters (kernel dimensions, image size, bit width, number of stages) and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 3: Produces results that fail to address a stated selectivity
- **Description:** Catches when the AI produces results that fail to address a stated selectivity or discrimination requirement, generating outputs that respond indiscriminately to all features rather than the targeted class
- **Excellent (A):** Accurately catches when the AI produces results that fail to address a stated selectivity or discrimination requirement, generating outputs that respond indiscriminately to all features rather than the targeted class and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination

#### Criterion 4: Hardware-mapping or implementation discussions remain superficial
- **Description:** Recognizes when hardware-mapping or implementation discussions remain superficial, referencing architectural concepts without computing the specific resource counts, buffer depths, or timing constraints they imply
- **Excellent (A):** Accurately recognizes when hardware-mapping or implementation discussions remain superficial, referencing architectural concepts without computing the specific resource counts, buffer depths, or timing constraints they imply and explains why it matters
- **Unsatisfactory (C):** Misses this issue in the AI output and accepts the response without critical examination


**Steering Rubric:**

#### Criterion 1: Prompts guide the AI to select
- **Description:** Prompts guide the AI to select and justify specific operators, parameters, and post-processing stages with explicit reasoning about how each choice serves the stated detection or classification objective
- **Excellent (A):** Effectively addresses Prompts guide the AI to select and justify specific operators, parameters, and post-processing stages with explicit reasoning about how each choice serves the stated detection or classification objective with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 2: Compute resource and performance estimates analytically from the pipeline
- **Description:** Directs the AI to compute resource and performance estimates analytically from the pipeline design parameters rather than asserting approximate values
- **Excellent (A):** Effectively directs the AI to compute resource and performance estimates analytically from the pipeline design parameters rather than asserting approximate values with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 3: Steers the AI toward addressing at least one real-world robustness concern with
- **Description:** Steers the AI toward addressing at least one real-world robustness concern (illumination, noise, motion, scale) with a concrete mitigation strategy rather than ignoring non-ideal conditions
- **Excellent (A):** Effectively addresses Steers the AI toward addressing at least one real-world robustness concern (illumination, noise, motion, scale) with a concrete mitigation strategy rather than ignoring non-ideal conditions with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

#### Criterion 4: Pushes the AI to adopt a specific platform
- **Description:** Pushes the AI to adopt a specific platform or device assumption so that resource estimates can be evaluated against a concrete feasibility baseline, and to flag that assumption for validation
- **Excellent (A):** Effectively addresses Pushes the AI to adopt a specific platform or device assumption so that resource estimates can be evaluated against a concrete feasibility baseline, and to flag that assumption for validation with precision and clarity
- **Unsatisfactory (C):** Issues only vague or generic follow-up prompts that do not address this specific aspect

