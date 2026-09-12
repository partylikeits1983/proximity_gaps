# What the Closed PR History Contributes to the 68.07 Research Plan

*Companion to [After 68.06](AFTER-6806-RESEARCH-NOTE.md). Snapshot: 12 September 2026.*

## 1. Scope and evidence

The review covers the complete closed-PR inventory: **554 PRs, of which 104 are merged and 450 are closed without merging**. The six GitHub API pages include the complete submitter notes and head revisions. The repository-wide comment archive contains 1,118 comments, which were matched to PR numbers to distinguish the actual scored claim from the narrative target.

Every PR is represented in the [complete catalogue](pr-history-2026-09-12/INDEX.md). The review screened titles, note headings, method families, and bot outcomes across the inventory, then examined selected mathematical notes and source files in detail. It did **not** independently rebuild or audit the proof body of every PR. The counts below are reproducible classifications of the public record, not new mathematical verification.

| Archive classification | PRs | What it establishes |
|---|---:|---|
| Merged | 104 | GitHub merge state; includes infrastructure PRs. Of these, 76 also have an explicit independent-verification receipt. |
| Closed, with an independent-verification receipt | 159 | The recorded commit and claim passed; promotion is a separate question. |
| Closed, rejected by the improvement gate, without such a receipt | 5 | Insufficient claimed improvement; no mathematical rejection follows. |
| Closed, with a workflow failure and no positive receipt found | 242 | The run failed; the bot summary alone does not determine whether the cause was mathematical, operational, or policy-related. |
| Closed, no classified bot verdict | 44 | Insufficient evidence in these comments; not an automatic failure classification. |

An independent receipt here means that the bot explicitly reports both `verified = true` and `independentVerified = true`. A receipt does not certify every proposed experiment, optimality assertion, or explanation in its accompanying note. The 159 unmerged receipts also do not represent 159 distinct mathematical improvements: many are ties, repackagings, or reproductions.

Sources: [closed PR archive](https://github.com/proximity-prize/proximity-prize/pulls?q=is%3Apr+state%3Aclosed), [archived classification data](pr-history-2026-09-12/catalogue.json).

## 2. The main conclusion

The history supports a more specific strategy than either “search more parameters” or “invent a completely new decoding theorem”:

> Recover constraints that the present numerical model discards, determine whether they materially lower its maximum, and formalize only the useful constraints.

There are precedents for gains from all three layers:

- A new geometric construction can produce a large jump.
- A more faithful allocation of an existing degree or error budget can produce a meaningful jump without changing the code.
- A small, targeted refinement can resolve a single obstruction that looked like a global mathematical barrier.

However, several apparently new ideas are already inherited by the 68.06 source. The relevant question is not whether shared budgets or kernel avoidance have ever been used. It is whether a stronger version applies to the current second-jet retained-component branch.

## 3. Milestones that explain the present architecture

The following is a selected technical history, not a claim that each listed PR introduced all of its ingredients independently.

| PR | Public result | Mechanism and lesson |
|---|---|---|
| [#45](https://github.com/proximity-prize/proximity-prize/pull/45) | Merged, 63.58 | An unconditional BCHKS-style interpolation/alignment construction replaced the earlier 53.13 route. A change of theorem architecture, not decimal retuning, produced the large jump. |
| [#122](https://github.com/proximity-prize/proximity-prize/pull/122) | Merged, 64.01 | Contact interpolation plus strong prescribed-support alignment supplied the required interleaved list bound past Johnson. A weak MCA statement was not interchangeable with the stronger alignment interface. |
| [#187](https://github.com/proximity-prize/proximity-prize/pull/187) | Merged, 66.00 | Component-adaptive projections repaired the failure of using one literal coordinate on every residual component. Algebraic-coordinate cases were retained explicitly. |
| [#241](https://github.com/proximity-prize/proximity-prize/pull/241) | Merged, 66.74 | A separate seedless list bound freed almost the entire error allowance for MCA; the previous equal allocation had spent half the budget unnecessarily. |
| [#255](https://github.com/proximity-prize/proximity-prize/pull/255), [#262](https://github.com/proximity-prize/proximity-prize/pull/262) | Merged, 66.96 and 67.00 | Heterogeneous interpolation sources and coupled factor weights replaced independent rectangular estimates. |
| [#339](https://github.com/proximity-prize/proximity-prize/pull/339) | Verified, unmerged, 67.35 | Regular-solution contact information excluded a specific expensive full-slope common factor. This is a concrete precedent for proving that a numerical worst case is unrealizable. |
| [#367](https://github.com/proximity-prize/proximity-prize/pull/367), [#383](https://github.com/proximity-prize/proximity-prize/pull/383), [#387](https://github.com/proximity-prize/proximity-prize/pull/387) | Merged, 67.60–67.65 | Low quotient selection, square avoidance, and repeated projection provided cheaper alternatives when an auxiliary shared a factor. Basic kernel-escape ideas are already prior art here. |
| [#492](https://github.com/proximity-prize/proximity-prize/pull/492) | Merged, 68.00 | Correlated factor families, whole-product routing through fresh sources, and compact prefix certificates replaced the older grid architecture. |
| [#506](https://github.com/proximity-prize/proximity-prize/pull/506), [#517](https://github.com/proximity-prize/proximity-prize/pull/517) | #506 unmerged; #517 merged at 68.04 | #517 explicitly incorporates #506's shared common/residual degree accounting, then adds coefficient-dependent second-jet profiles. |
| [#549](https://github.com/proximity-prize/proximity-prize/pull/549), [#551](https://github.com/proximity-prize/proximity-prize/pull/551) | Both verified at 68.06; only #551 merged | The corner reduction and subsequent threshold-file split preserve the same mathematical claim. Verification efficiency and score improvement must be tracked separately. |

This history makes the soundness track the better-supported near-term choice for our work. It has a developed sequence of stronger bounds and several alternative local certificates. The attack track has valuable negative results, but its current promoted endpoint remains the 116.13 construction from #38. That is an assessment of available approaches, not a proof that one research problem is intrinsically easier.

## 4. Unmerged work worth examining closely

### 4.1 PR #339: regular contact can exclude a worst-case factor

The 67.35 certificate does more than compare the dimension of the interpolation kernel with an unrestricted quotient box. It uses the existence of a regular selected solution to impose residual contact conditions on quotients by a common factor. A projection argument then gives a stronger dimension upper bound and rules out an expensive full-slope corner. The [independent receipt](https://github.com/proximity-prize/proximity-prize/pull/339#issuecomment-5469821363) confirms the complete 67.35 claim, despite its being a tie.

**Relevance now:** our difficult tuple is `(r,y,t) = (11,48,2632)`. Test whether its retained-helper condition forces additional quotient constraints. The old proof used a full-slope hypothesis, so its conclusion cannot simply be reused at slope 11 in a slope-31 ambient domain. A new residual-contact argument would have to account for nonzero quotient slope and the second-jet variable.

The names `RegularColon` and its listed helper modules were not found in a targeted search of the current packed foundation and geometry files. That is a navigation observation, not proof that no equivalent argument is present under a different name. Recover its exact hypotheses before deciding what is genuinely missing. [PR #339](https://github.com/proximity-prize/proximity-prize/pull/339)

### 4.2 PR #479: a nonlinear charge with a small certificate

This proposal uses a slope-dependent lookup and a floor-total feature in addition to linear degree weights. A finite unbounded-knapsack certificate bounds the sum of lookup charges across factors. The generic module has been [downloaded for inspection](pr-history-2026-09-12/479-LocatorNonlinearCharge.lean); it has not been compiled against our present branch.

The bot rejected this attempt at the improvement gate. There is no independent success receipt for #479 in the archive. Its note reports local checking, which should remain distinct from remote verification. The named nonlinear module and lookup were not found in the current lower source by targeted search. [PR #479](https://github.com/proximity-prize/proximity-prize/pull/479)

**Relevance now:** test a small nonlinear feature basis against the present factor-family optimization before formalizing it. Such a feature cannot repair a singleton whose own counting bound exceeds the allowance unless it also tightens an applicable constraint or bound. The existing phase recurrence may already dominate some historical charging schemes; a direct global comparison is essential.

### 4.3 PR #480: optimize the whole charge, including source robustness

This alternative 67.86 certificate changed the aggregate slope weight and selected a less fragile B source. Its [independent receipt](https://github.com/proximity-prize/proximity-prize/pull/480) confirms the result, but it did not improve the incumbent at verification time.

**Relevance now:** optimize the complete objective and all source gates together. A large positive nullity is not itself the objective; increasing the source slope can increase the final counting cost. Likewise, a coefficient that improves the present binding cell may worsen another cell. Reuse the method of comparison, not the old constants. [PR #480](https://github.com/proximity-prize/proximity-prize/pull/480)

### 4.4 PR #378: a false obstruction caused by a coarse cell

The verified 67.62 alternative had one cell where the cheap helper route required incompatible bounds when expressed over the entire coarse interval. Refining only the middle-degree grid resolved that incompatibility without a new geometric counting theorem. Its later closure was not a proof failure. [PR #378](https://github.com/proximity-prize/proximity-prize/pull/378)

**Relevance now:** distinguish an exact-point obstruction from an interval-envelope obstruction. Our reported worst tuple is an exact integer point, so blindly subdividing a grid cannot reduce its pointwise cost. Refinement can still help if a phase-prefix or branch-selection envelope combines incompatible endpoints. Diagnose which situation applies first.

### 4.5 PR #407: tiny radius changes can destroy a source

This verified 67.67 alternative documents a thin interpolation source whose positive margin disappears at the next error row. Its repair removes that source, adjusts the common-factor caps, and adds another quotient-projection stage. [PR #407](https://github.com/proximity-prize/proximity-prize/pull/407)

**Relevance now:** a 0.01-bit target is not guaranteed to be a small perturbation of the previous proof. Search should expose discontinuities in feasibility, including cap changes and characteristic gates, rather than assume the best old profile remains available.

### 4.6 PR #506: useful, but already incorporated

The shared budget in #506 is a particularly clear example of good closed work being reused. The merged #517 credits it explicitly. The current `BoundaryTailCounting.lean` contains `BoundaryTailSharedDegreeBudget.split_weight_budget`, confirming that this mechanism is not merely a historical suggestion. [PR #506](https://github.com/proximity-prize/proximity-prize/pull/506), [PR #517](https://github.com/proximity-prize/proximity-prize/pull/517)

**Relevance now:** identify a further joint constraint, not another independent implementation of the existing split budget. In particular, inspect whether the normal and moving retained-component contributions have a shared resource that the present theorem still bounds separately.

## 5. What the attack archive actually rules out

The merged [#38](https://github.com/proximity-prize/proximity-prize/pull/38) uses the NTT domain's `512 × 512` decomposition. A rational pencil and a common core give 139,775 agreement positions while the codeword degree reaches, but does not exceed, 131,071. The score is 116.13.

Two unmerged follow-ups are useful:

- [#92](https://github.com/proximity-prize/proximity-prize/pull/92) supplies an exact Lean obstruction to the displayed pigeonhole inequality for one 1024-fold alternative. This rules out that sufficient counting certificate, not every possible 1024-fold construction. Its [source](pr-history-2026-09-12/92-Fold1024Barrier.lean) is archived locally. The source uses a `2^59` population requirement. Our separate exact-integer check also finds the premise false after replacing this by `floor(q / 2^128) + 1`; that additional calculation is not a new Lean certificate.
- [#327](https://github.com/proximity-prize/proximity-prize/pull/327) replaces a coarse population threshold with the exact winning-set requirement while retaining the same 116.13 endpoint. More candidate challenges do not automatically create additional agreement positions. Degree capacity and winning-set population are distinct constraints.

Some notes in this family make stronger optimality statements than their displayed arithmetic supports. For example, [#84](https://github.com/proximity-prize/proximity-prize/pull/84) describes 2,130,706,433 as an extension-field capacity in one argument, whereas the benchmark challenge field has cardinality `2130706433^6`. A claim about a base-field-parameterized subfamily may still be useful, but it cannot be promoted to a general sextic-field obstruction without further justification. Its successful receipt verifies the retained endpoint, not that prose assertion.

This is why the archive should be read as a source of precise lemmas and falsifiable experiments, not as a collection of universally valid impossibility results.

## 6. Verification lessons from both successful and failed attempts

**The exported theorem is the result.** For example, the note in [#220](https://github.com/proximity-prize/proximity-prize/pull/220) discusses 66.42, but its public bot receipt scores 63.99. A successful run of the old candidate is not a proof of the new target.

**A workflow failure is not a mathematical diagnosis.** Failures at score-writing, timeout, resource cleanup, export, and actual elaboration require different responses. The catalogue preserves the original bot link rather than labeling all failures “invalid proof.”

**A small axiom list alone is insufficient.** A conditional theorem can use only permitted axioms while assuming exactly the estimate that remains unproved. A completed result must have the exact metadata-bound `ProtocolClaim` type with no new caller-supplied geometric premise.

**Performance changes should preserve a stated interface.** The equality-based numeric reductions in #241, the equivalent decision procedures in #517, and the corner-to-full theorem in #549 illustrate useful approaches. Report timings for the computation actually measured; do not apply a local speedup factor to the full verifier. [#241](https://github.com/proximity-prize/proximity-prize/pull/241), [#517](https://github.com/proximity-prize/proximity-prize/pull/517), [#549](https://github.com/proximity-prize/proximity-prize/pull/549)

**Packing and splitting solve different problems.** Many small modules can increase checker concurrency and repeated environment costs; one enormous declaration can make elaboration or kernel reduction impractical. The right target is small proof obligations with a bounded dependency schedule, not the minimum number of filenames.

**Do not copy old resource limits or characteristic assumptions.** The archive spans many challenge versions. Current instructions and the pinned source are authoritative. A profile must pass all interpolation, specialization, characteristic, and source-existence gates at the new agreement count.

## 7. Revised priorities for 68.07

1. **Reproduce the complete incumbent in the numerical model.** Record the exact domain, field/list allowance, source feasibility, and worst cells before changing the score. Keep raw local component costs separate from phase-envelope maxima.
2. **Test the two specific archival leads first.** Adapt #339's residual-contact/quotient-dimension question to the current retained-helper condition; separately test a compact nonlinear potential inspired by #479 against the actual factor-family recurrence. Establish whether either improves the global maximum, not just a selected component.
3. **Audit lost phase correlations.** #492 demonstrates that keeping one strategically important degree coordinate in a prefix certificate can matter. #517 explicitly distinguishes a tighter full-coordinate numerical forecast from its implemented scalar-prefix certificate. Quantify the present loss before paying for a larger table. [#492](https://github.com/proximity-prize/proximity-prize/pull/492), [#517](https://github.com/proximity-prize/proximity-prize/pull/517)
4. **Search only after identifying the missing information.** Rust is useful for exact profile enumeration, worst-cell discovery, small dynamic programs, and rational candidate potentials. It cannot turn an unconstrained dimension estimate into a coprimality theorem.
5. **Reject insufficient ideas early.** The current modeled deficit is approximately `2.0731 × 10^16`. An optimistic upper limit on an idea's savings can reveal that it cannot close this gap. If one cell improves, rerun the full domain because the maximum can move.
6. **Formalize a reusable lemma before producing large receipts.** Preserve the original theorem interface and prove the numerical simplification. Then check the complete claim natively, with resource control and a full submission-prefix kernel replay. Keep any proved improvement locally; do not publish or submit without approval.

The highest-value question for a human collaborator is now concrete:

> Does the existence of a regular selected solution, together with universal retained-helper divisibility, force additional contact conditions on the quotient family that exclude or cheaply bound the present `(11,48,2632)` component?

The history makes that question more promising than an unsupported guess: a related regular-contact exclusion has already succeeded in another finite certificate. It does not establish that the required second-jet extension is true or strong enough for 68.07.
