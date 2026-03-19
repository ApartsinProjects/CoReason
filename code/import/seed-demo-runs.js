'use strict';

/**
 * Seed script: populate demo students with completed challenge runs
 * so that analytics pages show meaningful data.
 *
 * Idempotent: skips users who already have completed runs.
 *
 * Usage:  cd code && node import/seed-demo-runs.js
 */

const path = require('path');
const { v4: uuidv4 } = require('uuid');

const knexConfig = require(path.resolve(__dirname, '../server/db/knexfile'));
const knex = require('knex')(knexConfig);

// Demo student emails (non-test accounts)
const DEMO_STUDENT_EMAILS = [
  // English-only students
  'noa.cohen@tau.ac.il',
  'ahmed.hassan@tau.ac.il',
  'maria.garcia@mit.edu',
  'li.wei@tsinghua.edu.cn',
  'sarah.miller@oxford.ac.uk',
  // Hebrew-only students
  'noa.cohen.he@tau.ac.il',
  'yael.katz@tau.ac.il',
  'dan.mor@technion.ac.il',
  // Mixed-language student (English + Hebrew courses)
  'tomer.bar@tau.ac.il',
];

// ---------------------------------------------------------------------------
// Realistic content library — replaces placeholder strings
// ---------------------------------------------------------------------------
const CONTENT_LIBRARY = {

  // --- FRAMING RESPONSES (what students write when refining a problem) ---
  framingResponses: [
    // Thorough / A-level
    `## Assumptions
- The system will serve approximately 500–2,000 concurrent users during peak hours.
- Users are non-technical stakeholders who need a simple, intuitive interface.
- The existing database schema cannot be modified; we must work with the current structure.
- Budget is limited to open-source tools and existing cloud infrastructure.

## Constraints
- Response time must remain under 200ms for all primary queries.
- The solution must comply with GDPR data-handling requirements.
- Deployment must be achievable within a two-week sprint cycle.

## Evaluation Criteria
- Correctness of data transformations across all edge cases.
- Maintainability of the codebase by a small team (2-3 developers).
- Clear documentation for future onboarding.`,

    // Thorough / A-level (different domain)
    `## Assumptions
- The dataset contains at most 10 million records with possible null values in non-key columns.
- The client's primary concern is identifying quarterly revenue trends, not real-time monitoring.
- Historical data going back five years is available in CSV format.

## Constraints
- Visualizations must be accessible (WCAG 2.1 AA) and color-blind friendly.
- The analysis pipeline should run on a single machine with 16 GB RAM.
- Results need to be reproducible — all random seeds and library versions must be pinned.

## Missing Details Addressed
- The problem does not specify the target audience for the report; I assume it is C-level executives who need high-level summaries with drill-down capability.
- Currency normalization is not mentioned; I will assume all figures are in USD.`,

    // Solid / B-level
    `## Assumptions
- Users will access the application primarily via modern web browsers (Chrome, Firefox, Safari).
- The team has experience with Python and JavaScript but not with Go or Rust.
- The API will need to handle authentication via OAuth 2.0.

## Constraints
- The solution should be deployable using Docker containers.
- Total development time should not exceed three weeks.

## Evaluation Criteria
- The system should handle basic error cases gracefully.`,

    // Solid / B-level (different angle)
    `## Assumptions
- The input data is structured as a relational database with normalized tables.
- We are targeting a North American user base with English-language content.
- Third-party API rate limits are 100 requests per minute.

## Constraints
- Memory usage should stay under 4 GB during processing.
- The output format must be JSON for downstream system compatibility.

## Gaps Identified
- The problem does not clarify whether real-time processing is needed or batch processing is acceptable. I will assume batch processing with nightly updates is sufficient.`,

    // Average / C-level
    `## Assumptions
- Standard hardware and software environment.
- Users know how to use the basic features.

## Constraints
- Should work correctly most of the time.
- Needs to be done relatively quickly.`,

    // Below average / C-level
    `## Assumptions
- The data is clean and ready to use.
- No special security requirements.

## Constraints
- It should be efficient.
- The UI should look good.

## Evaluation Criteria
- It works as expected.`,

    // Shallow / D-level
    `I think we need to make sure the system works properly and handles the main cases. The users should be able to use it without too much difficulty. We should probably use a database.`,

    // Decent effort / B-level
    `## Assumptions
- The optimization problem involves a finite set of discrete choices, making it suitable for dynamic programming or greedy approaches.
- Input sizes are moderate (N < 10,000), so O(N log N) algorithms are acceptable.
- Edge cases include empty inputs, single-element inputs, and inputs where all elements are identical.

## Constraints
- Solution must pass within a 2-second time limit per test case.
- Memory usage must not exceed 256 MB.
- No external libraries are allowed; only standard library functions.

## Evaluation Criteria
- Correctness on all provided test cases and reasonable edge cases.
- Time complexity should be optimal or near-optimal for the problem class.
- Code readability and clear variable naming.`,
  ],

  // --- FRAMING FEEDBACK (evaluator responses with criticism + better_alternative) ---
  framingFeedback: [
    {
      criticism: 'You identified several relevant assumptions about the user base and infrastructure, which demonstrates good awareness of the problem context. However, your constraints section lacks quantitative specifics — saying "should be efficient" does not give an AI enough guidance. You also missed an important gap: the problem never specified error-handling requirements, and your framing does not address what happens when invalid input is received.',
      better_alternative: 'A stronger framing would specify measurable performance targets (e.g., "95th-percentile latency under 300ms"), explicitly address the missing error-handling requirements, and include acceptance criteria that distinguish a correct solution from a merely functional one.',
    },
    {
      criticism: 'Your assumptions section is well-structured and addresses the data format and user expectations effectively. The constraint about GDPR compliance is an excellent catch that many students miss. However, you did not address the ambiguity around the deployment environment — the problem does not specify whether this is cloud-hosted or on-premises, and this significantly affects the solution architecture.',
      better_alternative: 'A stronger response would explicitly resolve the deployment ambiguity, add constraints around monitoring and logging (implied by the production context), and specify what "success" looks like beyond just functional correctness — for example, uptime SLAs or data freshness guarantees.',
    },
    {
      criticism: 'You correctly identified that the target audience was unspecified, which is a key gap in the original problem. However, your assumptions are somewhat superficial — stating that "the data is clean" is risky because real-world data almost never is. You should have specified how to handle missing values, duplicates, or inconsistent formats.',
      better_alternative: 'A more thorough framing would include data quality assumptions with fallback strategies (e.g., "if null values exceed 5% in a column, flag for manual review"), specify the expected output format with examples, and define boundary conditions for edge cases.',
    },
    {
      criticism: 'The response is too vague to be actionable. Phrases like "should work correctly" and "needs to be done quickly" do not constrain the problem meaningfully. An AI generating a solution from this framing would have almost as much ambiguity as the original problem. You have not identified any of the deliberate gaps in the problem statement.',
      better_alternative: 'Even a basic framing should quantify expectations: how many users, what response time, what data volume. It should also explicitly call out at least two pieces of missing information from the original problem and state how you would resolve them.',
    },
    {
      criticism: 'Good job identifying the time complexity requirements and edge cases — this shows strong algorithmic thinking. Your constraint about standard library usage is practical and relevant. One area for improvement: you did not address how the solution should handle malformed input or whether it should fail gracefully versus assert preconditions.',
      better_alternative: 'A top-level framing would also specify the expected input/output format precisely, mention whether partial credit applies for approximate solutions, and consider whether the problem has sub-problems that could be tested independently.',
    },
    {
      criticism: 'You made reasonable assumptions about the technology stack and team capabilities, which grounds the framing in reality. However, the evaluation criteria section is underdeveloped — "handles basic error cases" is a start but does not specify which error cases matter most. The problem hints at integration with external services, which you did not address.',
      better_alternative: 'A stronger framing would enumerate the critical error scenarios (network timeouts, malformed API responses, concurrent access conflicts), define fallback behaviors for each, and explicitly address the external service integration that the problem implies.',
    },
    {
      criticism: 'Your response reads more like a general plan than a proper problem framing. You did not separate assumptions from constraints, and you did not identify any specific ambiguities in the original problem. The framing should transform the ill-defined problem into something precise enough for an AI to produce a correct solution.',
      better_alternative: 'Structure your response with clear sections: Assumptions (what you are taking as given), Constraints (non-negotiable boundaries), and Clarifications (gaps you are filling in). Each point should be specific and measurable where possible.',
    },
    {
      criticism: 'Solid effort on the accessibility and reproducibility constraints — these are often overlooked. Your assumption about CSV format and single-machine processing is practical. However, you did not address what the output deliverable should look like. Should the AI produce a report, a dashboard, raw data, or a combination?',
      better_alternative: 'A more complete framing would specify the exact deliverables (e.g., "a 5-page PDF report with three key visualizations and an executive summary"), define the analysis methodology preferences, and clarify how the results will be validated against ground truth.',
    },
  ],

  // --- AI SOLUTIONS (generated by the AI based on framed problems) ---
  aiSolutions: [
    // Software engineering domain
    `To address the requirements, I propose a three-tier REST API architecture using Node.js with Express for the backend, PostgreSQL for persistence, and React for the frontend dashboard.

The API layer exposes five endpoints: GET /items (paginated listing), POST /items (creation with validation), GET /items/:id (detail view), PUT /items/:id (update), and DELETE /items/:id (soft delete). Input validation uses Joi schemas to enforce required fields and data types. Authentication is handled via JWT tokens with a 1-hour expiry and refresh token rotation.

For the database layer, I use two primary tables with a junction table for the many-to-many relationship. Indexes are added on frequently queried columns (status, created_at, owner_id). Connection pooling is configured with a maximum of 20 connections.

Error handling follows a centralized middleware pattern that catches all unhandled exceptions, logs them with structured metadata, and returns standardized error responses with appropriate HTTP status codes.`,

    // Data analysis domain
    `The analysis pipeline processes the sales dataset in four stages: ingestion, cleaning, transformation, and visualization.

Stage 1 (Ingestion): Read CSV files using pandas with explicit dtype specifications to prevent silent type coercion. Files are validated against an expected schema before processing.

Stage 2 (Cleaning): Handle missing values by forward-filling time-series gaps and flagging records with more than 30% null fields for manual review. Remove exact duplicates and log approximate duplicates (Levenshtein distance < 3 on name fields) for analyst review.

Stage 3 (Transformation): Aggregate daily transactions to weekly and monthly summaries. Compute year-over-year growth rates, rolling 12-week averages, and seasonal decomposition using STL. All monetary values are normalized to USD using historical exchange rates from the ECB API.

Stage 4 (Visualization): Generate a 4-panel dashboard with quarterly revenue trends, top-10 product categories by growth rate, regional heat map, and a forecast confidence interval chart. All charts use a color-blind-friendly palette (Okabe-Ito).`,

    // Business/optimization domain
    `The resource allocation solution uses a weighted scoring model combined with linear programming to optimize team assignments across projects.

First, I build a skills-requirements matrix by mapping each team member's competencies (rated 1-5) against each project's skill requirements. The compatibility score for each assignment is the dot product of the member's skill vector and the project's requirement vector, normalized by the project's priority weight.

The optimization model maximizes total weighted compatibility subject to constraints: each person is assigned to exactly one project, each project has between 2 and 5 members, and at least one senior member (experience > 5 years) is on every project. I solve this using the PuLP library's CBC solver.

The output is a recommended assignment table with compatibility scores, a risk assessment highlighting projects where the best available team still has skill gaps above 20%, and three alternative allocations ranked by total score for stakeholder discussion.`,

    // Algorithm/CS domain
    `The solution implements a modified Dijkstra's algorithm with A* heuristic for the shortest path problem on the weighted directed graph.

Data structures: The graph is stored as an adjacency list using a dictionary of dictionaries for O(1) edge lookup. The priority queue uses a binary heap implementation with decrease-key support via lazy deletion.

Algorithm: Starting from the source node, we maintain a distance array initialized to infinity and a visited set. At each step, we extract the minimum-distance unvisited node, relax all outgoing edges, and update the priority queue. The A* heuristic uses Euclidean distance to the target when coordinates are available, falling back to standard Dijkstra when they are not.

Edge cases handled: disconnected graphs (return -1), negative edge weights (detect and raise an error since Dijkstra requires non-negative weights), self-loops (ignored), and parallel edges (keep the minimum weight). Time complexity is O((V + E) log V) with the binary heap.`,

    // Systems design domain
    `The caching layer sits between the application servers and the primary database, reducing read latency and database load.

Architecture: A two-level cache using an in-process LRU cache (capacity: 1,000 entries, TTL: 60 seconds) backed by a shared Redis cluster (3 nodes, TTL: 5 minutes). Cache keys follow the pattern "entity:type:id:version" to support cache invalidation on writes.

Write path: On any write operation, the application updates the database first (source of truth), then invalidates the corresponding cache entries in both layers. For high-write entities, we use write-behind caching with a 500ms coalescing window to batch database writes.

Read path: Check L1 (in-process) first, then L2 (Redis), then database. Cache misses trigger asynchronous population of both cache layers. A circuit breaker protects against Redis failures — if Redis is unavailable for more than 3 consecutive requests, the application falls back to database-only mode for 30 seconds before retrying.`,
  ],

  // --- JUDGING RESPONSES (student evaluations of AI solutions) ---
  judgingResponses: [
    // Thorough / A-level
    `The solution correctly implements the core API endpoints and follows RESTful conventions. However, I identified several issues:

1. **Missing rate limiting** — The API has no rate limiting or throttling, which exposes it to denial-of-service attacks and could overwhelm the database connection pool.

2. **No input sanitization beyond validation** — Joi validation checks data types but does not sanitize against SQL injection or XSS in text fields. The solution should use parameterized queries (which it might via an ORM, but this is not specified).

3. **Soft delete without cleanup** — Soft-deleted records will accumulate indefinitely. There is no mention of a cleanup job or archival strategy, which will degrade query performance over time.

4. **JWT refresh token storage** — The solution does not specify where refresh tokens are stored. If they are in localStorage, this is a security vulnerability. They should be in httpOnly cookies.

5. **Connection pool size** — 20 max connections may be insufficient during peak load if the stated 500-2000 concurrent users figure is accurate, depending on query complexity.`,

    // Thorough / A-level (different domain)
    `The data analysis pipeline is well-structured and covers the key stages. However, there are gaps:

1. **Forward-filling time-series gaps is risky** — If there is a prolonged data outage (e.g., a week of missing data), forward-filling will propagate stale values and distort trend analysis. The solution should detect gap duration and use interpolation or flagging instead.

2. **ECB exchange rate API dependency** — The pipeline relies on an external API for currency conversion. If this API is unavailable, the pipeline will fail. There is no fallback or caching strategy for exchange rates.

3. **STL seasonal decomposition assumes regular periodicity** — If the data has irregular seasonal patterns or structural breaks (e.g., COVID-era shifts), STL may produce misleading decompositions without parameter tuning.

4. **No validation step** — The pipeline does not include a validation stage to verify that transformations preserved data integrity (e.g., row counts, sum checks before and after aggregation).`,

    // Solid / B-level
    `The solution addresses the main requirements but has some issues:

1. **The optimization model does not account for team member preferences** — Forcing people onto projects they dislike will affect morale and retention, even if the skill match is optimal on paper.

2. **The constraint "at least one senior member per project" may be infeasible** — If there are more projects than senior members, the model will have no solution. The solution should handle this gracefully with a relaxation strategy.

3. **No mention of how to handle ties** — When multiple allocations have similar scores, the solution picks arbitrarily. It would be better to use secondary criteria like team diversity or geographic proximity.`,

    // Average / C-level
    `The solution looks mostly correct. The algorithm choice seems appropriate for the problem. I noticed that it does not handle the case where the graph has negative cycles, but it does mention raising an error for negative weights, so that is partially addressed.

The code structure seems reasonable but I am not sure about the time complexity claim — it says O((V + E) log V) but if the decrease-key operation is implemented via lazy deletion, the worst case might be higher.`,

    // Shallow / C-D level
    `The solution seems to work for the basic case. It covers the main functionality. I think the caching approach is reasonable. One issue might be that the TTL values (60s and 5min) could be too short or too long depending on the use case, but this is hard to say without more context.`,

    // Good / A-B level
    `The caching solution is architecturally sound, but I found three significant issues:

1. **Race condition on write** — Between the database write and cache invalidation, another request could read stale data from cache and serve it. A cache-aside pattern with versioned keys would mitigate this.

2. **Write-behind coalescing risks data loss** — If the application crashes during the 500ms coalescing window, buffered writes are lost. This should either be backed by a persistent queue (like Redis Streams) or the coalescing window should be configurable per entity based on criticality.

3. **Circuit breaker threshold is too aggressive** — Three consecutive failures before fallback is a very low threshold that could trigger during normal network jitter. A percentage-based threshold (e.g., 50% failure rate over a 10-second window) would be more resilient.`,

    // Solid / B-level (different angle)
    `The algorithm implementation is correct for the stated constraints. Two observations:

1. **The A* heuristic fallback** — Switching between A* and Dijkstra based on coordinate availability is practical, but the code should verify that the heuristic is admissible (never overestimates). Euclidean distance is admissible for geographic coordinates but may not be for abstract graph embeddings.

2. **Parallel edges handling** — Keeping only the minimum weight edge between two nodes is correct for shortest-path but destroys information. If the graph needs to be reused for maximum-flow or other analyses, this preprocessing step would need to be reversible.`,

    // Average / B-C level
    `The pipeline design covers the major steps, but I have concerns:

1. **Duplicate detection using Levenshtein distance on names** — This is computationally expensive for large datasets. With 10M records, pairwise comparison is infeasible. The solution should use blocking or LSH-based approximate matching.

2. **No mention of how the 30% null threshold was chosen** — This seems arbitrary. Different columns have different importance, so a blanket threshold may discard too many or too few records.`,
  ],

  // --- JUDGING FEEDBACK (evaluation of student's judging) ---
  judgingFeedback: [
    {
      criticism: 'Excellent identification of the rate limiting and JWT storage vulnerabilities — these are critical security gaps that many reviewers overlook. Your point about connection pool sizing shows good quantitative reasoning. However, you missed the fact that the error handling middleware catches "all unhandled exceptions," which in Node.js does not include unhandled Promise rejections by default. This is a reliability gap worth flagging.',
      better_alternative: 'A top-tier review would also consider operational concerns: there is no mention of health check endpoints, graceful shutdown handling, or structured logging for observability. Additionally, the solution does not address database migration strategy, which is essential for production deployments.',
    },
    {
      criticism: 'Good catch on the forward-filling issue — your point about prolonged data gaps distorting trend analysis is specific and well-reasoned. The ECB API dependency risk is also valid. However, you framed the STL decomposition concern somewhat vaguely. Rather than saying it "may produce misleading results," you should specify what would go wrong and how to detect it.',
      better_alternative: 'A stronger judgment would suggest concrete alternatives: for example, using MSTL for multiple seasonal periods, or applying a structural break test (e.g., Chow test) before decomposition. The missing validation stage is a critical gap — quantifying the expected data integrity checks would strengthen your review further.',
    },
    {
      criticism: 'Your observation about team member preferences is a good real-world consideration that goes beyond the technical model. However, your review focuses heavily on the optimization constraints and does not evaluate the solution\'s core approach — is a weighted scoring model the right choice? Are there potential issues with the dot-product compatibility metric (e.g., a team member with a few very strong skills could be scored lower than a generalist)?',
      better_alternative: 'Consider evaluating both the algorithm choice and the output format. The solution provides three alternatives for stakeholders, but does not explain how these alternatives differ structurally (e.g., are they locally optimal variations or fundamentally different allocations?).',
    },
    {
      criticism: 'Your review is too surface-level. Saying the solution "looks mostly correct" and "seems reasonable" does not demonstrate critical evaluation. You touched on an important point about the time complexity of lazy deletion, but did not follow through with analysis. When reviewing solutions, you should take a definitive stance and support it with reasoning.',
      better_alternative: 'A proper evaluation should systematically examine correctness, efficiency, edge case handling, and practical limitations. For this specific solution, you should have tested the algorithm mentally against small examples (e.g., a graph with 3 nodes and known shortest paths) and verified the complexity claim by counting operations.',
    },
    {
      criticism: 'You identified the race condition and write-behind data loss risks, which are sophisticated architectural concerns. The point about the circuit breaker threshold is well-calibrated and shows practical experience. However, you did not address the L1 cache consistency problem — in a multi-server deployment, each server has its own in-process LRU cache that could serve stale data for up to 60 seconds after a write on another server.',
      better_alternative: 'A complete review would also question whether two cache layers are justified for this use case. The added complexity of L1+L2 cache coherence might outweigh the latency benefits if the L2 (Redis) hit latency is already acceptable.',
    },
    {
      criticism: 'Your concern about Levenshtein distance scalability is valid and well-reasoned — pairwise comparison on 10M records is indeed infeasible. Good systems thinking. However, you did not evaluate the overall pipeline architecture. Is processing everything in a single Python process appropriate for 10M records? The problem stated a 16GB RAM constraint, and a pandas DataFrame with 10M rows could consume most of that.',
      better_alternative: 'A thorough review would evaluate whether the technology choice (pandas on a single machine) is appropriate for the data volume, and suggest alternatives like chunked processing or Dask for out-of-core computation.',
    },
    {
      criticism: 'Your observation about the A* heuristic admissibility is technically precise and shows strong algorithmic understanding. The point about parallel edge information loss is subtle and forward-thinking. However, your review does not address the practical usability of the solution — does it provide clear enough output for the user to understand the result?',
      better_alternative: 'Beyond algorithmic correctness, evaluate whether the solution includes path reconstruction (not just the distance), handles the case where the source equals the target, and provides meaningful output for disconnected components (just returning -1 may not be informative enough).',
    },
    {
      criticism: 'Your review is brief and only scratches the surface. While you correctly noted that the caching TTL values are context-dependent, you did not commit to a specific evaluation of whether they are appropriate. A good judge takes a position and defends it. You also did not identify any of the major architectural issues with the caching design.',
      better_alternative: 'Focus on the most impactful issues: cache invalidation strategy, consistency guarantees, failure modes, and operational complexity. Even if you are uncertain about specific values, you can evaluate the approach — is the cache-aside pattern appropriate here, or would read-through/write-through be better?',
    },
  ],

  // --- STEERING RESPONSES (correction instructions from students) ---
  steeringResponses: [
    // Strong / A-level
    `1. Add rate limiting middleware (e.g., express-rate-limit) with a default of 100 requests per minute per IP, and a stricter limit of 10 requests per minute on the POST endpoint.

2. Replace the generic error handler with structured error responses that include a correlation ID for debugging. Ensure unhandled Promise rejections are caught using process.on('unhandledRejection').

3. Add input sanitization using a library like DOMPurify for text fields, in addition to the existing Joi validation.

4. Store refresh tokens in httpOnly, secure, sameSite cookies rather than exposing them to client-side JavaScript.

5. Add a scheduled cleanup job for soft-deleted records older than 90 days, with an archival step to cold storage before permanent deletion.`,

    // Strong / A-level (different domain)
    `1. Replace forward-filling with a gap-aware strategy: for gaps shorter than 3 days, use linear interpolation; for gaps longer than 3 days, mark the period as "data unavailable" and exclude it from trend calculations.

2. Add a local cache of ECB exchange rates (updated daily) so the pipeline can run even when the API is unavailable. Fall back to the most recent cached rate if the API returns an error.

3. Before STL decomposition, run an augmented Dickey-Fuller test for stationarity and a Chow test for structural breaks. If breaks are detected, apply piecewise decomposition on each segment.

4. Add a data validation checkpoint after each transformation stage that verifies row counts, column sums, and null percentages against expected ranges. Log warnings for deviations above 5%.`,

    // Solid / B-level
    `1. Add a constraint relaxation mechanism: if the "at least one senior per project" constraint is infeasible, demote it to a soft constraint with a penalty term rather than failing entirely.

2. Include a secondary sorting criterion based on team diversity (mix of junior and senior members) when primary compatibility scores are within 5% of each other.

3. Add a summary report that explains why each allocation was chosen, including which constraints were binding, to help stakeholders understand the trade-offs.`,

    // Average / C-level
    `1. Handle negative cycles somehow, maybe by running Bellman-Ford first to check.

2. Make sure the output includes the actual path, not just the distance.

3. The time complexity should be documented more clearly.`,

    // Shallow / D-level
    `Make the caching TTL values configurable. Also fix any bugs and make sure it handles edge cases properly.`,

    // Good / B-level
    `1. Implement versioned cache keys to eliminate the race condition: on every write, increment a version counter in the database and include it in the cache key. Reads with outdated version keys will miss the cache and fetch fresh data.

2. Replace the in-memory write-behind buffer with a Redis Stream that persists coalesced writes. This ensures buffered writes survive application crashes.

3. Increase the circuit breaker threshold to a sliding window: trip the breaker when the failure rate exceeds 40% over the last 30 seconds, with a minimum of 10 requests before activating.

4. For the L1 in-process cache in multi-server deployments, implement a pub/sub invalidation channel via Redis so that writes on one server invalidate L1 caches on all servers within seconds.`,

    // Solid / B-level (different angle)
    `1. Add a pre-processing step that validates the heuristic is admissible by checking it against known shortest paths on a small sample of node pairs.

2. Preserve parallel edges in the graph representation and only select the minimum-weight edge during pathfinding, not during graph construction. This allows the same graph object to be reused for other analyses.

3. Return a structured result object that includes the shortest distance, the reconstructed path as a list of node IDs, and a flag indicating whether A* or Dijkstra was used.`,

    // Average / C-level
    `1. Use a more efficient method for duplicate detection instead of Levenshtein distance on all pairs. Maybe use some kind of hashing or blocking approach.

2. Consider processing the data in chunks instead of loading everything into memory at once, since the dataset could be up to 10 million records.`,
  ],

  // --- STEERING FEEDBACK (evaluation of student's steering quality) ---
  steeringFeedback: [
    {
      criticism: 'Your corrections are specific, actionable, and well-prioritized. The rate limiting values you suggested (100 req/min general, 10 req/min for POST) show practical judgment. The point about unhandled Promise rejections fills a gap that even experienced developers overlook. One area for improvement: you could specify the archival format and storage destination for the cleanup job rather than leaving it as "cold storage."',
      better_alternative: 'A perfect steering response would also address operational readiness: add health check endpoints, request tracing headers, and graceful shutdown handling. These are not bugs but are critical for production deployment.',
    },
    {
      criticism: 'Excellent gap-aware interpolation strategy — distinguishing between short and long gaps shows nuanced understanding of time-series data. The augmented Dickey-Fuller test suggestion is technically sophisticated. However, your validation checkpoint thresholds (5% deviation) are a single fixed value. Different stages may warrant different tolerance levels.',
      better_alternative: 'Consider specifying per-stage validation criteria: for example, the cleaning stage should have zero duplicates (0% tolerance), while the aggregation stage might tolerate small floating-point rounding discrepancies (0.01% tolerance).',
    },
    {
      criticism: 'Good practical suggestions, especially the constraint relaxation mechanism. Converting hard constraints to soft constraints with penalty terms is a sophisticated optimization technique. However, your diversity criterion is somewhat vague — "mix of junior and senior members" could be operationalized more precisely (e.g., Gini coefficient of experience levels).',
      better_alternative: 'A stronger steering response would also address the computational feasibility: how does the solver scale if the number of team members or projects doubles? Suggesting a time limit on the solver or a heuristic fallback for large instances would demonstrate practical thinking.',
    },
    {
      criticism: 'Your suggestions are too vague to be actionable. "Handle negative cycles somehow" does not give the AI clear direction. "Document more clearly" is a style comment, not a functional correction. An effective steering response should tell the AI exactly what to change and how.',
      better_alternative: 'Instead of "handle negative cycles somehow," specify: "Add a preprocessing step using Bellman-Ford to detect negative-weight cycles. If detected, return an error with the cycle path. If no negative cycles exist, proceed with Dijkstra." Each correction should be a concrete instruction.',
    },
    {
      criticism: 'This is far too vague to guide a meaningful revision. "Fix any bugs" is not a correction — it is a wish. "Make sure it handles edge cases" does not identify which edge cases. Effective steering requires you to identify specific problems and propose specific solutions.',
      better_alternative: 'Identify at least three concrete issues from your judging phase and provide specific remediation steps for each. For example: "Set the L1 cache TTL to 15 seconds instead of 60 to reduce stale-read windows" is actionable; "fix any bugs" is not.',
    },
    {
      criticism: 'Your versioned cache key approach is an elegant solution to the race condition — this demonstrates strong distributed systems thinking. The Redis Stream replacement for the write-behind buffer is also well-reasoned. One concern: the pub/sub invalidation adds significant infrastructure complexity. You should address the failure mode where a server misses an invalidation message.',
      better_alternative: 'Consider adding a bounded staleness guarantee as a safety net: even if a pub/sub message is missed, the L1 TTL of 60 seconds provides an upper bound on stale data. Document this trade-off explicitly so the engineering team can make an informed decision.',
    },
    {
      criticism: 'Your suggestion to preserve parallel edges during graph construction and only select minimum-weight edges during pathfinding is a clean separation of concerns. The structured result object is a good usability improvement. However, validating heuristic admissibility by sampling is statistically unreliable — a single counterexample could invalidate the heuristic, and sampling might miss it.',
      better_alternative: 'Instead of sampling, prove admissibility analytically based on the problem domain: if the graph represents physical distances, Euclidean distance is provably admissible. If the domain is unknown, default to Dijkstra (h=0) which is always admissible.',
    },
    {
      criticism: 'Your suggestions are correct in direction — chunked processing and efficient duplicate detection are the right ideas. However, you do not specify which approach to use. "Some kind of hashing or blocking" leaves too much ambiguity for the AI. Effective steering provides enough detail for the AI to implement the change without guessing.',
      better_alternative: 'Specify the technique: "Use MinHash with locality-sensitive hashing (LSH) for approximate duplicate detection, with a Jaccard similarity threshold of 0.85. For chunked processing, use pandas read_csv with chunksize=100000 and process each chunk independently before merging results."',
    },
  ],

  // --- AI REGENERATED OUTPUTS (improved solutions after steering) ---
  aiRegeneratedOutputs: [
    `Updated solution incorporating the requested improvements:

The API now includes express-rate-limit middleware configured at 100 requests/minute globally and 10 requests/minute on mutation endpoints. All text inputs pass through DOMPurify sanitization after Joi validation. Refresh tokens are issued as httpOnly, secure, sameSite=strict cookies with a 7-day expiry.

Error handling has been restructured: a correlation ID (UUID v4) is attached to each request via middleware and included in all error responses and log entries. A global process.on('unhandledRejection') handler catches Promise rejections and forwards them to the centralized error logger.

A new scheduled job runs nightly at 02:00 UTC, archiving soft-deleted records older than 90 days to an S3-compatible cold storage bucket in compressed JSON format, then permanently removing them from the primary database. The archival manifest is logged for audit purposes.

Health check endpoint (GET /healthz) returns database connectivity status, memory usage, and uptime.`,

    `Revised analysis pipeline with the following improvements:

Gap handling now uses a tiered strategy: gaps under 3 days are linearly interpolated, gaps between 3 and 14 days use seasonal naive imputation (same day from prior week), and gaps over 14 days are excluded from analysis with clear annotations in the output report.

Exchange rate caching: a local SQLite database stores daily ECB exchange rates, updated each morning. If the ECB API is unreachable, the pipeline uses the most recent cached rate and logs a warning with the staleness duration.

Pre-decomposition diagnostics: before applying STL, the pipeline runs an augmented Dickey-Fuller test and Zivot-Andrews structural break test. If structural breaks are detected, the time series is segmented and each segment is decomposed independently. Results include a diagnostics section with test statistics and p-values.

Data validation checkpoints are now inserted after each stage, comparing row counts (tolerance: 0%), column sums (tolerance: 0.01% for floating-point), and null percentages against configurable thresholds. Failures halt the pipeline and produce a diagnostic report.`,

    `Revised optimization model with requested changes:

Constraint relaxation: the "senior member per project" requirement is now a soft constraint with a penalty weight of 50 (calibrated to be significant but not dominant). If the constraint is infeasible as a hard constraint, the solver automatically relaxes it and reports which projects lack senior members, with a recommended mitigation plan.

Secondary sorting: when primary compatibility scores are within 5%, allocations are ranked by a team diversity index computed as the normalized standard deviation of experience levels within the team. Higher diversity scores are preferred.

Solver scalability: a 60-second time limit is set on the CBC solver. If the optimal solution is not found within this window, the solver returns the best feasible solution found so far with a gap indicator showing proximity to optimality. For instances with more than 50 team members or 20 projects, a greedy heuristic runs first to provide a warm start.

The output report now includes a natural-language explanation for each allocation decision, including which constraints were binding and what trade-offs were made.`,

    `Updated graph algorithm implementation:

Negative weight handling: a Bellman-Ford preprocessing step runs in O(VE) time to detect negative-weight cycles. If a cycle is detected, the algorithm returns an error containing the cycle path and the total negative weight. For graphs with negative weights but no negative cycles, Bellman-Ford computes the shortest paths directly instead of Dijkstra.

Path reconstruction: the algorithm now maintains a predecessor array alongside the distance array. After finding the shortest distance, it traces back through predecessors to reconstruct the full path. The return value is a structured object: { distance: number, path: [nodeId, ...], algorithm: "dijkstra" | "bellman-ford" | "a-star", nodesExplored: number }.

Parallel edges are preserved in the adjacency list representation. During pathfinding, only the minimum-weight edge between any two nodes is considered, but the full graph structure is available for other analyses. The source=target case returns { distance: 0, path: [source], algorithm: "trivial" }.`,

    `Revised caching architecture:

L1 cache invalidation is now coordinated across servers using Redis Pub/Sub on channel "cache:invalidate". When any server writes to the database, it publishes the affected cache key pattern to this channel. All subscriber servers immediately evict matching entries from their local LRU caches. As a safety net, the L1 TTL remains at 60 seconds to bound staleness even if a pub/sub message is lost.

Write-behind buffering now uses Redis Streams instead of in-memory buffers. Each coalesced write is appended to a stream with MAXLEN 10000. A dedicated consumer group processes the stream and flushes to the database. If the application crashes, unprocessed stream entries are picked up by the consumer group's pending entry list (PEL) on restart.

Circuit breaker uses a sliding window algorithm: failures are tracked over a 30-second window with a minimum sample size of 10 requests. The breaker trips when the failure rate exceeds 40%. In the open state, one probe request is sent every 5 seconds; three consecutive successes close the breaker. All state transitions are logged with timestamps and failure counts for operational visibility.`,
  ],
};

// Grade distribution presets to get interesting analytics patterns
const GRADE_PRESETS = [
  // Strong student
  { framing: 'A', judging: 'A', steering: 'B' },
  { framing: 'A', judging: 'B', steering: 'A' },
  { framing: 'B', judging: 'A', steering: 'A' },
  // Average student
  { framing: 'B', judging: 'B', steering: 'C' },
  { framing: 'B', judging: 'C', steering: 'B' },
  { framing: 'C', judging: 'B', steering: 'B' },
  // Weaker student
  { framing: 'C', judging: 'C', steering: 'B' },
  { framing: 'C', judging: 'B', steering: 'C' },
  { framing: 'B', judging: 'C', steering: 'C' },
  // Mixed
  { framing: 'A', judging: 'C', steering: 'B' },
  { framing: 'C', judging: 'A', steering: 'B' },
  { framing: 'B', judging: 'B', steering: 'A' },
  { framing: 'A', judging: 'A', steering: 'A' },
  { framing: 'D', judging: 'C', steering: 'C' },
  { framing: 'B', judging: 'D', steering: 'B' },
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo) {
  const now = Date.now();
  const start = now - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(start + Math.random() * (now - start));
}

function computeOverallGrade(framing, judging, steering) {
  const scores = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const avg = (scores[framing] + scores[judging] + scores[steering]) / 3;
  if (avg >= 3.5) return 'A';
  if (avg >= 2.5) return 'B';
  if (avg >= 1.5) return 'C';
  if (avg >= 0.5) return 'D';
  return 'F';
}

const FILL_MODE = process.argv.includes('--fill');

async function main() {
  console.log(`Seeding demo challenge runs${FILL_MODE ? ' (--fill mode: cover all published challenges)' : ''}...\n`);

  // Load all demo students
  const students = await knex('users')
    .whereIn('email', DEMO_STUDENT_EMAILS)
    .andWhere('role', 'student');

  if (students.length === 0) {
    console.log('No demo students found. Run the full import first.');
    process.exit(1);
  }
  console.log(`Found ${students.length} demo students.`);

  // Load all challenges with their courses
  const challenges = await knex('challenges')
    .leftJoin('courses', 'challenges.course_id', 'courses.id')
    .select('challenges.id as id', 'challenges.title', 'challenges.course_id',
            'challenges.status as challenge_status',
            'courses.institution_id');

  console.log(`Found ${challenges.length} challenges.\n`);

  let totalRunsInserted = 0;
  let totalCyclesInserted = 0;
  let skippedStudents = 0;

  for (const student of students) {
    // Idempotency: check if student already has completed runs
    const existingCompleted = await knex('challenge_runs')
      .where({ user_id: student.id, status: 'completed' })
      .count('* as cnt');

    // In fill mode, don't skip students — we need them to cover uncovered challenges
    if (!FILL_MODE && existingCompleted[0].cnt >= 5) {
      console.log(`  SKIP ${student.name} — already has ${existingCompleted[0].cnt} completed runs`);
      skippedStudents++;
      continue;
    }

    // Find challenges from the student's subscribed courses first,
    // then fall back to institution-matched challenges
    const subscribedCourseIds = await knex('course_subscriptions')
      .where({ user_id: student.id })
      .select('course_id');
    const subCourseSet = new Set(subscribedCourseIds.map(s => s.course_id));

    let availableChallenges;
    if (subCourseSet.size > 0) {
      // Prefer challenges from subscribed courses (supports mixed-language users)
      availableChallenges = challenges.filter(c => subCourseSet.has(c.course_id));
    } else {
      // Fall back to institution-matched challenges
      availableChallenges = challenges.filter(
        c => c.institution_id === student.institution_id
      );
    }

    // Fallback: if student has fewer than 5 matched challenges,
    // supplement with challenges from their institution or other institutions
    if (availableChallenges.length < 5) {
      const remaining = challenges.filter(
        c => !subCourseSet.has(c.course_id) && c.institution_id !== student.institution_id
      );
      const institutionMatched = challenges.filter(
        c => c.institution_id === student.institution_id && !subCourseSet.has(c.course_id)
      );
      const shuffledRemaining = [...institutionMatched, ...remaining].sort(() => Math.random() - 0.5);
      availableChallenges = [
        ...availableChallenges,
        ...shuffledRemaining.slice(0, 8 - availableChallenges.length),
      ];
    }

    // Exclude challenges the student already has runs for
    const existingRunChallenges = await knex('challenge_runs')
      .where({ user_id: student.id })
      .select('challenge_id');
    const existingChallengeIds = new Set(existingRunChallenges.map(r => r.challenge_id));
    availableChallenges = availableChallenges.filter(c => !existingChallengeIds.has(c.id));

    // Pick enough to reach 5-8 total completed runs
    const existingCount = existingCompleted[0].cnt;
    const targetTotal = randomInt(5, Math.min(8, existingCount + availableChallenges.length));
    const numRuns = targetTotal - existingCount;
    if (numRuns <= 0) {
      console.log(`  SKIP ${student.name} (${student.email}) — already has ${existingCount} completed runs`);
      skippedStudents++;
      continue;
    }
    const shuffled = [...availableChallenges].sort(() => Math.random() - 0.5);
    const selectedChallenges = shuffled.slice(0, numRuns);

    let studentRunCount = 0;

    for (const challenge of selectedChallenges) {
      const preset = pickRandom(GRADE_PRESETS);
      const overallGrade = computeOverallGrade(preset.framing, preset.judging, preset.steering);

      // Spread runs over the past 30 days
      const startedAt = randomDate(30);
      // Completed 10 min to 2 hours after starting
      const completedAt = new Date(startedAt.getTime() + randomInt(10, 120) * 60 * 1000);

      const runId = uuidv4();

      // Build framing response/feedback from content library
      const framingContent = pickRandom(CONTENT_LIBRARY.framingResponses);
      const framingFb = pickRandom(CONTENT_LIBRARY.framingFeedback);
      const framingResponse = JSON.stringify({
        type: 'submitted',
        answer: framingContent,
      });
      const framingFeedback = JSON.stringify({
        criticism: framingFb.criticism,
        better_alternative: framingFb.better_alternative,
        grade: preset.framing,
      });

      // Insert the run
      await knex('challenge_runs').insert({
        id: runId,
        challenge_id: challenge.id,
        user_id: student.id,
        status: 'completed',
        framing_response: framingResponse,
        framing_feedback: framingFeedback,
        framing_grade: preset.framing,
        ai_solution: pickRandom(CONTENT_LIBRARY.aiSolutions),
        current_cycle: randomInt(1, 3),
        grades: JSON.stringify({
          framing: preset.framing,
          judging: preset.judging,
          steering: preset.steering,
          overall: overallGrade,
        }),
        started_at: startedAt.toISOString(),
        completed_at: completedAt.toISOString(),
        created_at: startedAt.toISOString(),
        updated_at: completedAt.toISOString(),
      });

      // Insert 1-3 cycles per run
      const numCycles = randomInt(1, 3);
      for (let cycleNum = 1; cycleNum <= numCycles; cycleNum++) {
        const cycleJudging = cycleNum === numCycles ? preset.judging : pickRandom(['A', 'B', 'C']);
        const cycleSteering = cycleNum === numCycles ? preset.steering : pickRandom(['A', 'B', 'C']);

        const judgingFb = pickRandom(CONTENT_LIBRARY.judgingFeedback);
        const steeringFb = pickRandom(CONTENT_LIBRARY.steeringFeedback);

        await knex('challenge_run_cycles').insert({
          id: uuidv4(),
          run_id: runId,
          cycle_num: cycleNum,
          judging_response: JSON.stringify({ type: 'submitted', answer: pickRandom(CONTENT_LIBRARY.judgingResponses) }),
          judging_feedback: JSON.stringify({ criticism: judgingFb.criticism, better_alternative: judgingFb.better_alternative, grade: cycleJudging }),
          judging_grade: cycleJudging,
          steering_response: JSON.stringify({ type: 'submitted', answer: pickRandom(CONTENT_LIBRARY.steeringResponses) }),
          steering_feedback: JSON.stringify({ criticism: steeringFb.criticism, better_alternative: steeringFb.better_alternative, grade: cycleSteering }),
          steering_grade: cycleSteering,
          ai_output: pickRandom(CONTENT_LIBRARY.aiRegeneratedOutputs),
          created_at: new Date(startedAt.getTime() + cycleNum * 5 * 60 * 1000).toISOString(),
          updated_at: new Date(startedAt.getTime() + cycleNum * 5 * 60 * 1000).toISOString(),
        });

        totalCyclesInserted++;
      }

      studentRunCount++;
      totalRunsInserted++;
    }

    console.log(`  OK ${student.name} (${student.email}) — ${studentRunCount} runs inserted`);
  }

  // ---------------------------------------------------------------------------
  // --fill mode: ensure every published challenge has at least 1-2 demo runs
  // ---------------------------------------------------------------------------
  if (FILL_MODE) {
    console.log('\n--- Fill mode: checking for published challenges without runs ---');

    const publishedChallenges = challenges.filter(c => c.challenge_status === 'published');
    console.log(`Found ${publishedChallenges.length} published challenges.`);

    // Get all challenge IDs that already have at least one completed run
    const coveredRows = await knex('challenge_runs')
      .where('status', 'completed')
      .select('challenge_id')
      .groupBy('challenge_id');
    const coveredSet = new Set(coveredRows.map(r => r.challenge_id));

    const uncovered = publishedChallenges.filter(c => !coveredSet.has(c.id));
    console.log(`${uncovered.length} published challenge(s) have no completed runs.\n`);

    let fillRunsInserted = 0;
    let fillCyclesInserted = 0;

    for (const challenge of uncovered) {
      // Pick 1-2 appropriate demo students for this challenge
      // Prefer students from the same institution or subscribed to the course
      const subscribedStudentIds = (await knex('course_subscriptions')
        .where('course_id', challenge.course_id)
        .whereIn('user_id', students.map(s => s.id))
        .select('user_id'))
        .map(r => r.user_id);
      const subscribedStudentSet = new Set(subscribedStudentIds);

      // Prioritize: subscribed > same institution > any demo student
      const candidates = [
        ...students.filter(s => subscribedStudentSet.has(s.id)),
        ...students.filter(s => !subscribedStudentSet.has(s.id) && s.institution_id === challenge.institution_id),
        ...students.filter(s => !subscribedStudentSet.has(s.id) && s.institution_id !== challenge.institution_id),
      ];

      // Pick 1-2 unique students
      const numStudents = Math.min(randomInt(1, 2), candidates.length);
      const selectedStudents = candidates.slice(0, numStudents);

      for (const student of selectedStudents) {
        // Check this student doesn't already have a run for this challenge
        const existingRun = await knex('challenge_runs')
          .where({ user_id: student.id, challenge_id: challenge.id })
          .first();
        if (existingRun) continue;

        const preset = pickRandom(GRADE_PRESETS);
        const overallGrade = computeOverallGrade(preset.framing, preset.judging, preset.steering);
        const startedAt = randomDate(30);
        const completedAt = new Date(startedAt.getTime() + randomInt(10, 120) * 60 * 1000);
        const runId = uuidv4();

        const framingContent = pickRandom(CONTENT_LIBRARY.framingResponses);
        const framingFb = pickRandom(CONTENT_LIBRARY.framingFeedback);

        await knex('challenge_runs').insert({
          id: runId,
          challenge_id: challenge.id,
          user_id: student.id,
          status: 'completed',
          framing_response: JSON.stringify({ type: 'submitted', answer: framingContent }),
          framing_feedback: JSON.stringify({ criticism: framingFb.criticism, better_alternative: framingFb.better_alternative, grade: preset.framing }),
          framing_grade: preset.framing,
          ai_solution: pickRandom(CONTENT_LIBRARY.aiSolutions),
          current_cycle: randomInt(1, 3),
          grades: JSON.stringify({ framing: preset.framing, judging: preset.judging, steering: preset.steering, overall: overallGrade }),
          started_at: startedAt.toISOString(),
          completed_at: completedAt.toISOString(),
          created_at: startedAt.toISOString(),
          updated_at: completedAt.toISOString(),
        });

        const numCycles = randomInt(1, 3);
        for (let cycleNum = 1; cycleNum <= numCycles; cycleNum++) {
          const cycleJudging = cycleNum === numCycles ? preset.judging : pickRandom(['A', 'B', 'C']);
          const cycleSteering = cycleNum === numCycles ? preset.steering : pickRandom(['A', 'B', 'C']);
          const judgingFb = pickRandom(CONTENT_LIBRARY.judgingFeedback);
          const steeringFb = pickRandom(CONTENT_LIBRARY.steeringFeedback);

          await knex('challenge_run_cycles').insert({
            id: uuidv4(),
            run_id: runId,
            cycle_num: cycleNum,
            judging_response: JSON.stringify({ type: 'submitted', answer: pickRandom(CONTENT_LIBRARY.judgingResponses) }),
            judging_feedback: JSON.stringify({ criticism: judgingFb.criticism, better_alternative: judgingFb.better_alternative, grade: cycleJudging }),
            judging_grade: cycleJudging,
            steering_response: JSON.stringify({ type: 'submitted', answer: pickRandom(CONTENT_LIBRARY.steeringResponses) }),
            steering_feedback: JSON.stringify({ criticism: steeringFb.criticism, better_alternative: steeringFb.better_alternative, grade: cycleSteering }),
            steering_grade: cycleSteering,
            ai_output: pickRandom(CONTENT_LIBRARY.aiRegeneratedOutputs),
            created_at: new Date(startedAt.getTime() + cycleNum * 5 * 60 * 1000).toISOString(),
            updated_at: new Date(startedAt.getTime() + cycleNum * 5 * 60 * 1000).toISOString(),
          });
          fillCyclesInserted++;
        }

        fillRunsInserted++;
      }

      if (selectedStudents.length > 0) {
        console.log(`  FILL "${challenge.title}" — ${selectedStudents.length} run(s) added`);
      }
    }

    totalRunsInserted += fillRunsInserted;
    totalCyclesInserted += fillCyclesInserted;
    console.log(`\nFill mode added ${fillRunsInserted} runs and ${fillCyclesInserted} cycles for ${uncovered.length} uncovered challenges.`);
  }

  console.log(`\nDone! Inserted ${totalRunsInserted} runs and ${totalCyclesInserted} cycles total.`);
  if (skippedStudents > 0) {
    console.log(`Skipped ${skippedStudents} student(s) who already had completed runs.`);
  }

  // Summary query
  const summary = await knex('challenge_runs')
    .join('users', 'challenge_runs.user_id', 'users.id')
    .where('challenge_runs.status', 'completed')
    .whereIn('users.email', DEMO_STUDENT_EMAILS)
    .select('users.name')
    .count('challenge_runs.id as runs')
    .groupBy('users.name');

  console.log('\nVerification — completed runs per demo student:');
  for (const row of summary) {
    console.log(`  ${row.name}: ${row.runs}`);
  }

  // Challenge coverage summary
  const publishedCount = await knex('challenges').where('status', 'published').count('* as cnt');
  const coveredCount = await knex('challenge_runs')
    .where('status', 'completed')
    .countDistinct('challenge_id as cnt');
  console.log(`\nChallenge coverage: ${coveredCount[0].cnt} of ${publishedCount[0].cnt} published challenges have completed runs.`);

  const uncoveredChallenges = await knex('challenges')
    .where('challenges.status', 'published')
    .whereNotIn('challenges.id', knex('challenge_runs').where('status', 'completed').select('challenge_id'))
    .select('challenges.title');
  if (uncoveredChallenges.length > 0) {
    console.log(`\nWARNING: ${uncoveredChallenges.length} published challenge(s) still have no runs:`);
    for (const c of uncoveredChallenges) {
      console.log(`  - ${c.title}`);
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
