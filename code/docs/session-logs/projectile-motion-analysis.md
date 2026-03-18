# Pedagogical Session Log: Projectile Motion Analysis

**Challenge Type**: practice
**Response Mode**: Phase 1: open-ended, Phase 2: open-ended
**Max Cycles**: 5
**Date**: 2026-03-18

---

## Challenge Overview

This challenge tests the student's ability to engage in co-reasoning with an AI system across three phases: framing (problem definition), judging (critical evaluation of AI output), and steering (directing AI improvement). The "Projectile Motion Analysis" challenge focuses on Physics and requires students to demonstrate iterative practice skills in human-AI collaboration.

---

## Phase 1: Framing

### Problem Statement (LLM-Generated)

As part of a project for a local amusement park, we need you to design a new ride that involves a projectile motion component. Your task is to analyze the optimal angle and initial velocity for launching a small capsule that will follow a parabolic trajectory and land safely in a designated area. The ride should ensure that the capsule reaches a maximum height of at least 20 meters and travels a horizontal distance of 50 meters before landing. Please submit your analysis along with a detailed graph of the trajectory, including any assumptions you believe are necessary for the calculation.

**Pedagogical Note**: The problem statement is intentionally open-ended or contains ambiguities that the student must identify and address. This tests the student's ability to recognize unstated assumptions, missing constraints, and scope ambiguities before the AI generates a solution. Strong framing leads to better AI output, teaching students that the quality of AI collaboration depends on the quality of human input.

### Student Response

The problem leaves air resistance unspecified. We need to know: is this in a vacuum or with drag? What is the launch angle range? Are we solving for max range, max height, or time of flight? The coordinate system and units should be established.

**Pedagogical Note**: In open-ended mode, the student must articulate their own framing, demonstrating deeper analytical thinking. This reveals the student's ability to identify ambiguities, propose clarifying constraints, and structure the problem space independently.

### AI Solution (LLM-Generated)

To solve the problem of designing a ride that involves launching a capsule following a parabolic trajectory, we will analyze the optimal launch angle and initial velocity required to achieve a maximum height of at least 20 meters and a horizontal distance of 50 meters. 

**Assumptions:**
1. We will ignore air resistance for simplicity and assume the launch occurs in a vacuum.
2. The capsule will be launched and land at the same vertical level, simplifying our calculations. 
3. The acceleration due to gravity (g) is approximately 9.81 m/s².

**1. Maximum Height Calculation:**
The maximum height (H) of a projectile can be calculated using the formula:
\[ H = \frac{(v_0 \sin(\theta))^2}{2g} \]
where:
- \( v_0 \) is the initial launch velocity,
- \( \theta \) is the launch angle.

To achieve a maximum height of at least 20 meters:
\[ 20 = \frac{(v_0 \sin(\theta))^2}{2 \cdot 9.81} \]
Rearranging gives:
\[ v_0 \sin(\theta) = \sqrt{20 \cdot 2 \cdot 9.81} \]
\[ v_0 \sin(\theta) \approx \sqrt{392.4} \approx 19.8 \, \text{m/s} \]

**2. Horizontal Distance Calculation:**
The horizontal distance (R) traveled by a projectile is given by:
\[ R = \frac{(v_0^2 \sin(2\theta))}{g} \]
To achieve a range of 50 meters:
\[ 50 = \frac{(v_0^2 \sin(2\theta))}{9.81} \]
Rearranging gives:
\[ v_0^2 \sin(2\theta) = 50 \cdot 9.81 \]
\[ v_0^2 \sin(2\theta) \approx 490.5 \]

**3. Solving for \( v_0 \) and \( \theta \):**
We now have two equations:
1. \( v_0 \sin(\theta) \approx 19.8 \) (1)
2. \( v_0^2 \sin(2\theta) \approx 490.5 \) (2)

Using the identity \( \sin(2\theta) = 2 \sin(\theta) \cos(\theta) \), we can substitute \( \sin(2\theta) \) in equation (2):
\[ v_0^2 (2 \sin(\theta) \cos(\theta)) \approx 490.5 \]

From equation (1), we can express \( v_0 \):
\[ v_0 = \frac{19.8}{\sin(\theta)} \]

Substituting this into equation (2):
\[ \left(\frac{19.8}{\sin(\theta)}\right)^2 (2 \sin(\theta) \cos(\theta)) \approx 490.5 \]
\[ \frac{392.04 \cdot 2 \cos(\theta)}{\sin(\theta)} \approx 490.5 \]
\[ 784.08 \cos(\theta) \approx 490.5 \sin(\theta) \]

This leads us to:
\[ \tan(\theta) = \frac{784.08}{490.5} \cos(\theta) \]
This equation can be solved numerically for specific values of \( \theta \).

**4. Trajectory Graph:**
To graph the trajectory, the equations of motion can be parameterized as follows:
- Horizontal position: \( x(t) = v_0 \cos(\theta) t \)
- Vertical position: \( y(t) = v_0 \sin(\theta) t - \frac{1}{2} g t^2 \)

The time of flight (T) can be calculated using the formula:
\[ T = \frac{2v_0 \sin(\theta)}{g} \]

The trajectory can then be plotted by substituting values of \( t \) from 0 to \( T \) into the equations of motion.

**Conclusion:**
The optimal launch angle and initial velocity can be calculated through the derived equations, providing that the conditions of air resistance and the exact angle range are clarified. The solution assumes a simplified model, focusing on achieving the specified height and distance without accounting for real-world factors such as drag, which could significantly affect the performance of the ride. The detailed graph of the trajectory can be generated using a mathematical plotting tool by implementing the aforementioned equations.

**Pedagogical Note**: The AI solution is generated based on the student's framing. It intentionally may contain gaps, errors, or oversimplifications that the student must identify in the judging phase. This teaches students that AI output is only as good as the input framing and always requires critical evaluation.

### Framing Feedback (LLM-Generated)

**Feedback:**

You did well to identify that the problem lacks clarity regarding air resistance and the launch angle range. Highlighting these uncertainties shows that you are thinking critically about the parameters that could affect the projectile's motion. Additionally, your mention of establishing a coordinate system and units is a good step towards ensuring clarity in your analysis.

However, there are some areas where your framing could be improved. For instance, while you pointed out the need for clarification on whether the scenario is in a vacuum or with drag, you did not specify how these conditions would impact the projectile's trajectory. This detail is important because it directly influences the calculations and assumptions you would need to make. Furthermore, while you asked about the launch angle range, it would have been beneficial to suggest specific angles that might be relevant for maximizing the ride's performance, such as the typical angle for maximum range (45 degrees) or angles that could ensure the required height and distance.

Additionally, your framing lacks a focus on the specific objectives of the ride design. You mentioned solving for maximum range, maximum height, or time of flight, but it would be more effective to clarify which of these is the primary goal based on the requirements of the amusement park project. For example, you could emphasize that the ride must ensure the capsule reaches a height of at least 20 meters and travels a horizontal distance of 50 meters, thus framing your analysis around these specific targets.

In summary, while you identified some key gaps in the problem's framing, a stronger response would include more explicit connections between these gaps and their implications for your calculations, as well as a clearer focus on the specific objectives of the ride design.

### Framing Grade: B

---

## Phase 2: Judging (Cycle 1)

### Student's Judging Response

The solution correctly applies kinematic equations but the air resistance model is oversimplified. The numerical integration approach is appropriate but the step size choice is not justified, which could lead to significant errors at high velocities.

**Pedagogical Note**: The judging phase tests the student's ability to critically evaluate AI-generated content. Open-ended judging requires the student to independently identify strengths and weaknesses in the AI solution, demonstrating higher-order analytical thinking and domain expertise.

---

## Phase 3: Steering (Cycle 1)

### Student's Steering Response

Justify the integration step size using error analysis. Add a quadratic drag model comparison alongside the linear model. Include a sensitivity analysis showing how air resistance affects range at different launch angles.

**Pedagogical Note**: Steering tests the student's ability to provide actionable, specific feedback that can improve AI output. Open-ended steering requires the student to formulate clear, specific instructions for improving the AI output. This develops the crucial skill of communicating effectively with AI systems — being precise enough to guide improvement while avoiding over-specification.

### Updated AI Solution (LLM-Generated)

To solve the problem of designing a ride that involves launching a capsule following a parabolic trajectory, we will analyze the optimal launch angle and initial velocity required to achieve a maximum height of at least 20 meters and a horizontal distance of 50 meters, while also considering the effects of air resistance.

**Assumptions:**
1. We will consider both linear and quadratic drag models for comparison.
2. The capsule will be launched and land at the same vertical level, simplifying our calculations.
3. The acceleration due to gravity (g) is approximately 9.81 m/s².

**1. Maximum Height Calculation:**
The maximum height (H) of a projectile can be calculated using the formula:
\[ H = \frac{(v_0 \sin(\theta))^2}{2g} \]
where:
- \( v_0 \) is the initial launch velocity,
- \( \theta \) is the launch angle.

To achieve a maximum height of at least 20 meters:
\[ 20 = \frac{(v_0 \sin(\theta))^2}{2 \cdot 9.81} \]
Rearranging gives:
\[ v_0 \sin(\theta) = \sqrt{20 \cdot 2 \cdot 9.81} \]
\[ v_0 \sin(\theta) \approx \sqrt{392.4} \approx 19.8 \, \text{m/s} \]

**2. Horizontal Distance Calculation:**
The horizontal distance (R) traveled by a projectile is given by:
\[ R = \frac{(v_0^2 \sin(2\theta))}{g} \]

To achieve a range of 50 meters:
\[ 50 = \frac{(v_0^2 \sin(2\theta))}{9.81} \]
Rearranging gives:
\[ v_0^2 \sin(2\theta) = 50 \cdot 9.81 \]
\[ v_0^2 \sin(2\theta) \approx 490.5 \]

**3. Solving for \( v_0 \) and \( \theta \):**
We now have two equations:
1. \( v_0 \sin(\theta) \approx 19.8 \) (1)
2. \( v_0^2 \sin(2\theta) \approx 490.5 \) (2)

Using the identity \( \sin(2\theta) = 2 \sin(\theta) \cos(\theta) \), we can substitute \( \sin(2\theta) \) in equation (2):
\[ v_0^2 (2 \sin(\theta) \cos(\theta)) \approx 490.5 \]

From equation (1), we can express \( v_0 \):
\[ v_0 = \frac{19.8}{\sin(\theta)} \]

Substituting this into equation (2):
\[ \left(\frac{19.8}{\sin(\theta)}\right)^2 (2 \sin(\theta) \cos(\theta)) \approx 490.5 \]
\[ \frac{392.04 \cdot 2 \cos(\theta)}{\sin(\theta)} \approx 490.5 \]
\[ 784.08 \cos(\theta) \approx 490.5 \sin(\theta) \]

This leads us to:
\[ \tan(\theta) = \frac{784.08}{490.5} \cos(\theta) \]
This equation can be solved numerically for specific values of \( \theta \).

**4. Drag Models:**
In this analysis, we will consider two drag models: linear drag and quadratic drag.

- **Linear Drag Model:** 
The drag force \( F_d \) is given by:
\[ F_d = -c_d v \]
where \( c_d \) is the drag coefficient.

- **Quadratic Drag Model:** 
The drag force is given by:
\[ F_d = -c_d v^2 \]
This model is more accurate at higher velocities.

Using these models, we can adjust the equations of motion to account for the drag force affecting the horizontal and vertical positions of the capsule over time.

**5. Error Analysis and Integration Step Size:**
To justify the integration step size in numerical simulations, we can conduct an error analysis. The error can be estimated by analyzing the difference between the calculated trajectory with a small step size and a larger step size. The convergence of the results can indicate the appropriate step size, balancing computational efficiency and accuracy in obtaining trajectory data under drag conditions.

**6. Sensitivity Analysis:**
The impact of air resistance on range can vary significantly based on the launch angle. A sensitivity analysis can be performed by calculating the range for different angles while varying the drag coefficient. This will reveal how sensitive the range is to changes in both the launch angle and the type of drag model used, providing insights into the optimal launch strategy for maximizing the distance traveled.

**7. Trajectory Graph:**
To graph the trajectory, the equations of motion can be parameterized as follows:
- Horizontal position: \( x(t) = v_0 \cos(\theta) t + \text{(drag effect)} \)
- Vertical position: \( y(t) = v_0 \sin(\theta) t - \frac{1}{2} g t^2 + \text{(drag effect)} \)

The time of flight (T) can be calculated using the formula:
\[ T = \frac{2v_0 \sin(\theta)}{g} \]

The trajectory can then be plotted by substituting values of \( t \) from 0 to \( T \) into the equations of motion, adjusted for drag.

**Conclusion:**
The optimal launch angle and initial velocity can be calculated through the derived equations, with a focus on analyzing the effects of air resistance through both linear and quadratic models. The solution assumes a simplified model, but the inclusion of drag factors and sensitivity analysis offers a more comprehensive understanding of the ride's performance. The detailed graph of the trajectory can be generated using a mathematical plotting tool by implementing the aforementioned equations, providing visual insights into the capsule's motion.

**Pedagogical Note**: The updated solution reflects how the AI incorporated the student's steering feedback. Comparing the original and updated solutions helps students see the tangible impact of their guidance, reinforcing the principle that effective steering requires specificity and domain knowledge.

### Judging Feedback: **Criticism:**
The student identified the oversimplification of the air resistance model, which is a valid concern. However, they missed several critical issues present in the AI output. For instance, the student did not mention the lack of clarity regarding the initial conditions for the launch angle and velocity, which are essential for solving the equations. Additionally, the student flagged the step size choice in numerical integration without providing specific details on why this is a concern, making their analysis somewhat vague. They also did not address the potential inaccuracies in the trajectory graphing section, which is a significant aspect of the problem.

**Better alternative:**
A stronger analysis would involve a more comprehensive identification of the gaps in the AI output. For example, the student could have pointed out that the AI did not specify the method for determining the optimal launch angle and initial velocity, which is crucial for a complete solution. They could have elaborated on how the assumptions made (such as ignoring air resistance) could lead to unrealistic results in a practical scenario. Furthermore, instead of simply stating that the step size choice is not justified, the student could have discussed the implications of this choice on the accuracy of the numerical integration and suggested a more appropriate approach. Overall, a more detailed and specific analysis would enhance the quality of their judgement.
### Judging Grade: B
### Steering Feedback: **Criticism:**
1. **Specificity:** The steering commands provided by the student, such as "Justify the integration step size using error analysis," lack clarity in terms of what specific aspects of the integration step size need to be justified. A more precise command would have detailed which parameters or assumptions should be analyzed for error.
   
2. **Targeting:** While the commands addressed important aspects like drag models and sensitivity analysis, they did not prioritize the most critical remaining issues. For instance, before delving into drag models, the student should have ensured that the basic calculations for maximum height and range were correct and fully addressed.

3. **Effectiveness:** The commands did not lead to significant improvements in the AI's output. Although the AI was prompted to include drag models and sensitivity analysis, the initial equations and calculations still lacked clarity and completeness. The AI's response did not sufficiently resolve the identified issues.

4. **Progression:** The overall solution did not converge toward correctness effectively. The introduction of drag models and sensitivity analysis, while relevant, did not enhance the foundational understanding of the projectile motion problem. The essential calculations for launch angle and initial velocity remained inadequately addressed.

**Better Alternative:**
1. **More Specific Commands:** Instead of general commands, the student could have specified, "Provide a detailed derivation of the equations for maximum height and range without air resistance, then include a clear comparison of how quadratic drag affects these equations." This would have focused the AI on the core calculations first.

2. **Prioritize Critical Issues:** The student should have first ensured that the AI's initial calculations were accurate and clearly presented before introducing more complex elements like drag models. A command such as, "Verify the accuracy of the maximum height and range calculations before addressing drag effects," would have been more effective.

3. **Follow-Up on Outputs:** After each command, the student could have asked for a summary or clarification of the AI's response to ensure that the output was on the right track. For example, "Can you summarize how the drag model changes the calculated range and height?" would help maintain focus on the core objectives.

4. **Iterative Refinement:** The student could have used an iterative approach to refine the solution step by step, ensuring that each aspect of the physics problem was addressed thoroughly before moving on to more advanced topics.

**Overall Evaluation:**
The student marked the task as "done" too early, as significant foundational issues remained unresolved. A more thorough exploration of the basic projectile motion equations and their implications should have been prioritized before introducing additional complexities like drag models. The steering commands could have been more effective if they had focused on specific issues and ensured that the AI's outputs were progressively improved toward a complete and correct solution.
### Steering Grade: B

---

## Final Grades
- Framing: B
- Judging: B
- Steering: B

## Pedagogical Summary

This session log for "Projectile Motion Analysis" demonstrates the co-reasoning assessment model in action. The three-phase structure — framing, judging, and steering — maps to critical competencies for effective human-AI collaboration:

1. **Framing** (problem definition): Tests whether students can identify ambiguities and structure problems before delegating to AI. This prevents the common pitfall of accepting AI output generated from poorly specified prompts.

2. **Judging** (critical evaluation): Tests whether students can identify errors, gaps, and limitations in AI-generated content. This develops the "trust but verify" mindset essential for responsible AI use.

3. **Steering** (directed improvement): Tests whether students can provide actionable feedback to improve AI output. This develops the metacognitive skill of knowing what good output looks like and how to guide AI toward it.

The practice mode provides immediate feedback after each phase, enabling iterative learning. The open-ended/open-ended response format requires fully independent articulation of analytical reasoning.

This challenge, drawn from Physics, demonstrates that co-reasoning skills are transferable across domains — the same framing-judging-steering cycle applies whether the student is working with AI on algorithms, physics, ethics, or pedagogy.
