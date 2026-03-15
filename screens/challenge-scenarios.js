// ============================================================
// CoReasoning Lab — Challenge Run Scenario Data
// Separates content from page structure and rendering logic.
// Each challenge has MC + OE variants; mode (practice/assessment)
// is handled by the template rendering engine.
// ============================================================

const CHALLENGES = {

// ══════════════════════════════════════════════════════════════
// CHALLENGE 1: Sorting Pipeline for Sensor Data
// ══════════════════════════════════════════════════════════════
sorting: {
  title: 'Sorting Pipeline for Sensor Data',
  course: 'Introduction to Algorithms',
  subject: 'Sorting &amp; Searching &rsaquo; Comparison-based Sorting',
  maxCycles: 5,
  rawProblem: 'Write a sorting module that ingests a live stream of temperature readings from warehouse sensors and outputs a continuously sorted buffer that a monitoring dashboard can poll. Each reading is a (sensor_id, timestamp, temperature) tuple. The warehouse has &ldquo;a few hundred&rdquo; sensors reporting every second. Deliver working pseudocode for the module plus a table comparing your chosen algorithm against two alternatives on time complexity, space usage, and latency. The system should &ldquo;handle spikes&rdquo; when sensors report in bursts.',
  rawProblemShort: 'Sorting module for live sensor readings &hellip; sorted buffer for dashboard polling. ~hundreds of sensors, every second. Handle spikes.',

  mc: {
    aiSolution: {
      html: `<div class="code-block">MODULE SortedSensorBuffer:
    buffer = []  // sorted list of (sensor_id, timestamp, temperature)

    FUNCTION ingest(reading):
        pos = binary_search(buffer, reading.timestamp)
        buffer.insert(pos, reading)
        while buffer[0].timestamp &lt; current_time() - 60:
            buffer.remove(0)

    FUNCTION poll():
        return copy(buffer)</div>
<p class="text-sm" style="margin-top:8px"><strong>Comparison Table:</strong></p>
<table class="comparison-table"><thead><tr><th>Criterion</th><th>Insertion Sort (chosen)</th><th>Merge Sort</th><th>Quick Sort</th></tr></thead>
<tbody>
<tr><td>Time (per item)</td><td>O(log n) search + O(n) shift</td><td>O(n log n) full re-sort</td><td>O(n log n) full re-sort</td></tr>
<tr><td>Space</td><td>O(1) extra</td><td>O(n)</td><td>O(log n) stack</td></tr>
<tr><td>Latency</td><td>Low per-item</td><td>High batch latency</td><td>High batch latency</td></tr>
</tbody></table>`,
      summary: 'Insertion sort into sorted array. O(log n) search + O(n) shift. 60s sliding window.'
    },
    framing: {
      hint: 'The raw problem is intentionally incomplete. Select ALL refinements (assumptions, constraints, clarifications) that should be applied before the AI generates a solution. Some refinements are necessary; others are unnecessary or wrong.',
      options: [
        { letter: 'A', text: 'Sort key should be timestamp (not temperature) since the dashboard needs chronological ordering', correct: true },
        { letter: 'B', text: 'Use sensor_id as tiebreaker when timestamps match, to ensure stable ordering', correct: true },
        { letter: 'C', text: 'Quantify &ldquo;a few hundred&rdquo; as ~200-500 sensors producing 200-500 tuples/sec under normal conditions', correct: true },
        { letter: 'D', text: 'Define &ldquo;spikes&rdquo; as 3-5x the normal ingestion rate (burst rate), not sensor value anomalies', correct: true },
        { letter: 'E', text: 'Assume data arrives pre-sorted by sensor_id since sensors have fixed physical positions', correct: false },
        { letter: 'F', text: 'Use a 60-second sliding window buffer rather than storing all historical data', correct: true }
      ],
      studentSelections: [0, 2, 3, 5],
      feedback: {
        grade: 'B',
        html: `<div class="criticism"><strong>Correctly selected:</strong> (A) sort key as timestamp, (C) quantifying sensor count, (D) defining spike rate, (F) sliding window.</div>
<div class="criticism" style="margin-top:6px"><strong>Missed:</strong> (B) sensor_id tiebreaker for stability &mdash; without this, sort is ambiguous when two readings share a timestamp.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (E) pre-sorted by sensor_id &mdash; sensors report at different times, NOT pre-sorted.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B), (C), (D), (F).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          options: [
            { letter: 'A', text: 'No tiebreaker &mdash; insertion position is ambiguous for same-timestamp readings', correct: true },
            { letter: 'B', text: 'O(n) shift cost per insertion creates a bottleneck during bursts of 2,500 readings', correct: true },
            { letter: 'C', text: 'Comparison table&rsquo;s space column is misleading &mdash; &ldquo;O(1) extra&rdquo; hides true memory cost', correct: true },
            { letter: 'D', text: 'poll() copies the entire buffer on every call &mdash; wasteful for frequent polling', correct: true },
            { letter: 'E', text: 'Quick Sort would be faster than insertion for this streaming use case', correct: false }
          ],
          studentSelections: [1, 2],
          doneSelected: false,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>Correctly identified:</strong> (B) O(n) shift bottleneck, (C) misleading space column.</div>
<div class="criticism" style="margin-top:6px"><strong>Missed:</strong> (D) poll() copies entire buffer; (A) no tiebreaker for same-timestamp.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (E) Quick Sort is NOT better for streaming data.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B), (C), (D).</div>`
          }
        },
        steering: {
          options: [
            { letter: 'A', text: '&ldquo;Analyze worst-case burst cost for 2,500 readings. Propose a batch-and-merge alternative.&rdquo;', correct: true },
            { letter: 'B', text: '&ldquo;Fix comparison table to distinguish buffer space from auxiliary space.&rdquo;', correct: true },
            { letter: 'C', text: '&ldquo;Make the code run faster and use less memory.&rdquo;', correct: false },
            { letter: 'D', text: '&ldquo;Rewrite everything using a linked list so insertions are O(1).&rdquo;', correct: false },
            { letter: 'E', text: '&ldquo;Add thread safety with mutex locks around the buffer.&rdquo;', correct: false }
          ],
          studentSelections: [0, 1],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Correctly selected:</strong> (A) burst analysis + batch-merge, (B) fix table. Both specific and actionable.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (C) too vague, (D) linked list doesn&rsquo;t help, (E) out of scope.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B) &mdash; optimal set.</div>`
          }
        },
        summaryJudging: 'O(n) shift bottleneck, misleading space column',
        summarySteering: 'Burst analysis + batch-merge proposal; fix space column'
      },
      { // Cycle 2
        aiUpdate: {
          html: `<div class="code-block">MODULE SortedSensorBuffer:
    buffer = []
    batch_queue = []

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        if len(batch_queue) &gt;= BATCH_THRESHOLD or time_since_last_flush &gt; 50ms:
            flush()

    FUNCTION flush():
        sort(batch_queue)                     // O(b log b)
        buffer = merge(buffer, batch_queue)   // O(n + b)
        batch_queue = []
        evict_old(buffer)

    FUNCTION poll():
        flush()
        return copy(buffer)</div>
<p class="text-sm" style="margin-top:8px"><strong>Burst Analysis (b=2,500, n=25,000):</strong></p>
<ul class="text-sm" style="padding-left:20px;margin-top:4px">
<li>Old: 2,500 &times; O(25,000) = O(62.5M)</li>
<li>New: O(2,500 log 2,500) + O(27,500) = ~O(30,000)</li>
</ul>
<table class="comparison-table" style="margin-top:12px"><thead><tr><th>Criterion</th><th>Batch Merge (chosen)</th><th>Pure Insertion</th><th>Full Re-sort</th></tr></thead>
<tbody>
<tr><td>Time (per batch)</td><td>O(b log b + n)</td><td>O(b &times; n)</td><td>O((n+b) log(n+b))</td></tr>
<tr><td>Auxiliary Space</td><td>O(b) batch queue</td><td>O(1)</td><td>O(log(n+b)) stack</td></tr>
<tr><td>Latency</td><td>Amortized low</td><td>Low per-item, spikes high</td><td>High per-batch</td></tr>
</tbody></table>`,
          summary: 'Batch-merge with batch_queue. O(b log b + n). Burst: ~30K ops (arithmetic error). BATCH_THRESHOLD unspecified.'
        },
        judging: {
          options: [
            { letter: 'A', text: 'Burst arithmetic is wrong: O(2500 log 2500)+O(27500) &asymp; 55,700, not ~30,000', correct: true },
            { letter: 'B', text: 'BATCH_THRESHOLD has no specified value or justification', correct: true },
            { letter: 'C', text: 'evict_old scans full buffer &mdash; only the front needs checking since it&rsquo;s timestamp-sorted', correct: true },
            { letter: 'D', text: 'Batch merge approach is fundamentally wrong for streaming data', correct: false }
          ],
          studentSelections: [0, 1],
          doneSelected: false,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>Correctly identified:</strong> (A) arithmetic error, (B) unspecified threshold.</div>
<div class="criticism" style="margin-top:6px"><strong>Missed:</strong> (C) evict_old scans full buffer; only front needs removal &mdash; O(k) not O(n).</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (D) batch merge IS valid for streaming data.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B), (C).</div>`
          }
        },
        steering: {
          options: [
            { letter: 'A', text: '&ldquo;Fix burst arithmetic: show step-by-step operation counts for b=2,500, n=25,000.&rdquo;', correct: true },
            { letter: 'B', text: '&ldquo;Specify BATCH_THRESHOLD with justification based on polling frequency and traffic rate.&rdquo;', correct: true },
            { letter: 'C', text: '&ldquo;The solution looks good, just clean up the formatting.&rdquo;', correct: false },
            { letter: 'D', text: '&ldquo;Rewrite using a heap instead of a sorted array.&rdquo;', correct: false }
          ],
          studentSelections: [0, 1],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Correctly selected:</strong> (A) fix arithmetic, (B) specify threshold. Specific and targeted.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (C) too vague, (D) unnecessary rewrite.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B) &mdash; optimal.</div>`
          }
        },
        summaryJudging: 'Arithmetic error in burst analysis, unspecified BATCH_THRESHOLD',
        summarySteering: 'Fix arithmetic; specify BATCH_THRESHOLD with justification'
      },
      { // Cycle 3 — student marks done
        aiUpdate: {
          html: `<div class="code-block">MODULE SortedSensorBuffer:
    BATCH_THRESHOLD = 500  // ~1 second of normal traffic
    FLUSH_INTERVAL = 200ms

    buffer = []
    batch_queue = []

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        if len(batch_queue) &gt;= BATCH_THRESHOLD or time_since_last_flush &gt; FLUSH_INTERVAL:
            flush()

    FUNCTION flush():
        merge_sort(batch_queue)
        buffer = merge(buffer, batch_queue)
        batch_queue = []
        evict_old(buffer)

    FUNCTION poll():
        if batch_queue is not empty: flush()
        return copy(buffer)</div>
<p class="text-sm" style="margin-top:8px"><strong>Corrected Burst Analysis (b=2,500, n=25,000):</strong></p>
<ul class="text-sm" style="padding-left:20px;margin-top:4px">
<li>merge_sort(batch): 2,500 &times; 11.3 = ~28,200 comparisons</li>
<li>merge: 25,000 + 2,500 = 27,500 comparisons</li>
<li>Total: ~55,700 operations</li>
<li>Old approach: 62,500,000 operations</li>
<li><strong>Speedup: ~1,122&times;</strong></li>
</ul>`,
          summary: 'Batch-merge, BATCH_THRESHOLD=500, FLUSH_INTERVAL=200ms. Corrected burst: ~55,700 ops. 1,122\u00d7 speedup.'
        },
        judging: {
          options: [
            { letter: 'A', text: 'evict_old still scans full buffer &mdash; could be O(k) with a deque or front-pointer', correct: true },
            { letter: 'B', text: 'Entire approach is wrong &mdash; should use a database instead', correct: false },
            { letter: 'C', text: 'Hash function not specified for sensor lookup', correct: false }
          ],
          studentSelections: [],
          doneSelected: true,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>Assessment:</strong> Marking as complete was reasonable but missed (A) evict_old still scans full buffer when only front needs removal.</div>
<div class="better-alt" style="margin-top:6px"><strong>Better:</strong> Select (A) and send one more correction before marking complete.</div>`
          }
        },
        steering: null,
        summaryJudging: 'Student marked solution as complete',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'B', judging: 'B', steering: 'A' },
      summary: 'Strong steering &mdash; corrections were specific and well-targeted. Framing missed the stability tiebreaker (sensor_id). Judging: consistently caught primary issues but missed secondary concerns (poll() copy cost, eviction optimization). Try &ldquo;what else could be wrong?&rdquo; after finding the first issue.'
    }
  },

  oe: {
    aiSolution: {
      html: `<div class="code-block">MODULE SortedSensorBuffer:
    buffer = []
    batch_queue = []
    BATCH_THRESHOLD = 500

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        if len(batch_queue) &gt;= BATCH_THRESHOLD or time_since_last_flush &gt; 50ms:
            flush()

    FUNCTION flush():
        sort(batch_queue, key=timestamp)
        buffer = merge(buffer, batch_queue)
        batch_queue = []
        evict_old(buffer)

    FUNCTION poll():
        if batch_queue: flush()
        return copy(buffer)  // immutable snapshot</div>`,
      summary: 'Batch-merge with queue. BATCH_THRESHOLD=500. Immutable snapshot on poll().'
    },
    framing: {
      hint: 'The raw problem is intentionally incomplete. Add refinement sections below &mdash; assumptions, constraints, clarifications &mdash; to turn it into a well-defined task.',
      sections: [
        { name: 'Assumptions: Sort Key &amp; Ordering', text: 'Primary sort key is timestamp (chronological ordering for the dashboard). Use sensor_id as secondary key for stability when timestamps collide. Readings may arrive slightly out of order due to network jitter.' },
        { name: 'Constraints: Scale &amp; Performance', text: 'Estimate 200-500 sensors, producing 200-500 tuples/sec normally. &ldquo;Spikes&rdquo; = 3-5x normal rate (1,000-2,500 tuples/sec). Buffer covers 60-second sliding window (~30,000 entries at peak). Poll latency must stay under 50ms.' },
        { name: 'Clarification: Output Format', text: 'Dashboard needs the full sorted buffer (not top-k). Output should be an immutable snapshot &mdash; no concurrent modification during poll reads.' }
      ],
      feedback: {
        grade: 'A',
        html: `<div class="criticism"><strong>Strengths:</strong> Excellent framing. Identified sort key with stability tiebreaker, quantified scale and spike rate, specified buffer window, defined poll latency requirements, and addressed snapshot semantics.</div>
<div class="criticism" style="margin-top:6px"><strong>Minor gap:</strong> Could specify how far out of order readings may arrive (e.g., max 5 seconds of jitter).</div>
<div class="better-alt" style="margin-top:6px"><strong>Enhancement:</strong> Add a &ldquo;Success Metrics&rdquo; section with concrete performance targets (e.g., 99th percentile ingest latency &lt; 2ms under burst).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          sections: [
            { name: 'Issue: Burst performance not analyzed', text: 'The AI chose batch-merge but never analyzed the worst-case cost during a burst. With b=2,500 and n=25,000, no actual numbers are provided. The comparison table also lacks burst-scenario analysis.' },
            { name: 'Issue: BATCH_THRESHOLD justification missing', text: 'BATCH_THRESHOLD = 500 is stated but never justified. Why 500? How does it relate to the dashboard&rsquo;s 200ms polling interval?' },
            { name: 'Issue: poll() full-copy overhead', text: 'poll() returns copy(buffer) &mdash; copying ~30,000 entries every 200ms. At 5 polls/sec, that&rsquo;s 150,000 entry copies/sec. Consider copy-on-write semantics.' }
          ],
          doneSelected: false,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Excellent analysis.</strong> Identified three real issues: missing burst analysis (critical), unjustified threshold (moderate), and poll() copy overhead (valid).</div>
<div class="criticism" style="margin-top:6px"><strong>Minor miss:</strong> evict_old() scans the full buffer but only needs to remove from the front &mdash; O(n) vs O(k) optimization.</div>`
          }
        },
        steering: {
          sections: [
            { name: 'Instruction: Add burst performance analysis', text: 'Calculate exact operation counts for a burst of b=2,500 into buffer of n=25,000. Compare old approach (per-item insertion) vs. batch-merge. Show the speedup factor.' },
            { name: 'Instruction: Justify BATCH_THRESHOLD', text: 'Provide reasoning for BATCH_THRESHOLD = 500. Relate it to normal traffic rate, dashboard polling frequency (200ms), and the tradeoff between latency and merge efficiency.' }
          ],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Well-targeted steering.</strong> Both instructions directly address the two most critical issues with specific context.</div>
<div class="better-alt" style="margin-top:6px"><strong>Enhancement:</strong> Could also address poll() copy issue in this cycle.</div>`
          }
        },
        summaryJudging: 'Missing burst analysis, unjustified threshold, poll() copy overhead',
        summarySteering: 'Add burst performance analysis; justify BATCH_THRESHOLD'
      },
      { // Cycle 2 — student marks done
        aiUpdate: {
          html: `<div class="code-block">MODULE SortedSensorBuffer:
    BATCH_THRESHOLD = 500  // ~1s normal traffic; flush before 200ms poll
    FLUSH_INTERVAL = 150ms // ensures fresh data for 200ms poll cycle

    buffer = deque()       // front-eviction in O(k)
    batch_queue = []
    snapshot = None        // cached immutable copy

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        snapshot = None    // invalidate cache
        if len(batch_queue) &gt;= BATCH_THRESHOLD or elapsed &gt; FLUSH_INTERVAL:
            flush()

    FUNCTION flush():
        merge_sort(batch_queue)              // O(b log b)
        buffer = merge(buffer, batch_queue)  // O(n + b)
        batch_queue = []
        evict_expired(buffer)                // O(k) front removal
        snapshot = None

    FUNCTION poll():
        if batch_queue: flush()
        if snapshot is None:
            snapshot = freeze(buffer)        // O(n) but cached
        return snapshot</div>
<p class="text-sm" style="margin-top:8px"><strong>Burst Analysis (b=2,500, n=25,000):</strong></p>
<ul class="text-sm" style="padding-left:20px;margin-top:4px">
<li>merge_sort(batch): 2,500 &times; 11.3 = ~28,200 comparisons</li>
<li>merge: 25,000 + 2,500 = 27,500 operations</li>
<li>Total: ~55,700 ops vs old approach: 62,500,000</li>
<li><strong>Speedup: ~1,122&times;</strong></li>
</ul>`,
          summary: 'Batch-merge with deque buffer, cached snapshots. BATCH_THRESHOLD=500, FLUSH_INTERVAL=150ms. Burst: ~55,700 ops (1,122\u00d7 speedup).'
        },
        judging: {
          sections: [],
          doneSelected: true,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Appropriate decision.</strong> The solution addresses all critical issues raised. The remaining eviction detail was already fixed. Marking as complete was justified.</div>`
          }
        },
        steering: null,
        summaryJudging: 'Student marked solution as complete',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'A', judging: 'A', steering: 'A' },
      summary: 'Outstanding performance across all three dimensions. Framing was thorough with well-justified assumptions. Judging identified critical issues with quantified analysis. Steering was precise and drove meaningful improvements. Decision to mark done at Cycle 2 was appropriate.'
    }
  }
},

// ══════════════════════════════════════════════════════════════
// CHALLENGE 2: SQL Query Optimization for E-Commerce Analytics
// ══════════════════════════════════════════════════════════════
sql: {
  title: 'Query Optimization for E-Commerce Analytics',
  course: 'Database Systems',
  subject: 'Query Processing &rsaquo; Query Optimization',
  maxCycles: 4,
  rawProblem: 'Write a SQL query that generates a monthly sales performance report for an e-commerce platform. The report should show top-selling products grouped by category, including total revenue, units sold, and average customer rating. The database has &ldquo;millions&rdquo; of transaction records. The query must run &ldquo;quickly enough&rdquo; for an executive dashboard that auto-refreshes. It should &ldquo;handle the holiday rush&rdquo; when order volume peaks.',
  rawProblemShort: 'Monthly sales report SQL query &hellip; top products by category, revenue, ratings. Millions of records, dashboard performance.',

  mc: {
    aiSolution: {
      html: `<div class="code-block">SELECT
    c.category_name,
    p.product_name,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    AVG(r.rating) AS avg_rating
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN reviews r ON p.product_id = r.product_id
WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.category_name, p.product_name
ORDER BY c.category_name, total_revenue DESC;</div>`,
      summary: 'Basic SELECT with JOINs, GROUP BY, ORDER BY. No top-N filter, no index analysis, reviews JOIN unfiltered.'
    },
    framing: {
      hint: 'The problem has vague requirements. Select ALL refinements needed to define the task precisely before the AI writes the query.',
      options: [
        { letter: 'A', text: 'Quantify &ldquo;millions&rdquo; as ~8M orders, ~200K products, ~40 categories', correct: true },
        { letter: 'B', text: 'Define &ldquo;quickly enough&rdquo; as query response under 3 seconds', correct: true },
        { letter: 'C', text: '&ldquo;Top-selling&rdquo; means top 10 per category ranked by revenue', correct: true },
        { letter: 'D', text: 'Assume all queries run against a pre-built materialized view', correct: false },
        { letter: 'E', text: 'Monthly = calendar month; include month-over-month comparison', correct: true },
        { letter: 'F', text: 'Ratings are guaranteed to exist for every product (no NULLs)', correct: false }
      ],
      studentSelections: [0, 2, 4],
      feedback: {
        grade: 'B',
        html: `<div class="criticism"><strong>Correctly selected:</strong> (A) quantifying data volume, (C) top-10 per category, (E) calendar month with comparison.</div>
<div class="criticism" style="margin-top:6px"><strong>Missed:</strong> (B) defining &ldquo;quickly enough&rdquo; &mdash; without a concrete SLA, there&rsquo;s no way to evaluate query performance.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (D) pre-built materialized view over-specifies architecture; (F) ratings are NOT guaranteed for all products.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B), (C), (E).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          options: [
            { letter: 'A', text: 'Missing top-N filter &mdash; returns ALL products per category, not top 10', correct: true },
            { letter: 'B', text: 'Reviews JOIN inflates row count &mdash; AVG(rating) is computed across duplicated rows', correct: true },
            { letter: 'C', text: 'GROUP BY should include product_id for correctness', correct: false },
            { letter: 'D', text: 'No index strategy or execution plan analysis', correct: true },
            { letter: 'E', text: 'Should use NoSQL for this kind of analytics query', correct: false }
          ],
          studentSelections: [0, 3],
          doneSelected: false,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>Correctly identified:</strong> (A) missing top-N filter, (D) no index strategy.</div>
<div class="criticism" style="margin-top:6px"><strong>Missed:</strong> (B) reviews JOIN creates duplicate rows that distort AVG(rating). This is a subtle but critical correctness issue.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (C) GROUP BY is fine with product_name if unique; (E) SQL is appropriate here.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B), (D).</div>`
          }
        },
        steering: {
          options: [
            { letter: 'A', text: '&ldquo;Add ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) to limit to top 10 per category.&rdquo;', correct: true },
            { letter: 'B', text: '&ldquo;Include index recommendations and expected execution plan analysis.&rdquo;', correct: true },
            { letter: 'C', text: '&ldquo;Add more JOINs to include supplier and warehouse information.&rdquo;', correct: false },
            { letter: 'D', text: '&ldquo;Rewrite as a stored procedure for better performance.&rdquo;', correct: false }
          ],
          studentSelections: [0, 1],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Correctly selected:</strong> (A) window function for top-N, (B) index/execution plan. Both targeted and specific.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (C) irrelevant scope expansion, (D) premature optimization.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B) &mdash; optimal set.</div>`
          }
        },
        summaryJudging: 'Missing top-N filter, no index/execution plan',
        summarySteering: 'Add ROW_NUMBER for top-10; include index analysis'
      },
      { // Cycle 2 — student marks done too early
        aiUpdate: {
          html: `<div class="code-block">WITH ranked_products AS (
    SELECT
        c.category_name,
        p.product_name,
        SUM(oi.quantity) AS units_sold,
        SUM(oi.quantity * oi.unit_price) AS total_revenue,
        AVG(r.rating) AS avg_rating,
        ROW_NUMBER() OVER (
            PARTITION BY c.category_id
            ORDER BY SUM(oi.quantity * oi.unit_price) DESC
        ) AS rk
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN reviews r ON p.product_id = r.product_id
    WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY c.category_id, c.category_name,
             p.product_id, p.product_name
)
SELECT * FROM ranked_products
WHERE rk &lt;= 10
ORDER BY category_name, rk;

-- Recommended Indexes:
-- CREATE INDEX idx_orders_date ON orders(order_date);
-- CREATE INDEX idx_oi_order ON order_items(order_id, product_id);</div>`,
          summary: 'CTE with ROW_NUMBER for top-10 per category. Index recommendations added. Reviews JOIN still unfiltered.'
        },
        judging: {
          options: [
            { letter: 'A', text: 'Reviews JOIN still creates duplicate rows &mdash; AVG(rating) is distorted by order volume', correct: true },
            { letter: 'B', text: 'Month-over-month comparison is still missing from requirements', correct: true },
            { letter: 'C', text: 'CTE makes it slower than the original query', correct: false }
          ],
          studentSelections: [],
          doneSelected: true,
          feedback: {
            grade: 'C',
            html: `<div class="criticism"><strong>Premature completion.</strong> Two real issues remain: (A) reviews JOIN distorts ratings &mdash; a row for a product with 100 orders gets 100&times; weight in AVG; (B) month-over-month comparison was a stated requirement.</div>
<div class="better-alt" style="margin-top:6px"><strong>Better:</strong> Select both (A) and (B), then steer the AI to fix them before marking complete.</div>`
          }
        },
        steering: null,
        summaryJudging: 'Student marked solution as complete (premature)',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'B', judging: 'C', steering: 'A' },
      summary: 'Steering was excellent &mdash; corrections were specific and well-chosen. Framing missed the performance SLA definition. Judging was the weakest area: missed the reviews cardinality issue in Cycle 1 and ended prematurely in Cycle 2 with two real issues remaining. Practice identifying all issues before marking a solution complete.'
    }
  },

  oe: {
    aiSolution: {
      html: `<div class="code-block">WITH monthly_sales AS (
    SELECT
        c.category_name,
        p.product_id,
        p.product_name,
        SUM(oi.quantity) AS units_sold,
        SUM(oi.quantity * oi.unit_price) AS total_revenue,
        ROW_NUMBER() OVER (
            PARTITION BY c.category_id
            ORDER BY SUM(oi.quantity * oi.unit_price) DESC
        ) AS rk
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY c.category_id, c.category_name,
             p.product_id, p.product_name
)
SELECT ms.*,
    (SELECT AVG(r.rating) FROM reviews r
     WHERE r.product_id = ms.product_id) AS avg_rating
FROM monthly_sales ms
WHERE rk &lt;= 10
ORDER BY category_name, rk;</div>`,
      summary: 'CTE with ROW_NUMBER for top-10. Correlated subquery for ratings. No index analysis, no month-over-month.'
    },
    framing: {
      hint: 'Add refinement sections to clarify the vague requirements. Each section should address one ambiguity in the raw problem.',
      sections: [
        { name: 'Assumptions: Data Volume &amp; Structure', text: 'Estimate ~8M orders, ~200K products, ~40 categories in a normalized relational schema. Products have at most one category assignment.' },
        { name: 'Constraints: Performance SLA', text: 'Dashboard auto-refreshes every 5 minutes. Query must return in under 3 seconds. Consider indexing strategy for the WHERE clause on order_date.' },
        { name: 'Clarification: Report Scope', text: '&ldquo;Top-selling&rdquo; = top 10 per category by total revenue. Monthly = calendar month. Include comparison with previous month for trend analysis.' }
      ],
      feedback: {
        grade: 'A',
        html: `<div class="criticism"><strong>Thorough framing.</strong> Quantified data volume, defined performance SLA, clarified top-N semantics, and specified month-over-month comparison.</div>
<div class="criticism" style="margin-top:6px"><strong>Minor gap:</strong> Could address how to handle products with no reviews (NULL ratings).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          sections: [
            { name: 'Issue: Correlated subquery for ratings', text: 'The subquery for avg_rating runs once per result row. With 400 rows (10 per category &times; 40 categories), this means 400 separate queries. Should be a pre-aggregated JOIN or CTE.' },
            { name: 'Issue: Missing month-over-month comparison', text: 'Requirements specify month-over-month comparison but query only shows current month data. Need to include previous month in the same result set.' }
          ],
          doneSelected: false,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Excellent analysis.</strong> Both issues are correctly identified with specific, quantified reasoning. The correlated subquery concern is well-explained with row count estimates.</div>`
          }
        },
        steering: {
          sections: [
            { name: 'Instruction: Replace correlated subquery', text: 'Create a ratings CTE that computes AVG(rating) per product_id once, then LEFT JOIN it to the main query. This eliminates the per-row subquery.' },
            { name: 'Instruction: Add previous month comparison', text: 'Add a second CTE for previous month data. Final SELECT should include both current and previous month revenue with a percent-change column.' }
          ],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Well-targeted.</strong> Both instructions are specific, provide clear implementation guidance, and directly address the identified issues.</div>`
          }
        },
        summaryJudging: 'Correlated subquery performance issue, missing month-over-month',
        summarySteering: 'Replace correlated subquery with CTE; add previous month comparison'
      },
      { // Cycle 2 — student marks done
        aiUpdate: {
          html: `<div class="code-block">WITH product_ratings AS (
    SELECT product_id, AVG(rating) AS avg_rating,
           COUNT(*) AS review_count
    FROM reviews GROUP BY product_id
),
current_month AS (
    SELECT c.category_name, p.product_id, p.product_name,
           SUM(oi.quantity) AS units_sold,
           SUM(oi.quantity * oi.unit_price) AS revenue,
           ROW_NUMBER() OVER (PARTITION BY c.category_id
               ORDER BY SUM(oi.quantity*oi.unit_price) DESC) AS rk
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY c.category_id, c.category_name, p.product_id, p.product_name
),
prev_month AS (
    SELECT p.product_id,
           SUM(oi.quantity * oi.unit_price) AS prev_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND o.order_date &lt; DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY p.product_id
)
SELECT cm.category_name, cm.product_name, cm.units_sold,
       cm.revenue, pr.avg_rating, pr.review_count,
       pm.prev_revenue,
       ROUND((cm.revenue - pm.prev_revenue) / pm.prev_revenue * 100, 1) AS pct_change
FROM current_month cm
LEFT JOIN product_ratings pr ON cm.product_id = pr.product_id
LEFT JOIN prev_month pm ON cm.product_id = pm.product_id
WHERE cm.rk &lt;= 10
ORDER BY cm.category_name, cm.rk;

-- Indexes: idx_orders_date, idx_oi_order_product</div>`,
          summary: 'Three CTEs: ratings (pre-aggregated), current month, previous month. Percent-change column. Index hints.'
        },
        judging: {
          sections: [],
          doneSelected: true,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>Reasonable completion.</strong> Major issues are resolved. Minor remaining concern: pct_change will error on division by zero when prev_revenue is NULL or 0. A NULLIF or COALESCE guard would be prudent.</div>`
          }
        },
        steering: null,
        summaryJudging: 'Student marked solution as complete',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'A', judging: 'B', steering: 'A' },
      summary: 'Strong overall performance. Framing was thorough with clear SLA definition. Judging correctly identified the two main issues in Cycle 1. Steering provided specific, implementable instructions. Minor deduction on judging: could have caught the division-by-zero edge case in the final output before marking complete.'
    }
  }
},

// ══════════════════════════════════════════════════════════════
// CHALLENGE 3: API Rate Limiter for Banking App
// ══════════════════════════════════════════════════════════════
rateLimiter: {
  title: 'API Rate Limiter for Banking App',
  course: 'Software Engineering',
  subject: 'System Design &rsaquo; API Design &amp; Security',
  maxCycles: 4,
  rawProblem: 'Design a rate limiter middleware for a REST API serving a mobile banking application. The limiter should prevent abuse while allowing legitimate users to perform normal operations like checking balances multiple times. The system handles &ldquo;heavy traffic&rdquo; and must be &ldquo;highly available.&rdquo; Provide pseudocode for the middleware, compare at least two rate-limiting algorithms, and explain your storage choice.',
  rawProblemShort: 'Rate limiter middleware for banking API &hellip; prevent abuse, allow legitimate use. Heavy traffic, highly available.',

  mc: {
    aiSolution: {
      html: `<div class="code-block">MIDDLEWARE RateLimiter:
    limits = {
        "/auth":     {max: 5,  window: 60},
        "/balance":  {max: 60, window: 60},
        "/transfer": {max: 10, window: 60},
        "default":   {max: 30, window: 60}
    }
    store = {}  // in-memory dictionary

    FUNCTION handle(request):
        key = request.user_id + ":" + request.endpoint
        limit = limits[request.endpoint] OR limits["default"]

        current = store.get(key, {count: 0, start: now()})
        if now() - current.start &gt; limit.window:
            current = {count: 0, start: now()}

        current.count += 1
        store[key] = current

        if current.count &gt; limit.max:
            return Response(429, {"Retry-After": ...})

        return next(request)</div>
<p class="text-sm" style="margin-top:8px"><strong>Algorithm Comparison:</strong></p>
<table class="comparison-table"><thead><tr><th>Criterion</th><th>Fixed Window (chosen)</th><th>Token Bucket</th></tr></thead>
<tbody>
<tr><td>Accuracy</td><td>Can allow 2&times; limit at boundaries</td><td>Smooth, no boundary issues</td></tr>
<tr><td>Memory</td><td>O(1) per key</td><td>O(1) per key</td></tr>
<tr><td>Complexity</td><td>Simple</td><td>Moderate</td></tr>
</tbody></table>`,
      summary: 'Fixed window counter, in-memory store. Per-endpoint limits. Comparison with token bucket.'
    },
    framing: {
      hint: 'The problem has several ambiguities. Select ALL refinements needed to properly scope the rate limiter design.',
      options: [
        { letter: 'A', text: 'Quantify &ldquo;heavy traffic&rdquo; as ~10,000 req/sec globally, ~100 req/min per user', correct: true },
        { letter: 'B', text: 'Different rate limits per endpoint type (auth: strict, balance: relaxed, transfer: moderate)', correct: true },
        { letter: 'C', text: '&ldquo;Highly available&rdquo; = limiter failure should fail-open (allow traffic) rather than block', correct: true },
        { letter: 'D', text: 'All endpoints should have identical rate limits for simplicity', correct: false },
        { letter: 'E', text: 'Return HTTP 429 with Retry-After header when rate-limited', correct: true },
        { letter: 'F', text: 'Store rate limit state in application memory only (no shared storage needed)', correct: false }
      ],
      studentSelections: [0, 1, 4],
      feedback: {
        grade: 'B',
        html: `<div class="criticism"><strong>Correctly selected:</strong> (A) traffic quantification, (B) per-endpoint limits, (E) HTTP 429 + Retry-After.</div>
<div class="criticism" style="margin-top:6px"><strong>Missed:</strong> (C) fail-open behavior &mdash; critical for a banking app where blocking all traffic is worse than allowing some abuse.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (D) identical limits ignores endpoint sensitivity; (F) local-only memory won&rsquo;t work with multiple API servers.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B), (C), (E).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          options: [
            { letter: 'A', text: 'Fixed window counter allows 2&times; burst at window boundaries (boundary attack)', correct: true },
            { letter: 'B', text: 'In-memory store won&rsquo;t work with multiple API servers &mdash; needs shared storage', correct: true },
            { letter: 'C', text: 'No cleanup of expired entries in the store &mdash; memory will grow unbounded', correct: true },
            { letter: 'D', text: 'Per-endpoint rate limits add unnecessary complexity', correct: false },
            { letter: 'E', text: 'Should use JWT tokens instead of rate limiting', correct: false }
          ],
          studentSelections: [0, 1],
          doneSelected: false,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>Correctly identified:</strong> (A) boundary attack vulnerability, (B) shared storage needed.</div>
<div class="criticism" style="margin-top:6px"><strong>Missed:</strong> (C) no expiry/cleanup leads to memory leak. Important for long-running services.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (D) per-endpoint limits are a requirement; (E) JWT and rate limiting serve different purposes.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B), (C).</div>`
          }
        },
        steering: {
          options: [
            { letter: 'A', text: '&ldquo;Replace fixed window with sliding window log or token bucket to prevent boundary attacks.&rdquo;', correct: true },
            { letter: 'B', text: '&ldquo;Use Redis as shared storage with TTL for automatic expiry and cleanup.&rdquo;', correct: true },
            { letter: 'C', text: '&ldquo;Just increase rate limits so users don&rsquo;t get blocked.&rdquo;', correct: false },
            { letter: 'D', text: '&ldquo;Add IP-based blocking instead of user-based limiting.&rdquo;', correct: false }
          ],
          studentSelections: [0, 1],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Correctly selected:</strong> (A) better algorithm, (B) Redis with TTL. Both address root causes.</div>
<div class="criticism" style="margin-top:6px"><strong>Correctly avoided:</strong> (C) doesn&rsquo;t fix the problem; (D) different concern entirely.</div>
<div class="better-alt" style="margin-top:6px"><strong>Ideal:</strong> (A), (B) &mdash; optimal.</div>`
          }
        },
        summaryJudging: 'Boundary attack vulnerability, needs shared storage',
        summarySteering: 'Use sliding window/token bucket; add Redis with TTL'
      },
      { // Cycle 2 — student marks done
        aiUpdate: {
          html: `<div class="code-block">MIDDLEWARE RateLimiter:
    redis = RedisClient(cluster_mode=true)
    limits = { ... per-endpoint as before ... }

    FUNCTION handle(request):
        key = request.user_id + ":" + classify(request.endpoint)
        limit = get_limit(request.endpoint)

        // Sliding window log
        now_ms = current_timestamp_ms()
        window_start = now_ms - (limit.window * 1000)

        PIPELINE:
            redis.ZREMRANGEBYSCORE(key, 0, window_start)
            redis.ZADD(key, now_ms, unique_id())
            count = redis.ZCARD(key)
            redis.EXPIRE(key, limit.window)

        if count &gt; limit.max:
            retry_after = compute_retry_after(key, limit)
            return Response(429, {"Retry-After": retry_after})

        return next(request)</div>
<p class="text-sm" style="margin-top:8px"><strong>Updated Comparison:</strong></p>
<table class="comparison-table"><thead><tr><th>Criterion</th><th>Sliding Window Log (chosen)</th><th>Token Bucket</th><th>Fixed Window</th></tr></thead>
<tbody>
<tr><td>Accuracy</td><td>Exact &mdash; no boundary issues</td><td>Smooth, approximate</td><td>2&times; burst at edges</td></tr>
<tr><td>Memory</td><td>O(n) per user per window</td><td>O(1) per user</td><td>O(1) per user</td></tr>
<tr><td>Complexity</td><td>Moderate (sorted sets)</td><td>Moderate</td><td>Simple</td></tr>
<tr><td>Distributed</td><td>Redis sorted sets</td><td>Redis + Lua</td><td>Redis counter</td></tr>
</tbody></table>`,
          summary: 'Sliding window log with Redis sorted sets. Pipeline for atomicity. TTL for auto-cleanup. Updated comparison table.'
        },
        judging: {
          options: [
            { letter: 'A', text: 'No fail-open behavior &mdash; Redis outage will crash the middleware or block all traffic', correct: true },
            { letter: 'B', text: 'Sliding window log uses O(n) memory per user &mdash; heavy users consume significant Redis memory', correct: true },
            { letter: 'C', text: 'Redis is too slow for rate limiting at scale', correct: false }
          ],
          studentSelections: [],
          doneSelected: true,
          feedback: {
            grade: 'C',
            html: `<div class="criticism"><strong>Premature completion.</strong> Two issues remain: (A) no fail-open &mdash; critical for a banking app; if Redis goes down, all requests are blocked. (B) O(n) memory per user could be costly at scale &mdash; token bucket would be O(1).</div>
<div class="better-alt" style="margin-top:6px"><strong>Better:</strong> Select (A) at minimum and steer the AI to add try/catch with fail-open behavior.</div>`
          }
        },
        steering: null,
        summaryJudging: 'Student marked solution as complete (premature)',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'B', judging: 'C', steering: 'A' },
      summary: 'Steering was strong &mdash; well-targeted corrections drove real improvements. Framing missed the fail-open requirement. Judging: caught core issues in Cycle 1 but ended prematurely in Cycle 2, missing the critical fail-open behavior and the memory cost concern. For production systems, always consider failure modes before marking complete.'
    }
  },

  oe: {
    aiSolution: {
      html: `<div class="code-block">MIDDLEWARE RateLimiter:
    redis = RedisClient(cluster_mode=true)
    limits = {
        "auth":     {max: 5,  window: 60, refill_rate: 1},
        "balance":  {max: 60, window: 60, refill_rate: 10},
        "transfer": {max: 10, window: 60, refill_rate: 2},
        "default":  {max: 30, window: 60, refill_rate: 5}
    }

    FUNCTION handle(request):
        key = user_id + ":" + classify(endpoint)
        limit = get_limit(endpoint)

        // Token bucket via Redis
        bucket = redis.HGETALL(key)
        if bucket is empty:
            bucket = {tokens: limit.max, last_refill: now()}

        elapsed = now() - bucket.last_refill
        refill = floor(elapsed / (limit.window / limit.max))
        bucket.tokens = min(limit.max, bucket.tokens + refill)
        bucket.last_refill = now()

        if bucket.tokens &lt;= 0:
            return Response(429, {"Retry-After": ...})

        bucket.tokens -= 1
        redis.HMSET(key, bucket)
        redis.EXPIRE(key, limit.window * 2)
        return next(request)</div>`,
      summary: 'Token bucket with Redis HASH. Per-endpoint limits with refill rates. Non-atomic read-modify-write.'
    },
    framing: {
      hint: 'Add sections clarifying the ambiguities in the problem. Each section should refine one vague aspect.',
      sections: [
        { name: 'Constraints: Traffic Estimates', text: 'Global throughput ~10,000 req/sec. Per-user soft limits vary by endpoint: auth 5/min, balance 60/min, transfers 10/min. Normal users hit ~20% of limits.' },
        { name: 'Assumptions: Endpoint Tiers', text: 'Endpoints are classified into tiers: critical (transfers, payments), standard (balance, history), and auth (login, OTP). Each tier has separate rate limit parameters.' },
        { name: 'Clarification: Failure Behavior', text: '&ldquo;Highly available&rdquo; means the rate limiter should fail-open: if the storage backend is unreachable, allow requests through and log a warning rather than blocking legitimate users.' }
      ],
      feedback: {
        grade: 'A',
        html: `<div class="criticism"><strong>Excellent framing.</strong> Quantified traffic, defined endpoint tiers, and &mdash; critically &mdash; specified fail-open behavior. The failure behavior clarification demonstrates strong systems thinking.</div>
<div class="criticism" style="margin-top:6px"><strong>Minor gap:</strong> Could specify burst tolerance per tier (e.g., allow 2&times; limit for 5 seconds on balance checks).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          sections: [
            { name: 'Issue: Race condition in token bucket', text: 'Read-modify-write on the Redis HASH is not atomic. Two concurrent requests could both read tokens=1, both decrement, and both pass &mdash; allowing 2&times; the limit. Needs Redis MULTI/EXEC or Lua script.' },
            { name: 'Issue: No fail-open behavior', text: 'If Redis is unavailable, the middleware will throw an exception or hang. Should wrap Redis calls in try/catch and fail-open on errors, as specified in our framing.' },
            { name: 'Issue: Missing algorithm comparison', text: 'Requirements ask for comparison of at least two algorithms. Only token bucket is implemented; no comparison table provided.' }
          ],
          doneSelected: false,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Thorough analysis.</strong> All three issues are real and well-described. The race condition explanation with a concrete example (tokens=1, two concurrent requests) is particularly strong.</div>`
          }
        },
        steering: {
          sections: [
            { name: 'Instruction: Fix atomicity with Lua script', text: 'Wrap the read-modify-write in a Redis Lua script (EVAL) so the entire bucket check-and-decrement is atomic. This prevents the race condition.' },
            { name: 'Instruction: Add fail-open try/catch', text: 'Wrap all Redis operations in try/catch. On any Redis error, log a warning with the user_id and endpoint, then allow the request through (fail-open).' },
            { name: 'Instruction: Add comparison table', text: 'Include a comparison table: token bucket vs sliding window log vs fixed window. Compare on accuracy, memory, complexity, and distributed suitability.' }
          ],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Precise and comprehensive.</strong> All three instructions directly address the identified issues with specific implementation guidance. The Lua script suggestion is the right approach for Redis atomicity.</div>`
          }
        },
        summaryJudging: 'Race condition, no fail-open, missing comparison table',
        summarySteering: 'Fix atomicity with Lua; add fail-open; add algorithm comparison'
      },
      { // Cycle 2 — student marks done
        aiUpdate: {
          html: `<div class="code-block">MIDDLEWARE RateLimiter:
    redis = RedisClient(cluster_mode=true)
    limits = { ... per-endpoint tiers ... }

    LUA_SCRIPT = """
        local key = KEYS[1]
        local max = tonumber(ARGV[1])
        local refill = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local window = tonumber(ARGV[4])
        local bucket = redis.call('HGETALL', key)
        -- ... atomic check, refill, decrement ...
        if tokens &lt;= 0 then return 0 end
        tokens = tokens - 1
        redis.call('HMSET', key, 'tokens', tokens, 'last', now)
        redis.call('EXPIRE', key, window * 2)
        return tokens
    """

    FUNCTION handle(request):
        key = user_id + ":" + classify(endpoint)
        limit = get_limit(endpoint)
        TRY:
            remaining = redis.EVAL(LUA_SCRIPT, key, limit.max,
                                    limit.refill_rate, now(), limit.window)
            if remaining &lt; 0:
                return Response(429, {"Retry-After": compute_wait(limit)})
        CATCH RedisError:
            log.warn("Rate limiter unavailable, failing open", user_id)
            // fail-open: allow the request
        return next(request)</div>
<table class="comparison-table" style="margin-top:12px"><thead><tr><th>Algorithm</th><th>Accuracy</th><th>Memory</th><th>Complexity</th><th>Distributed</th></tr></thead>
<tbody>
<tr><td><strong>Token Bucket</strong> (chosen)</td><td>Smooth, allows bursts up to max</td><td>O(1) per user</td><td>Moderate (Lua)</td><td>Redis HASH + Lua</td></tr>
<tr><td>Sliding Window Log</td><td>Exact</td><td>O(n) per user per window</td><td>Moderate (sorted sets)</td><td>Redis ZSET</td></tr>
<tr><td>Fixed Window</td><td>2&times; burst at boundaries</td><td>O(1) per user</td><td>Simple</td><td>Redis INCR</td></tr>
</tbody></table>`,
          summary: 'Atomic token bucket via Lua script. Fail-open on Redis errors. Algorithm comparison table added.'
        },
        judging: {
          sections: [],
          doneSelected: true,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>Good decision to complete.</strong> All three issues from Cycle 1 are addressed: atomicity via Lua script, fail-open with logging, and a comprehensive comparison table. The solution is production-ready.</div>`
          }
        },
        steering: null,
        summaryJudging: 'Student marked solution as complete',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'A', judging: 'A', steering: 'A' },
      summary: 'Exceptional performance. Framing demonstrated strong systems thinking with the fail-open requirement. Judging was thorough &mdash; caught the race condition, missing fail-open, and missing comparison in one pass. Steering was precise with actionable implementation details. Appropriate completion decision after all issues were resolved.'
    }
  }
}

}; // end CHALLENGES


// ══════════════════════════════════════════════════════════════
// SCENARIO INDEX
// Maps scenario ID → challenge + variant + mode + user persona
// ══════════════════════════════════════════════════════════════

const SCENARIOS = {
  // Sorting Pipeline
  'sorting-mc-practice':     { challengeId: 'sorting',     responseType: 'mc', mode: 'practice',   user: { name: 'Noa R.',   initials: 'NR' } },
  'sorting-mc-assessment':   { challengeId: 'sorting',     responseType: 'mc', mode: 'assessment', user: { name: 'Noa R.',   initials: 'NR' } },
  'sorting-oe-practice':     { challengeId: 'sorting',     responseType: 'oe', mode: 'practice',   user: { name: 'Maria S.', initials: 'MS' } },
  'sorting-oe-assessment':   { challengeId: 'sorting',     responseType: 'oe', mode: 'assessment', user: { name: 'Maria S.', initials: 'MS' } },

  // SQL Query Optimization
  'sql-mc-practice':         { challengeId: 'sql',         responseType: 'mc', mode: 'practice',   user: { name: 'Noa R.',   initials: 'NR' } },
  'sql-mc-assessment':       { challengeId: 'sql',         responseType: 'mc', mode: 'assessment', user: { name: 'Noa R.',   initials: 'NR' } },
  'sql-oe-practice':         { challengeId: 'sql',         responseType: 'oe', mode: 'practice',   user: { name: 'Yael K.',  initials: 'YK' } },
  'sql-oe-assessment':       { challengeId: 'sql',         responseType: 'oe', mode: 'assessment', user: { name: 'Yael K.',  initials: 'YK' } },

  // API Rate Limiter
  'ratelimiter-mc-practice':   { challengeId: 'rateLimiter', responseType: 'mc', mode: 'practice',   user: { name: 'Dan M.',   initials: 'DM' } },
  'ratelimiter-mc-assessment': { challengeId: 'rateLimiter', responseType: 'mc', mode: 'assessment', user: { name: 'Dan M.',   initials: 'DM' } },
  'ratelimiter-oe-practice':   { challengeId: 'rateLimiter', responseType: 'oe', mode: 'practice',   user: { name: 'Lina A.',  initials: 'LA' } },
  'ratelimiter-oe-assessment': { challengeId: 'rateLimiter', responseType: 'oe', mode: 'assessment', user: { name: 'Lina A.',  initials: 'LA' } },
};
