# Session 1 — Sorting Pipeline for Sensor Data (Multiple Choice)

**Challenge:** Sorting & Searching > Comparison-based Sorting
**Mode:** Multiple Choice
**Student:** Noa R.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Write a sorting module that ingests a live stream of temperature readings from warehouse sensors and outputs a continuously sorted buffer that a monitoring dashboard can poll. Each reading is a (sensor_id, timestamp, temperature) tuple. The warehouse has "a few hundred" sensors reporting every second. Deliver working pseudocode for the module plus a table comparing your chosen algorithm against two alternatives on time complexity, space usage, and latency. The system should "handle spikes" when sensors report in bursts.

### Framing Options Presented

Which assumptions and constraints should you establish before the AI generates a solution?

- **(A)** Assume sort key is temperature (for anomaly detection), buffer holds all historical data, "spikes" means sensor values above a threshold
- **(B)** Assume sort key is timestamp, estimate ~200-500 sensors producing 200-500 tuples/sec, define "spikes" as 3-5x burst rate, assume a 60-second sliding window buffer
- **(C)** Assume sort key is timestamp with sensor_id as tiebreaker for stability, estimate ~200-500 sensors, question whether readings arrive roughly in order, ask about dashboard output format (full buffer vs top-k), define spike rate as 3-5x normal
- **(D)** Assume data is pre-sorted by sensor_id, use a fixed-size circular buffer, "spikes" means network packet loss requiring retransmission
- **(E)** Skip assumptions — the problem is clear enough. Just ask the AI for a fast sorting algorithm for tuples.

**Student selects: (B)**

### AI Solution (Generated from Student's Framing)

```
MODULE SortedSensorBuffer:
    buffer = []  // sorted list of (sensor_id, timestamp, temperature)

    FUNCTION ingest(reading):
        pos = binary_search(buffer, reading.timestamp)
        buffer.insert(pos, reading)
        while buffer[0].timestamp < current_time() - 60:
            buffer.remove(0)

    FUNCTION poll():
        return copy(buffer)
```

**Comparison Table:**

| Criterion       | Insertion Sort (chosen) | Merge Sort       | Quick Sort        |
|-----------------|------------------------|------------------|-------------------|
| Time (per item) | O(log n) search + O(n) shift | O(n log n) full re-sort | O(n log n) full re-sort |
| Space           | O(1) extra             | O(n)             | O(log n) stack    |
| Latency         | Low per-item           | High batch latency | High batch latency |

### Framing Feedback

**Criticism:** Option (B) is reasonable but incomplete. It correctly sets the sort key, estimates scale, and defines spike behavior. However, it misses stability (what if two readings share a timestamp?), arrival-order assumptions (do readings arrive roughly in chronological order?), and the dashboard's output needs. Option (C) was stronger because it addressed stability via sensor_id tiebreaking, questioned arrival order, and asked about the output format.

**Better Alternative:** Option **(C)** — it covers everything in (B) plus stability, arrival ordering, and output format, which are all decisions that affect algorithm selection.

**Grade: B** — Good quantitative reasoning, but missed key design dimensions.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's current solution?

- **(A)** The binary search is implemented incorrectly — it should use temperature as the key, not timestamp
- **(B)** The O(n) shift cost per insertion creates a bottleneck during bursts; the comparison table's space column is misleading (all approaches need the buffer)
- **(C)** The AI should have used Quick Sort because it has better average-case performance than insertion into a sorted array
- **(D)** The O(n) shift cost per insertion creates a bottleneck during bursts; the comparison table's space column is misleading; the poll() function's O(n) copy is wasteful; the AI never considers whether near-sorted input changes the analysis
- **(E)** The algorithm is correct and efficient — no significant issues

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "Use Quick Sort instead of insertion — it's faster"
- **(B)** "Make the code run faster and use less memory"
- **(C)** "Analyze the worst-case cost during a burst of 2,500 readings. Show whether the O(n) shift per insertion creates a bottleneck. If so, propose a batch-and-merge alternative. Also fix the space column to distinguish buffer space from auxiliary space."
- **(D)** "Rewrite everything using a linked list so insertions are O(1)"
- **(E)** "Add thread safety with mutex locks around the buffer"

**Student selects: (C)**

#### Updated AI Output

```
MODULE SortedSensorBuffer:
    buffer = []
    batch_queue = []

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        if len(batch_queue) >= BATCH_THRESHOLD or time_since_last_flush > 50ms:
            flush()

    FUNCTION flush():
        sort(batch_queue)                     // O(b log b)
        buffer = merge(buffer, batch_queue)   // O(n + b)
        batch_queue = []
        evict_old(buffer)

    FUNCTION poll():
        flush()
        return copy(buffer)
```

**Burst Analysis (b=2,500, n=25,000):**
- Old: 2,500 x O(25,000) = O(62.5M)
- New: O(2,500 log 2,500) + O(27,500) = ~O(30,000)

**Revised Comparison Table:**

| Criterion        | Batch Merge (chosen) | Pure Insertion      | Full Re-sort (Quick Sort) |
|------------------|---------------------|---------------------|--------------------------|
| Time (per batch) | O(b log b + n)      | O(b * n) worst case | O((n+b) log(n+b))        |
| Auxiliary Space  | O(b) for batch queue | O(1)                | O(log(n+b)) stack        |
| Latency          | Amortized low       | Low per-item, spikes high | High per-batch     |

#### Judging Feedback

**Criticism:** The student correctly identified the O(n) shift bottleneck (the most critical issue) and the misleading space column. However, option (D) was more complete — it also caught that poll() copies the entire buffer each call and that near-sorted arrival order could change the analysis. These are meaningful issues the student missed.

**Better Alternative:** Option **(D)** — it includes everything in (B) plus the poll() overhead and arrival-order consideration.

**Grade: B** — Caught the main issue but missed secondary problems.

#### Steering Feedback

**Criticism:** Option (C) was excellent — specific, actionable, and directly targeted at the identified issues. It asked for concrete analysis, proposed a specific alternative strategy, and addressed the table problem. This was the best available option.

**Grade: A** — Precise, actionable steering that drove a meaningful improvement.

---

### Cycle 2

**Current AI Output:** *(batch merge version as shown above)*

#### Judging Sub-step

Which issues remain in the AI's updated solution?

- **(A)** The batch merge approach is fundamentally wrong — merge sort shouldn't be used for streaming data
- **(B)** The burst analysis arithmetic is incorrect (~30,000 should be ~55,000); BATCH_THRESHOLD has no specified value or justification
- **(C)** The algorithm needs to use a B-tree instead of an array for O(log n) insertion
- **(D)** The burst analysis arithmetic is incorrect; BATCH_THRESHOLD is unspecified; evict_old scans the full buffer unnecessarily when only front elements need removal
- **(E)** The solution is now complete and correct — no remaining issues

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send to the AI?

- **(A)** "The solution looks good, just clean up the formatting"
- **(B)** "Fix the burst analysis arithmetic to show actual operation counts for b=2,500, n=25,000. Specify a concrete BATCH_THRESHOLD value with justification based on the dashboard's polling frequency."
- **(C)** "Rewrite using a heap instead of a sorted array"
- **(D)** "Add error handling for malformed sensor readings"
- **(E)** "Replace merge sort with Tim Sort since Python uses it internally"

**Student selects: (B)**

#### Updated AI Output

```
MODULE SortedSensorBuffer:
    BATCH_THRESHOLD = 500  // ~1 second of normal traffic
    FLUSH_INTERVAL = 200ms

    buffer = []
    batch_queue = []

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        if len(batch_queue) >= BATCH_THRESHOLD or time_since_last_flush > FLUSH_INTERVAL:
            flush()

    FUNCTION flush():
        merge_sort(batch_queue)
        buffer = merge(buffer, batch_queue)
        batch_queue = []
        evict_old(buffer)

    FUNCTION poll():
        if batch_queue is not empty:
            flush()
        return copy(buffer)
```

**Corrected Burst Analysis (b=2,500, n=25,000):**
- merge_sort(batch): 2,500 * 11.3 = ~28,200 comparisons
- merge: 25,000 + 2,500 = 27,500 comparisons
- Total: ~55,700 operations
- Old approach: 62,500,000 operations
- Speedup: ~1,122x

#### Judging Feedback

**Criticism:** The student caught the arithmetic error and unspecified threshold — both real issues. However, option (D) also caught that `evict_old` does unnecessary work: since the buffer is timestamp-sorted, eviction only touches the front. A deque or pointer-based structure makes this O(k) instead of O(n). The student missed this optimization.

**Better Alternative:** Option **(D)** — includes arithmetic fix, threshold gap, and eviction optimization.

**Grade: A** — Good but incomplete issue identification.

#### Steering Feedback

**Criticism:** Option (B) was well-targeted and actionable, directly fixing the two issues the student identified. To be even stronger, it could have also addressed the eviction scan cost.

**Grade: A** — Specific and effective, minor gap.

---

### Cycle 3 (Final)

**Current AI Output:** *(corrected version as shown above)*

#### Judging Sub-step

Which issues remain?

- **(A)** The eviction scan is still O(n) but only needs to remove from the front — could be O(k)
- **(B)** The entire approach is wrong — should use a database
- **(C)** No significant issues remain for the scope of this problem
- **(D)** The hash function is not specified
- **(E)** The algorithm doesn't handle negative temperatures

**Student selects: (C)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | B     |
| Steering | A     |

### Summary Feedback

The student consistently identified the most critical issues in each cycle (burst bottleneck, arithmetic error, unspecified parameters) but repeatedly missed secondary concerns — the poll() copy cost, arrival-order assumptions in framing, and eviction optimization in judging. This pattern suggests the student focuses well on the primary algorithm concern but should practice examining the full solution surface: I/O interfaces, operational costs, and edge-case behaviors. Steering was the strongest skill — corrections were consistently specific, actionable, and drove meaningful improvements. In future sessions, try to ask "what else could be wrong?" after finding the first issue.
