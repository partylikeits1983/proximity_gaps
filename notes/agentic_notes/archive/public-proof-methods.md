# Methods illustrated by public soundness proofs

Public submissions are useful as a collection of proof techniques, not merely as a sequence of scores. A verification receipt establishes the exported claim at the recorded revision; it does not establish every optimality statement or research suggestion in the accompanying prose.

## Reusable techniques

| Technique | Mathematical lesson | Example source |
|---|---|---|
| Interpolation and alignment | Changing the theorem architecture can matter more than retuning constants. | [PR 45](https://github.com/proximity-prize/proximity-prize/pull/45), [PR 122](https://github.com/proximity-prize/proximity-prize/pull/122) |
| Component-adaptive projections | A coordinate suitable for one component need not work on every component. Preserve exceptional coordinate cases. | [PR 187](https://github.com/proximity-prize/proximity-prize/pull/187) |
| Separate error allocations | An equal split between error terms can waste most of the available budget. Bound each contribution before allocating the remainder. | [PR 241](https://github.com/proximity-prize/proximity-prize/pull/241) |
| Contact-constrained quotients | Regular selected solutions can restrict the quotient space more strongly than an unrestricted coefficient box. | [PR 339](https://github.com/proximity-prize/proximity-prize/pull/339) |
| Factor avoidance and repeated projection | Alternative auxiliaries can recover a cheaper route when a chosen helper shares a factor. | [PR 367](https://github.com/proximity-prize/proximity-prize/pull/367), [PR 387](https://github.com/proximity-prize/proximity-prize/pull/387) |
| Correlated factor accounting | Preserve degree correlations that would otherwise be replaced by independent maxima. | [PR 492](https://github.com/proximity-prize/proximity-prize/pull/492) |
| Shared degree budgets | Common and residual factors can consume the same resource; charging them separately can lose a useful constraint. | [PR 506](https://github.com/proximity-prize/proximity-prize/pull/506), [PR 517](https://github.com/proximity-prize/proximity-prize/pull/517) |
| Convexity-based certificate compression | Prove that endpoint or corner checks cover the interior, then remove redundant evaluations. | [PR 549](https://github.com/proximity-prize/proximity-prize/pull/549) |

## Three transfer tests

**Check the hypotheses.** A full-slope common factor can make a quotient independent of a derivative variable. A lower-slope factor does not inherit that simplification merely because the same proof pattern looks relevant.

**Check the location of the loss.** Nonlinear charging can improve an aggregate estimate, but cannot lower an admissible singleton below its unchanged pointwise charge. Determine whether the obstruction is pointwise, an interval envelope, or a family-level relaxation.

**Check the theorem interface.** A faster equivalent checker and a stronger mathematical bound are different results. For example, the threshold-file reorganization in [PR 551](https://github.com/proximity-prize/proximity-prize/pull/551) preserves the mathematical claim of its predecessor.

## Interpret unsuccessful submissions precisely

An improvement-gate rejection does not refute the mathematics. A timeout does not identify a false inequality. A successful check of an older exported target does not validate a stronger target mentioned only in the notes.

The useful artifact is a precise lemma, construction, or counterexample with its hypotheses and verification scope—not a narrative claim of general optimality.
