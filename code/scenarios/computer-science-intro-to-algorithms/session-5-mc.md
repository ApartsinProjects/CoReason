# Session 5 — Autocomplete Index (Multiple Choice)

**Challenge:** Data Structures > Hash Tables > Collision Resolution
**Mode:** Multiple Choice
**Student:** Lior A.

---

## PHASE 1 — FRAMING

### Raw Problem Presented to Student

> Build a hash-table-backed index that supports prefix-based autocomplete for a product catalog. Given a user's partial query string, the index should return the top results "instantly." Deliver the hash function design, the collision resolution strategy, the insertion algorithm, the lookup algorithm, and a complexity analysis. The catalog has "millions" of products and the index must support "frequent updates" as products are added and removed.

### Framing Options Presented

Which assumptions and clarifications best prepare the AI?

- **(A)** Hash each full product name. Use open addressing with linear probing. "Instantly" means O(1). Don't worry about prefix matching — hash tables handle it naturally.
- **(B)** Recognize that hash tables provide exact-key O(1) lookup but prefix search requires finding all keys starting with a string — these hash to different buckets. Propose indexing all prefixes of each product name. Estimate 5M products, avg name length 15 chars = ~75M prefix entries. Note that frequent deletions favor chaining over open addressing.
- **(C)** Scale estimate: 5M products. "Instantly" means O(1) average. Frequent updates mean no static perfect hash. Products have popularity for ranking top-k results.
- **(D)** Use a trie instead of a hash table since tries are better for prefix search. Ignore the hash table requirement.
- **(E)** Hash each product name. Use separate chaining. Table size = 2x product count. The problem is straightforward — just build a normal hash table.

**Student selects: (C)**

### AI Solution (Generated from Student's Framing)

```
Hash Function:
    h(key) = polynomial_rolling_hash(key) mod table_size

Collision Resolution: Separate chaining with linked lists

Table Size: next prime after 2 * 5,000,000 = ~10,000,003

FUNCTION insert(product):
    idx = h(product.name.lowercase())
    table[idx].append(product)

FUNCTION delete(product):
    idx = h(product.name.lowercase())
    table[idx].remove(product)

FUNCTION autocomplete(prefix, k):
    idx = h(prefix)
    results = [item for item in table[idx] if item.name.startswith(prefix)]
    return sorted(results, key=popularity, reverse=True)[:k]
```

**Complexity:** Insert O(1), Delete O(chain), Autocomplete O(chain + r log r)

### Framing Feedback

**Criticism:** Option (C) correctly sets the scale and identifies ranking and update requirements, but completely misses the central tension: hash tables do exact-key lookup, not prefix search. Hashing "app" produces a different bucket than "apple" — so autocomplete("app") won't find "apple". Option (B) was far stronger: it identifies this mismatch, proposes the prefix-indexing strategy, estimates the space blowup, and notes that frequent deletions favor chaining. This is the deepest framing available.

**Better Alternative:** Option **(B)** — identifies the fundamental access-pattern mismatch and proposes a viable solution.

**Grade: B** — Good on scale and updates, but missed the core design challenge.

---

## PHASE 2 — JUDGE + STEER CYCLES

### Cycle 1

**Current AI Output:** *(as shown above)*

#### Judging Sub-step

Which issues exist in the AI's solution?

- **(A)** The hash function is too simple — should use SHA-256 for better distribution
- **(B)** The autocomplete function is fundamentally broken — h("app") != h("apple"), so looking in the bucket for h("app") won't find "apple". The lookup pattern doesn't match hash table semantics.
- **(C)** The autocomplete is broken because prefix hashing doesn't find full-name entries; separate chaining is unjustified; no resize policy; chain length for common prefixes could be enormous
- **(D)** The table size is too small — should be 10x the product count
- **(E)** The algorithm is correct — hash tables support prefix search via the startswith filter

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Scan the entire hash table for products matching the prefix"
- **(B)** "Redesign: insert each product under all of its prefixes. For 'apple', insert at h('a'), h('ap'), h('app'), h('appl'), h('apple'). Lookup for prefix 'app' goes to h('app') and finds all products whose names start with 'app'. Show revised insert, delete, and autocomplete. Analyze the space cost."
- **(C)** "Use a different hash function that groups similar prefixes together"
- **(D)** "Replace the hash table with a trie"
- **(E)** "Add more buckets to reduce collisions"

**Student selects: (B)**

#### Updated AI Output

```
REVISED DESIGN: Index all prefixes of each product name.

Hash Function:
    h(key) = polynomial_rolling_hash(key) mod table_size

Collision Resolution: Separate chaining

Table Size:
    5M products * avg 15 chars = 75M prefix entries
    table_size = next_prime(2 * 75M) = ~150,000,017
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
    matches = [c for c in candidates if c.product.name.startswith(prefix)]
    matches.sort_by(popularity, desc)
    return matches[:k]
```

**Complexity:**
- Insert: O(L) — one hash + chain append per prefix
- Delete: O(L * avg_chain) — scan each prefix's chain
- Autocomplete: O(chain + r log r)
- Space: O(N * L_avg) = ~75M entries for 5M products

#### Judging Feedback

**Criticism:** The student correctly identified the fundamental design flaw — this is the most important issue in the entire solution. However, option (C) was more comprehensive: it also noted that separate chaining is unjustified (why not open addressing?), there's no resize policy, and common-prefix chains could be enormous. These secondary issues matter for a complete design.

**Better Alternative:** Option **(C)** — captures the primary flaw plus three significant secondary issues.

**Grade: B** — Caught the critical flaw, missed secondary design gaps.

#### Steering Feedback

**Criticism:** Option (B) was the best available — it proposed the exact prefix-indexing redesign with concrete examples and asked for space analysis. This was precisely the right fix.

**Grade: A** — Transformative, specific, and correct.

---

### Cycle 2

**Current AI Output:** *(prefix-indexed version above)*

#### Judging Sub-step

Which issues remain?

- **(A)** The design is complete and correct
- **(B)** Short prefixes (e.g., "a") create chains with hundreds of thousands of entries; no resize/rehash policy defined; delete is O(L * chain) which is very expensive for short-prefix chains
- **(C)** Short prefixes create huge chains; no resize policy; chaining is not justified over open addressing
- **(D)** The polynomial hash is too slow — should use a faster hash
- **(E)** Products should be stored in a B-tree instead

**Student selects: (B)**

*(Student's judgement is recorded but NOT sent to AI)*

#### Steering Sub-step

What correction should you send?

- **(A)** "Use a better hash function"
- **(B)** "Analyze chain lengths for short prefixes: prefix 'a' could match 500K+ products. Either set a minimum query length (3 chars) or cap each chain at top-M entries by popularity. Define a resize policy: rehash when load factor exceeds 0.75, with amortized O(1) insert cost."
- **(C)** "Rewrite using open addressing"
- **(D)** "Add multithreading for concurrent access"
- **(E)** "The solution is complete"

**Student selects: (B)**

#### Updated AI Output

```
CHAIN LENGTH ANALYSIS:
    "a": ~500K entries (10% of products)
    "ap": ~50K
    "app": ~5K
    "apple": ~50

    Autocomplete("a", 10) scans 500K entries -> too slow.

MITIGATION: Top-M bounded chains
    Each chain stores at most M = 100 entries, sorted by popularity.
    Insert: if chain full and new product less popular than #100, skip.
           Otherwise insert in sorted position, evict lowest.
    Autocomplete: return first k from chain -> O(k), no sorting needed.

    Tradeoff: may miss newly added low-popularity products for short prefixes.
    Acceptable for autocomplete use case (users want popular results).

RESIZE POLICY:
    Load factor threshold: 0.75
    Resize: double table, rehash all entries
    Amortized insert cost: O(1) per prefix entry, O(L) per product
    Shrink when load factor < 0.2 after bulk deletions
```

**Revised Complexity:**
- Insert: O(L) amortized, O(L * N) worst case (rehash)
- Delete: O(L * min(chain, M))
- Autocomplete: O(k) with top-M optimization
- Space: O(min(N * L_avg, table_size * M))

#### Judging Feedback

**Criticism:** The student identified the short-prefix chain explosion and the missing resize policy — both important practical concerns. However, option (C) also flagged that chaining vs. open addressing is never justified. For a table with frequent deletions, chaining is the right choice because open addressing requires tombstones that degrade probe sequences. This reasoning should be explicit. The student missed this design justification question.

**Better Alternative:** Option **(C)** — also addresses the collision strategy justification.

**Grade: A** — Caught the main practical issues, missed the chaining justification.

#### Steering Feedback

**Criticism:** Option (B) was well-constructed — it specified the problem (short-prefix chains), proposed two mitigations, and defined concrete resize thresholds. This was the best available option.

**Grade: A** — Specific, practical, and actionable.

---

### Cycle 3 (Final)

**Current AI Output:** *(version with top-M chains and resize policy)*

#### Judging Sub-step

Which issues remain?

- **(A)** Chaining is never justified over open addressing — should explain why chaining suits a deletion-heavy workload
- **(B)** The solution is complete and addresses all major design concerns
- **(C)** The hash function needs cryptographic security
- **(D)** The entire approach should be replaced with a trie
- **(E)** The resize policy has incorrect thresholds

**Student selects: (B)**

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

The defining moment of this session was the prefix-search mismatch — the student missed it in framing but caught it clearly in the first judging cycle, recovering well. The prefix-indexing redesign proposed in steering was the correct fix and was specified precisely enough for the AI to implement it correctly. In subsequent cycles, the student identified practical deployment concerns (chain length explosion, resize policy) that elevated the solution from textbook to realistic. The consistent gap was in justifying design choices against alternatives — the student accepted separate chaining without questioning why it was chosen over open addressing. To improve framing, practice asking "what operations does this data structure support natively, and does that match what the problem requires?" before assuming compatibility.
