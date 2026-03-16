# Session 5 — Autocomplete Index (Open-Ended)

**Challenge:** Data Structures > Hash Tables > Collision Resolution
**Mode:** Open-Ended (Structured Sections)
**Student:** Lior A.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Build a hash-table-backed index that supports prefix-based autocomplete for a product catalog. Given a user's partial query string, the index should return the top results "instantly." Deliver the hash function design, the collision resolution strategy, the insertion algorithm, the lookup algorithm, and a complexity analysis. The catalog has "millions" of products and the index must support "frequent updates" as products are added and removed.

### Student's Framing Response

> **Assumption: "Millions" of products means roughly 1-10 million entries. I'll design for 5 million as a baseline.**
>
> **Assumption: "Instantly" means O(1) average lookup time per query, which is the hash table's strength.**
>
> **Constraint: "Frequent updates" means the table must handle insertions and deletions efficiently — a static perfect hash won't work.**
>
> **Question: "Top results" implies some ranking — I'll assume products have a popularity score and we return the top-k most popular matches.**

### AI Solution (Generated from Student's Framing)

```
HASH TABLE DESIGN:

Hash Function:
    h(key) = (sum of ASCII values of key characters * 31^i) mod table_size
    // Polynomial rolling hash

Collision Resolution: Separate chaining with linked lists

Table Size: Next prime after 2 * num_products (load factor ~0.5)

FUNCTION insert(product):
    key = product.name.lowercase()
    idx = h(key)
    table[idx].append(product)

FUNCTION delete(product):
    key = product.name.lowercase()
    idx = h(key)
    table[idx].remove(product)

FUNCTION autocomplete(prefix, k):
    // Hash the prefix and look up the chain
    idx = h(prefix)
    results = []
    for item in table[idx]:
        if item.name.startswith(prefix):
            results.append(item)
    results.sort_by(popularity, descending)
    return results[:k]
```

**Complexity:**
- Insert: O(1) average
- Delete: O(chain_length) average
- Autocomplete: O(chain_length + r log r) where r = number of matches

### Framing Feedback

**Criticism:** The student correctly quantified the scale, noted that static hashing won't work for frequent updates, and identified the ranking dimension. However, the student made a critical conceptual error in the framing: they assumed O(1) lookup per query is the hash table's strength for *prefix* search. A standard hash table hashes **exact keys**, not prefixes — looking up "app" in a hash table won't find "apple" and "application" because they hash to different buckets. The student did not identify this fundamental mismatch between prefix-based lookup and hash table access patterns. This is the central tension of the problem.

**Better Alternative Framing:**
> "Tension: A hash table provides O(1) lookup for exact keys, but prefix search requires finding all keys that START with a given string — these hash to different buckets. Question: Should we hash every possible prefix of each product name, creating multiple entries per product? Or use a hybrid structure? This tension between the required access pattern and the data structure's natural behavior is the core design challenge."

**Grade: B** — Missed the fundamental mismatch between prefix search and hash table semantics.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Error: The autocomplete function hashes the prefix and"
    description: "Error: The autocomplete function hashes the prefix and looks in that bucket, but products are hashed by their full name."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Fix: The core issue is that hashing the prefix won't"
    description: "Fix: The core issue is that hashing the prefix won't find products whose full names start with that prefix. Redesign the index so that each product is inserted under ALL of its prefixes. For"
  - name: "Add: Discuss the space cost of storing multiple entries"
    description: "Add: Discuss the space cost of storing multiple entries per product and the impact on load factor."

#### Updated AI Output

```
HASH TABLE DESIGN (Revised):

Strategy: Index every prefix of every product name.
For product "apple" with popularity 95:
  Insert into buckets: h("a"), h("ap"), h("app"), h("appl"), h("apple")

Hash Function:
    h(key) = polynomial_rolling_hash(key) mod table_size
    h(s) = (s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]) mod table_size

Collision Resolution: Separate chaining with linked lists.
    Each chain node stores (product_ref, popularity_score).

Table Size:
    Total prefix entries = sum of name lengths across all products
    If avg name length = 15 chars, 5M products -> ~75M prefix entries
    Table size = next prime after 2 * 75M = ~150M slots
    Load factor: ~0.5

FUNCTION insert(product):
    name = product.name.lowercase()
    for i from 1 to len(name):
        prefix = name[0:i]
        idx = h(prefix)
        table[idx].chain.append((product, product.popularity))

FUNCTION delete(product):
    name = product.name.lowercase()
    for i from 1 to len(name):
        prefix = name[0:i]
        idx = h(prefix)
        table[idx].chain.remove_by_product(product)

FUNCTION autocomplete(prefix, k):
    idx = h(prefix.lowercase())
    candidates = table[idx].chain
    // Filter for exact prefix match (handle collisions)
    matches = [item for item in candidates if item.product.name.startswith(prefix)]
    // Sort by popularity
    matches.sort_by(popularity, descending)
    return matches[:k]
```

**Complexity:**
- Insert: O(L) where L = product name length (L prefix insertions, each O(1) amortized)
- Delete: O(L * chain_length) — must search each prefix's chain
- Autocomplete: O(chain_length + r log r) — scan chain, filter, sort top-k

**Space:** O(N * L_avg) where N = number of products, L_avg = average name length. For 5M products, avg length 15: ~75M entries.

#### Judging Feedback

**Criticism:** The student identified the most critical issue — the fundamental mismatch between prefix lookup and exact-key hashing. This was the central insight of the entire problem. The resizing/chain-length concern was also valid. However, the student did not notice that the AI's collision resolution (separate chaining) was stated without justification against alternatives like open addressing. For a table with 75M entries and frequent deletions, chaining vs. open addressing is a meaningful design decision — open addressing handles deletions poorly (tombstones), which favors chaining here.

**Better Alternative Judgement:**
> "Error: Prefix hashing is fundamentally broken — products hash by full name, not by prefix. Gap: No resize policy or chain-length analysis. Gap: Separate chaining chosen without justification — why not open addressing? (Answer: deletions favor chaining, but this should be stated.)"

**Grade: A** — Caught the critical design flaw. Missed the collision resolution justification.

#### Steering Feedback

**Criticism:** The student's prefix-indexing suggestion was exactly right and well-specified. Listing concrete prefixes for "apple" made the approach unambiguous. Asking for space cost analysis was also well-targeted. One gap: the student could have asked for a comparison between chaining and open addressing given the deletion-heavy workload.

**Grade: A** — Precise, correct, and transformative fix.

---

### Cycle 2

**Current AI Output:** *(prefix-indexed version above)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Gap"
    description: "No resize policy"

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student sends correction:

instructions:
  - name: "Add: Discuss the worst-case chain length for short"
    description: "Add: Discuss the worst-case chain length for short prefixes (e.g.,"
  - name: "Add: Define a resize policy"
    description: "Add: Define a resize policy — specify the load factor threshold that triggers rehashing, and state the amortized cost of resize operations."

#### Updated AI Output

*(AI adds the following analysis)*

```
CHAIN LENGTH ANALYSIS:
    Prefix "a": if 10% of 5M products start with 'a' -> 500K entries in chain
    Prefix "ap": much smaller, maybe 50K
    Prefix "app": ~5K
    Prefix "appl": ~500
    Prefix "apple": ~50

    Short prefixes have very long chains. Autocomplete("a", 10) scans 500K entries.

MITIGATION:
    Option 1: Set a minimum prefix length (e.g., 3 chars) for autocomplete.
    Option 2: Keep each chain sorted by popularity and only store top-M entries per prefix.
              Insert: maintain sorted order, evict if chain exceeds M.
              Lookup: return first k entries, no sorting needed -> O(k).

RESIZE POLICY:
    Monitor global load factor = total_entries / table_size
    When load factor > 0.75:
        new_table_size = next_prime(2 * table_size)
        Rehash all entries: O(total_entries)
        Amortized over insertions: O(1) per insert (doubling argument)
    When load factor < 0.2 (after many deletions):
        Shrink table to save memory.
```

**Revised Complexity:**
- Insert: O(L) amortized (O(L * table_size) worst case during rehash)
- Delete: O(L * chain_length) worst case
- Autocomplete: O(k) with top-M optimization, O(chain_length) without

#### Judging Feedback

**Criticism:** The student correctly identified the short-prefix chain length explosion — this is a practical concern that separates a textbook answer from a deployable design. The resize policy question was also well-placed. However, the student missed that the AI's separate chaining choice is never explicitly justified against open addressing. Given the high insertion/deletion rate, chaining is the right choice (open addressing requires tombstones for deletions, which degrade performance), but this reasoning should be stated. The student also did not question whether a hash table is even the best data structure for this problem — a trie would provide natural prefix support without the multi-entry overhead.

**Better Alternative Judgement:**
> "Gap: Short-prefix chains are huge — '(a)' chain could be 500K. Gap: No resize policy. Gap: Chaining vs open addressing not justified. Meta: Is a hash table the right structure? A trie supports prefix search natively without storing every prefix."

**Grade: A** — Good practical concerns, missed collision strategy justification and the trie alternative question.

#### Steering Feedback

**Criticism:** The chain length analysis request was well-targeted and produced useful design mitigation options. The resize policy request was concrete. The student could have pushed for an explicit chaining-vs-open-addressing comparison.

**Grade: A** — Good direction, missed one comparison opportunity.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with chain analysis, top-M optimization, and resize policy)*

#### Judging Sub-step

Student identifies issues:

gaps:
  - name: "Observation: The solution now addresses the major concerns"
    description: "Observation: The solution now addresses the major concerns — prefix indexing, chain length mitigation, resize policy. The top-M optimization for short prefixes is a practical improvement. Minor: The AI never justifies choosing chaining over open addressing, but the design is functional."

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

Student marks: **Done**

---

## COMPLETION

### Final Grades

| Skill    | Grade |
|----------|-------|
| Framing  | B     |
| Judging  | A     |
| Steering | A     |

### Summary Feedback

The central challenge of this problem was recognizing that hash tables don't natively support prefix search — and the student missed this in framing, which led to a fundamentally broken initial solution. However, the student recovered well in judging, catching the exact-key vs prefix mismatch in the first cycle. Subsequent judging correctly identified the short-prefix chain explosion and the missing resize policy. Steering was consistently strong, with the prefix-indexing redesign being particularly well-specified and transformative. The student should improve framing by asking "does this data structure's access pattern match what the problem requires?" before assuming it works. Additionally, when a problem names a specific data structure, consider whether the problem is testing the student's ability to recognize its limitations.
