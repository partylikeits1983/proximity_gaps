# After 68.06: The Concrete Reed–Solomon Bottleneck and a Research Plan for Larger Gains

*Research note for mathematicians and research engineers. Snapshot: 12 September 2026.*

This is a follow-up to *From the Grand Challenge to better.codes: Scoring Reed-Solomon Soundness in Bits*. It replaces several provisional interpretations in that document with the pinned Lean definitions, reports what the public certificates and our local experiments actually establish, and identifies specific mathematical questions that could lead beyond incremental parameter search.

The immediate objective is a complete certificate at **68.07 bits**. The longer-term targets, 68.5–74 bits, remain research objectives rather than predicted outcomes. **We do not currently have a proof of 68.07.**

Throughout this note, four kinds of evidence are distinguished:

- **Publicly verified:** an independently verified challenge result, with its exact claim and public record.
- **Locally checked:** a Lean theorem checked in the pinned local environment, possibly with a separate kernel replay. This need not be a complete challenge certificate.
- **Numerical:** an exact-integer calculation or search result not yet incorporated into a complete Lean proof.
- **Proposed:** a mathematical direction whose required theorem has not been proved.

## 1. Executive summary

The public leaderboard currently displays **68.06 bits on the soundness track and 116.13 bits on the attack track**, a difference of 48.07 bits. Its leading soundness entry credits `i34-9`, `partylikeits1983`, and `0xLucqs`. These are scores for the benchmark's threshold certificates, not measurements of the security of an entire STARK implementation. [Public leaderboard][leaderboard]

Our local work has established a stronger auxiliary interpolation profile and a corresponding conditional component-counting theorem. The two new Lean modules occupy 6,722 bytes, build with cached dependencies in about 11 seconds, and pass a separate replay of their declarations through the Lean kernel. Their audited axiom closures contain only `propext`, `Classical.choice`, and `Quot.sound`.

However, the full numerical estimate built from the currently modeled ingredients is still too large:

$$
M_{\mathrm{current}}=295711327033254342,
\qquad
M_{\mathrm{allowed}}=274980721972128925.
$$

This requires approximately a **7.01% reduction in the current estimate**; equivalently, the current estimate is **7.54% above the allowance**. These percentages describe a counting bound, not a percentage of the proof task completed. [Local status][advanced-status]

The principal observation is that the expensive case is not finding a nonzero interpolation polynomial. It is counting solutions when the auxiliary equations share an algebraic component. At the current worst cell, the estimate for the proper-intersection case is approximately $1.59\times10^{14}$, whereas the shared-component case costs approximately $2.87\times10^{17}$.

This suggests a more promising question than simply enlarging the numerical search:

> Can one exclude the expensive shared-component configuration, choose an auxiliary polynomial that avoids it, or count all such configurations jointly at substantially lower cost?

No theorem currently justifies any of these improvements. The purpose of the research plan below is to make them precise and testable.

The closed-PR review adds an important lead: a verified, unmerged 67.35 certificate already used regular-solution contact information to exclude an expensive common-factor configuration. A separate unmerged proposal supplied a compact nonlinear charging framework. Neither can simply be transplanted into the current second-jet argument, but they provide concrete starting points. [PR #339][pr339], [PR #479][pr479]

## 2. The exact benchmark, without interpreting its nickname

The label `koalaIRS12` should not be used to infer the parameters. The authoritative definitions are in `IRSProfile.lean`:

| Parameter | Pinned value |
|---|---:|
| Base-field characteristic $p$ | $2130706433=2^{31}-2^{24}+1$ |
| Challenge/coefficient field $\mathbb F_q$ | KoalaBear's degree-six extension, $q=p^6$ |
| Evaluation-domain size $n$ | $2^{18}=262144$ |
| Base RS dimension $K$ | $2^{17}=131072$ |
| Maximum degree of a message polynomial $w$ | $K-1=131071$ |
| Interleaving width | $8$ |
| Total interleaved message dimension | $2^{20}$ over $\mathbb F_q$ |
| Alphabet rate | $1/2$ |
| Minimum distance | $131073$ |
| Number of spot checks | $128$ |
| Combination-round target | $2^{-128}$ |

The evaluation domain is a size-$2^{18}$ multiplicative NTT domain in the base field, embedded into the sextic extension. The received words and message polynomials need not have base-field coefficients. In particular, the domain being contained in $\mathbb F_p$ does not make the problem a prime-field-only decoding problem. [Pinned parameter definitions][profile]

Numerically,

$$
\log_2 q\approx185.932108.
$$

The distinction between **field size** $q$ and **characteristic** $p$ matters. Probability denominators involve $q$. Nonvanishing of factorials and derivative arguments depend on $p$, not on $q$.

### 2.1 Two different error quantities

At a radius $\delta$, the lower-track contract requires

$$
\operatorname{certifiedGammaError}(\delta)\le2^{-128},
\qquad
(1-\delta)^{128}\le2^{-b},
$$

along with admissibility of the radius. The second inequality gives the leaderboard score. Its real-valued counterpart is

$$
b_{\mathrm{query}}(\delta)=-128\log_2(1-\delta).
$$

The submitted integer is in hundredths of a bit. Thus `6807` means a claim of at least 68.07 bits in this query-term conversion. [Lower contract][lower-contract]

The quantity $\log_2(q/|\Lambda|)$ in the earlier note is useful for discussing a list contribution to an error bound. **It is not the definition of the better.codes score.** Improving a list or MCA estimate only raises the score if it allows a larger admissible radius while meeting the fixed combination-round target.

The repository states:

> It is not `-log2(WSS)` and is not a full-protocol security claim.

[Repository README][repo-readme]

### 2.2 What the attack certificate establishes

The upper track certifies that the worst-case winning-set density exceeds $2^{-128}$ throughout an admissible suffix of radii. The conversion to bits again uses $(1-\delta)^{128}$. It is not merely a demonstration that one particular upper-bound calculation is loose.

There is nevertheless an important modeling distinction. The pinned library proves an upper coupling from winning-set density to the certified extractor error; it does not assert the converse identification with a minimal game error. The upper certificate also does not construct an end-to-end attacking prover. Consequently, the 68.06–116.13 interval should be described as a bracket supplied by the benchmark certificates, not as a measured interval for whole-system security. A monotonicity theorem for winning-set density is not assumed; the attack contract explicitly requires the whole suffix. [Upper contract][upper-contract], [winning-set definition][winning-set]

## 3. What the public results have revealed

### 3.1 There is genuine finite-parameter progress beyond Johnson

For this RS dimension, the usual field-size-independent Johnson expression based on the exact minimum distance is

$$
\delta_J=1-\sqrt{\frac{K-1}{n}}
\approx0.2928959162.
$$

The simpler rate-only expression $1-\sqrt{1/2}$ differs slightly because it omits the finite-length $K-1$ correction.

The 68.06 claim uses

$$
\delta_{68.06}=\frac{10343935}{33554432}
\approx0.3082732856.
$$

It is therefore approximately **1.5377 percentage points beyond this Johnson radius**. Its integer error budget is 80811, compared with

$$
\left\lfloor n-\sqrt{n(K-1)}\right\rfloor=76780.
$$

This is a finite certified instance thousands of coordinate errors beyond the Johnson budget, not an asymptotic theorem asserting a constant improvement for an entire family of codes. The radius and accepted claim are recorded in PR #549 and preserved in the promoted source. [PR #549][pr549], [public lower claim][public-claim]

### 3.2 Verification improvements and mathematical improvements are distinct

The mathematical target in the user's PR #549 was already

```lean
ProtocolClaim 6806 10343935 33554432
```

Its important verification improvement was a discrete-convexity argument reducing exhaustive proper-split checks to a bounded set of corners. The original inequalities were preserved; this was not sampling interior points and hoping that they were representative.

For the reported 3,937 parent cells, the strict-check workload fell from 3,481,920 split evaluations to 59,474 corner evaluations, including repetitions. The factor of 58.55 applies to that workload, not to the complete verifier. The public record reports independent verification of the claim, despite the PR later being closed after the incumbent changed. [PR #549][pr549]

Comparing the fetched heads of #549 and #551 shows that #551 retains the same score and radius and changes five lower-track files: a threshold-check module becomes an aggregator importing four range modules. This is a source-layout change, not a stronger bound. The #551 note preserves attribution to the preceding public work. [PR #551][pr551], [exact source comparison][pr-compare]

The lesson is not that engineering replaces mathematics. It is that a valid stronger theorem is only useful to the challenge if its certificate fits the source and verification budgets. Conversely, a much faster proof of the same theorem does not raise the soundness score.

### 3.3 What the leaderboard does not reveal

The leaderboard does not tell us how close 68.06 is to the optimal lower certificate. Nor does it identify how much of the remaining interval comes from geometric counting, the MCA estimate, the list estimate, or the difference between the certified expression and winning-set density.

Failure of our searches is not evidence that the pinned code has a bad instance at 68.07. At present it is evidence that the particular upper bounds we have assembled do not suffice.

### 3.4 What the full closed-PR archive adds

The dated archive contains **554 closed PRs: 104 merged and 450 unmerged**. Matching the repository's 1,118 issue comments to these PRs found **159 unmerged PRs with explicit independent-verification receipts**. These are not necessarily distinct improvements: many are ties, reproductions, or alternative proofs. All PRs are listed in the [complete catalogue][pr-index]; the [companion review][pr-review] explains the selection and its limits. This is an archive-wide metadata and outcome review with selected detailed mathematical readings, not a fresh kernel audit of every historical submission.

Several historical changes are directly relevant:

| Historical change | Implication for the present work |
|---|---|
| [#241][pr241] separated the scalar/list allowance from MCA. | The obvious equal-budget inefficiency was already removed. Recovering another half-budget is not an available shortcut. |
| [#339][pr339] used regular contact conditions to exclude a full-slope common factor. | Investigate a stronger quotient-dimension obstruction for the actual retained-component hypotheses, not only unrestricted coefficient boxes. |
| [#378][pr378] resolved an obstruction by refining one grid coordinate. | Determine whether a failure occurs at an exact point or only in a conservative interval envelope before proposing new geometry. |
| [#479][pr479] proposed nonlinear slope/floor charging; [#480][pr480] verified a different weighted charge. | Search for a compact potential whose complete factor-family bound improves, while checking whether the present recurrence already dominates it. |
| [#492][pr492] preserved factor correlations and one important degree coordinate in its prefix certificate. | Quantify the loss from scalar-prefix relaxation before assuming that the retained-component theorem itself must change. |
| [#506][pr506] contributed shared budgets that [#517][pr517] explicitly incorporated. | Basic shared common/residual accounting is already inherited; a new gain needs an additional constraint. |

The most promising archival lead for a new structural theorem is #339. Its old full-slope hypothesis made the quotient slope-free, which enabled a sharp contact-based dimension bound. Our critical component has slope 11 inside a larger ambient domain, and our auxiliary has a second-jet variable. Extending the argument requires new work; the old conclusion does not follow just by changing its numerals.

The archive also records failed approaches and narrative errors. A positive receipt certifies its exported claim, not every optimality assertion in the submitter note. Conversely, improvement-gate rejection, timeout, or closure after a competing promotion does not prove the underlying mathematics wrong. The companion review gives concrete examples and links to the original receipts.

## 4. The concrete MCA task

Let $C=\operatorname{RS}_{<K}(\mathbb F_q,\mathcal D)$, where $\mathcal D$ is the pinned evaluation domain. Fix received words $u_0,u_1$ and consider the affine line

$$
u_\gamma=u_0+\gamma u_1,\qquad\gamma\in\mathbb F_q.
$$

A bad MCA parameter is one for which there is a sufficiently large coordinate set $T$ such that

$$
u_\gamma|_T\in C|_T,
$$

but at least one of $u_0|_T,u_1|_T$ does not belong to $C|_T$. Here $C|_T$ is the projected code: membership means that some codeword has that restriction.

Thus the event is **support-wise**. The quantifier ranges over possible sets $T$; there need not be one distinguished agreement set shared by every parameter on the line. Informal descriptions in terms of “the common set” can obscure this distinction. The MCA error is the worst-case, over input words, probability of this bad event under uniform $\gamma$. [Pinned MCA definition][mca-definition]

### 4.1 The exact numerical allowance

Write $C_8$ for the eight-fold interleaved code. The certified combination-round expression is

$$
\varepsilon_{\mathrm{cert}}(\delta)
=\varepsilon_{\mathrm{MCA}}(C_8,\delta)
+\frac{\Lambda(C_8^{\equiv2},\delta)}{q},
$$

with the finite list cardinality represented through the library's extended-natural interface. This is an equality for the pinned certified expression, not an assertion that it equals optimal protocol soundness. [Certified expression][certified-expression]

Our local route proves a list bound by reducing the relevant sixteen-row problem to a scalar-list bound, and transfers the affine-line MCA bound from the base code to the interleaved code. The checked scalar/list allowance at the proposed 68.07 radius is

$$
L_{\mathrm{scalar}}=6139266162.
$$

Consequently, it suffices to establish a uniform bad-parameter count $M$ satisfying

$$
M+L_{\mathrm{scalar}}\le
\left\lfloor\frac{q}{2^{128}}\right\rfloor
=274980728111395087.
$$

The remaining MCA allowance is exactly

$$
M\le274980721972128925.
$$

The list arm is already negligible compared with the missing MCA margin. Even replacing its allowance by zero would recover only about $6.14\times10^9$, whereas the current deficit is about $2.07\times10^{16}$. Reallocating this budget is therefore not the missing large improvement. [Checked scalar module][scalar-local], [conditional protocol module][protocol-local]

For scale, at this fixed $n$ the allowed count is approximately

$$
15.2645\,n^3,
$$

while the current numerical estimate is approximately $16.4153\,n^3$. This is a normalization of the two concrete numbers, not a theorem that either bound is uniformly cubic in a changing block length.

### 4.2 A sufficient alignment statement

The local proof uses `AffineLineAlignmentBound`, a sufficient structural statement. In simplified form, if more than $M$ parameters each admit a close codeword on a specified support of size at least $n-E$, then there exist two codewords $p_0,p_1$ explaining those combinations on more than $E+1$ of the specified supports. A subsequent combinatorial lemma extracts a support on which both input words are individually explained.

This is stronger and more structured than merely bounding the number of parameters that happen to be close to the code. It explains why ordinary list decoding alone does not complete the current MCA proof. [Alignment definition and bridge][alignment-local]

## 5. Why a gain of 0.01 bits is not necessarily a small proof change

The proposed next claim is

```lean
ProtocolClaim 6807 10345087 33554432
```

It lies in error cell

$$
E=80820,\qquad A=n-E=181324,\qquad A-w=50253.
$$

The 68.06 certificate used 80811 errors. Although the displayed score increases by only 0.01, the interpolation construction must therefore tolerate nine additional coordinate errors.

Several source inequalities are close to equality. Changing the agreement threshold can eliminate a positive dimension margin, forcing a different interpolation shape. That in turn changes the admissible component degrees and the downstream counting tables. A score increment is not a uniform perturbation of every inequality in the proof.

In particular, simply retargeting the old interpolation parameters is invalid. The local work has separately proved replacement scalar and source lemmas, including a common-divisor total-degree cap of 7784. The simulator was corrected to use that domain; a smaller old domain cannot be retained just because it gives a better estimate. [Incremental status][incremental-status]

## 6. The auxiliary polynomial and the difficult branch

This section describes the part of the construction being searched. It does not attempt to reproduce the entire geometric proof.

### 6.1 Interpolation variables and support

The second-jet interpolant is a nonzero polynomial

$$
P(X,S,Y,R,Z).
$$

For a candidate message polynomial $f$ and parameter $\gamma$, it is specialized at

$$
(X,S,Y,R,Z)
=\bigl(X,D^{[2]}f(X),f(X),f'(X),\gamma\bigr),
$$

where $D^{[2]}$ is the second Hasse derivative. In the present odd characteristic it equals $f''/2$.

The searched parameters are $(m,B,s,U,L,\kappa,n_0)$. The letter $\kappa$ here denotes the derivative reservation parameter called `k` in the Lean profile; it is not the code dimension $K$.

For each supported monomial with exponent vector $e$, the conditions include

$$
2e_S+e_R\le B,\quad e_S\le s,\quad
e_S+e_Y+e_R\le U,\quad
e_S+e_Y+e_R+e_Z\le L.
$$

Define

$$
\operatorname{res}(h)=
\begin{cases}
h,&h<n_0,\\
\kappa,&h\ge n_0.
\end{cases}
$$

The weighted $X$-degree condition is

$$
e_X+(w-2)e_S+w e_Y+(w-1)e_R
<mA-\operatorname{res}(e_S)(A-w+2).
$$

At 68.07, the reserve cost is $A-w+2=50255$. Contact conditions at the $n$ evaluation points then imply the required vanishings for close candidate polynomials. The existence argument compares the number of available coefficients with an upper bound on the rank of the contact constraints. [Interpolation definitions][interpolation-local]

The local source certificate establishes

$$
\dim V>n\,r_{\mathrm{local}},
$$

which guarantees a nonzero kernel. It does not, by itself, guarantee that the resulting polynomial has favorable factorization or that its solution set has few bad parameters.

### 6.2 Proper intersection versus a shared component

The counting argument works with an irreducible residual component $F(X,Y,R,Z)$. Its hypotheses include regularity along the selected solutions, agreement with the received line, degree restrictions, and absence of a sufficiently large selected affine pencil.

Auxiliary equations obtained from $P$ lead to two cases:

1. **Proper intersection:** an auxiliary polynomial $Q$ is relatively prime to $F$. The existing intersection-counting theorem gives a relatively small bound.
2. **Retained component:** all the relevant cleared auxiliary equations are divisible by $F$. A more expensive argument using derivative multiplicity and divisor-degree budgets is required. The zero set of the leading coefficient must also be counted.

For the current family, the numerical bound has the form

$$
\max\left\{
C_{\mathrm{proper}},\;
N_{\mathrm{normal}}+
65539\left\lceil\frac{M_{\mathrm{moving}}}{\kappa+1}\right\rceil
+C_{\mathrm{leading}}
\right\}.
$$

The names “normal” and “moving” identify the two divisor-degree terms used in the implementation. They count mathematical contributions; they do not denote RAM, proof bytes, or runtime. [Counting theorem][asymmetric-local], [component data and scaled retained bound][regular-data-local]

Increasing $\kappa$ improves the displayed divisor in the moving term, but consumes coefficient space through the derivative reserve. Increasing $n_0$ changes the moving-degree budget but also imposes stronger reserves on more coefficient levels. This tradeoff is what the Rust search explores.

## 7. Current local results and their exact limitations

### 7.1 A checked interpolation and counting profile

The new checked profile is

$$
(m,B,s,U,L,\kappa,n_0)=(131,55,26,178,2604,6,8).
$$

Its exact receipts are

$$
\#\text{coefficients}=3136535093217721,
\qquad r_{\mathrm{local}}=11964911997,
$$

and

$$
3136535093217721-262144\cdot11964911997=5202676153>0.
$$

`BoundaryTailProfile131.lean` proves interpolation existence. `BoundaryTailProfile131Count.lean` proves the associated component count under the existing `Data`, own-shape, and $2604<t$ hypotheses. The latter is a genuine counting theorem, but not an unconditional MCA or protocol theorem. [Profile source][profile131], [counting source][profile131-count]

The numerical receipts use structural natural-number recursion, with equality lemmas connecting the fast expressions to the original finite cardinality formulas. The measured rank tactic and its kernel type check each take roughly 0.7 seconds. Imports dominate the whole-file runtime. These figures are local measurements with cached dependencies, not a prediction for a clean complete submission build.

The separate kernel replay checked the new modules against their imported environments. It was not a fresh replay of the entire library closure. The regression file also checks that Lean agrees with the critical-cell value used in the Rust model. [Regression and axiom audit][profile131-audit]

### 7.2 The worst cell

The current modeled bottleneck has cumulative degree coordinates

$$
(r,v,z)=(11,37,2584),\qquad y=r+v=48,\qquad t=y+z=2632.
$$

Here $z$ is a degree coordinate, not the affine-line parameter $\gamma$. The profile's condition $L<t$ holds because $2604<2632$.

The new profile gives the following exact arithmetic at that cell:

| Contribution | Value |
|---|---:|
| Proper-intersection branch | 158695465732277 |
| Normal-divisor term | 232096875772227294 |
| Scaled and rounded moving term | 55239861555192259 |
| Leading-coefficient term | 18226664964335 |
| Retained-component branch, hence profile bound | 287354963992383888 |

After the remaining contributions in the full numerical model:

| Contribution | Value |
|---|---:|
| Component bound | 287354963992383888 |
| Complement | 2373307349397071 |
| Left unit | 115310168212492 |
| Right unit | 4431992128509968 |
| Two tails | 20965485129544 |
| Pair term | 1414787909621379 |
| Total | 295711327033254342 |
| Allowed total | 274980721972128925 |
| Deficit | 20730605061125417 |

The complete table is a **numerical diagnostic**, not a newly proved global certificate. In particular, no argument currently shows that an adversarial instance actually realizes all these pessimistic contributions simultaneously. Equally, we have no proof that such simultaneous behavior can be excluded. This distinction is a central research opportunity. [Simulator and full-run log][phase-simulator], [run log][phase-log]

### 7.3 The next numerical candidate

A subsequent exhaustive local search found

$$
(133,54,24,181,2610,6,8),
$$

with critical-cell estimate $287294850396225653$. This is slightly better than the checked profile, but **it has not been given a new Lean certificate or a complete global verification**. It does not close the known deficit. [Exhaustive-search log][refine-log]

The worktrees also contain retargeted `Solution.lean` files and metadata. A target written in a file is not evidence that the target has been proved. The 68.07 and 68.50 assemblies remain incomplete; the preserved public 68.06 result is separate.

## 8. What numerical search has and has not established

Rust evaluates the cardinality and counting formulas with exact integer arithmetic. Where the dimension difference is affine in the total-degree cap $L$, the search solves for the first potentially valid $L$ and rechecks it. This is substantially cheaper than asking Lean to elaborate every unsuccessful profile.

The experiments include:

| Experiment | Observed outcome | What it does not establish |
|---|---|---|
| Randomized profiles with independent $n_0$ | More than 1.4 million positive-dimension trials; produced the checked profile | Global optimality or that every trial is a distinct construction |
| Exhaustive local refinement | 28,217 shapes and 196,497 feasible parameter combinations | Exhaustiveness outside the stated parameter box |
| Higher derivative orders | No better result in the sampled range | Impossibility of a higher-order method |
| Alternative slope/middle-degree avoidance | 1,152 feasible candidates; no improvement | Impossibility of all non-total-degree avoidance arguments |
| Small exact modular rank tests | 3,095 blocks with no rank defect versus the tested formula | A rank-optimality theorem for large profiles or arbitrary fields |
| Varying coefficient-level caps | No improvement over the checked profile in that run | Optimality of the support shape |

The ordinary profile search is therefore not a brute-force search over received words or field elements. Those spaces are infeasible to enumerate. It is a search over a finite-dimensional family of **proof constructions**. [Rust source][profile-search]

One implementation issue was caught during this work: a kernel block can cross an interval of coefficient levels where the reserve function resets at $n_0$. Its cap must be checked over the whole interval, including the level immediately before the reset. Testing only the endpoint can understate the rank. That path has been corrected in the exploratory code. The checked profile uses the simpler uniform-cap theorem and does not rely on that unproved varying-cap optimization.

### The implication for further grinding

Search remains useful, especially if it tracks the entire set of worst cells rather than one cell. But the observed improvements within this family are now much smaller than the remaining deficit. This is evidence for allocating more effort to a new inequality or a richer construction, not proof that additional search cannot succeed.

## 9. Literature: what can plausibly transfer to this instance

### 9.1 Johnson-plus-a-constant results do not immediately address our radius

Jo's ePrint 2026/1432 claims an $O_{r,h}(K^6/q)$ MCA bound at

$$
E=\left\lfloor n-\sqrt{n(K-1)}\right\rfloor+h
$$

for fixed $r,h$ and sufficiently large $K$, with $n=rK$. Its concrete examples use other parameter points. [Jo, abstract and version record][jo]

At our 68.07 point, the required integer increment is $h=4040$, not one or two. Moreover, even a unit multiple of $K^6/q$ has error exponent only

$$
\log_2 q-6\log_2 K\approx185.932108-102=83.932108,
$$

well short of the **128-bit combination-round target**. Thus extracting a hidden constant is not automatically the highest-leverage route. Its dependence on $h$, its applicability threshold, and the entire finite expression would have to improve this comparison substantially. The full explicit constant has not been independently evaluated here.

### 9.2 Hidden derivatives provide a direction, not a ready-made certificate

Jeronimo's September 2026 preprint claims fixed-slack list and MCA bounds using hidden derivatives and bounded-dimensional solution geometry. Its Sections 8.4–8.5 state characteristic conditions for extending the geometric argument beyond prime fields, and explicitly disclaim competitive numerical constants for a prescribed small instance. The prime-field restriction of the algorithm and the hypotheses of the geometric count should not be conflated. [Preprint and full text][jeronimo], [local extracted Sections 8.4–8.5][jeronimo-local]

Our case has $p>w$, so one elementary characteristic obstruction is absent. This is not enough: auxiliary degrees, all exceptional strata, the finite-length threshold, and their combined counts still need quantitative bounds.

The most useful extraction from this direction so far is an elementary derivative-stratum cover. Outside the leading-coefficient zero set, every relevant root lies on a derivative that vanishes while the next derivative does not. The local lemma handles repeated factors and uses no squarefreeness assumption. **The cover is proved; a sufficiently small total count of its strata is not.** The current specialized cover lives in the separate 68.50 worktree, not in a completed 68.07 assembly. [Derivative-stratum source][strata-local], [68.50 status][status6850]

### 9.3 A warning about capacity claims in both directions

The disproofs of broad up-to-capacity conjectures must be respected, but they do not show that every fixed positive slack from capacity is unattainable at every field and block length. Conversely, a new theorem with fixed slack and an unspecified polynomial exponent does not settle this finite challenge. The order of quantifiers, field hypotheses, and dependence on slack are essential. [Crites–Stewart][crites-stewart], [Jeronimo][jeronimo]

Generic/random RS results cannot simply be substituted for the fixed NTT domain. Likewise, ordinary interleaving is not interchangeable with folded RS. The supplied background reductions and structural observations remain useful context, but none bypasses the precise MCA and list terms in the pinned contract.

## 10. Research directions that could give a larger improvement

The following are proposed directions, not results. The priorities reflect the present numerical diagnosis. Each direction needs a clear hypothesis, a bound that includes all exceptional cases, and an initial experiment capable of rejecting it.

### A. Test whether the worst cell is an artifact of separately maximized bounds

**Question.** Can a component with $(r,y,t)=(11,48,2632)$ simultaneously satisfy all the interpolation, regularity, support, and no-large-pencil hypotheses while also forcing the costly branch?

The current numerical envelope retains upper bounds on several degrees and then combines worst-case contributions. It is possible that this admits tuples that cannot arise from an actual common component of the selected interpolation polynomials. It is also possible that the tuple is realizable. We do not know which.

**Required theorem.** A joint constraint on components arising from the actual construction, stronger than the individual degree caps. One useful outcome would be a dichotomy: either an affine-pencil explanation already exists, or the degree tuple lies outside a small explicit set of problematic cells.

**First experiment.** List every inequality used to admit the worst cell. Retain the common-divisor and coefficient-support information before replacing it by separate maxima. Search for a small missing inequality, then test it on small-field instances. A numerical infeasibility certificate is useful only after its constraints have been proved necessary in Lean.

**Why it could matter.** Eliminating or tightening a few worst cells may avoid changing the entire interpolation method.

### B. Choose an auxiliary interpolant to avoid a component

**Question.** Must we accept an arbitrary nonzero element of the interpolation kernel, or can we choose one that gives a proper helper for the component being counted?

Let $\mathcal K$ be the interpolation kernel. For a fixed irreducible $F$, consider the linear subspace

$$
\mathcal K_F=\{P\in\mathcal K:
F\mid H_j(P,F)\text{ for every required cleared helper }H_j\}.
$$

The dependence on $P$ is linear for fixed $F$. A sufficient new statement is

$$
\dim\mathcal K_F<\dim\mathcal K.
$$

It would give a $P$ for which at least one helper is proper. This is a substantially stronger conclusion than $\dim\mathcal K>0$.

**First experiment.** Compute these two dimensions on small analogues with known regular components. Look for a structural rank lower bound on the helper map restricted to $\mathcal K$. A useful dichotomy might show that failure of rank implies precisely the large-pencil configuration already excluded by the proof.

**Why it could matter.** At the current worst cell, the proper-intersection estimate is more than three orders of magnitude smaller than the retained-component estimate. A uniform escape theorem could therefore be much more valuable than a small coefficient-count improvement.

**Failure mode to avoid.** Two linearly independent interpolation polynomials may still share the same irreducible factor. Kernel dimension alone does not imply coprimeness, and random linear combinations do not remove a fixed factor common to the entire space.

**Historical starting point.** Whole-kernel common divisors, low quotient selection, and repeated factor avoidance already occur in the public lineage. The new question is whether the *cleared second-jet helper map* has additional rank under the regular-solution and no-large-pencil hypotheses. The residual-contact exclusion in #339 is a concrete model for extracting more information from these hypotheses. [PR #339][pr339], [closed-PR review][pr-review]

### C. Count shared components jointly rather than independently

**Question.** Can the normal and moving contributions be paid from one global degree budget across all retained components?

The present assembly already contains shared accounting; this proposal is to identify remaining instances where a global resource is replaced by independent per-component maxima. Intersection multiplicities, common factors, and the support of a resultant may impose additional conservation laws.

**Required theorem.** An aggregate inequality with explicit component multiplicities and no double counting. A rational linear-programming dual certificate or a polynomial potential could then provide a compact numerical receipt, provided the geometric inequalities behind it are first proved.

**First experiment.** Expand the full ledger into its primitive charges. Identify which charges can occur on the same component, and which draw from the same divisor or intersection budget. Optimize the joint system and compare its best possible savings with the $2.07\times10^{16}$ deficit.

Before proposing a new geometric inequality, measure the loss from the existing prefix representation. The historical #492 certificate retained a total-degree coordinate on a small critical region; #517 records a tighter full-coordinate numerical forecast than its implemented scalar-prefix certificate. A selective exact-prefix calculation could reveal a recoverable numerical relaxation. It might also show that this axis has too little room. [PR #492][pr492], [PR #517][pr517]

A second experiment is a slope-knapsack or floor-degree potential inspired by #479. Its coefficients must be optimized against the current recurrence and all admissible families. Adding a nonlinear feature cannot, by itself, lower the bound for an allowed singleton whose pointwise estimate is already too expensive. [PR #479][pr479]

**Failure mode to avoid.** Discarding a positive contribution because it appears conservative. For example, the normal-divisor padding at the old critical profile is about $8.51\times10^{15}$, and no unconditional theorem currently removes it. Even removing all of it would not alone close the current gap.

### D. Use multiplicity-sensitive elimination with a complete exceptional-case count

**Question.** Can subresultants or a derivative filtration replace the coarse retained-component bound while keeping all repeated-root cases under control?

A single discriminant is insufficient. For example,

$$
P(S)=(S-a)^4
$$

has identically zero discriminant but still has a root that must be counted. Dividing by a resultant or assuming generic squarefreeness would omit a legitimate case.

The proved derivative descent gives an exhaustive alternative:

$$
P^{(j)}(a)=0,\qquad P^{(j+1)}(a)\ne0,
$$

for an appropriate $j$, together with the exceptional leading-coefficient branch. The missing statement is a sharp **sum** of the counts over these branches, not just the existence of the cover.

**First experiment.** Work out degrees and properness conditions for small highest-variable degrees, including pure powers and mixed repeated factors. Compare subresultant degree bounds with the current mixed-degree formula before writing a large Lean development.

**Why it could matter.** It targets the exact degeneracy that makes the current bound expensive. It also reuses a locally checked case-cover lemma.

### E. Search over support shapes, not only seven integer caps

**Question.** Does the rectangular/cumulative support family discard coefficient choices that would improve the ratio between interpolation dimension and geometric counting cost?

Possible alternatives include coefficient-level-dependent total-degree caps, a small union of compatible support regions, or a Newton-polytope description matched to the actual intersection bound.

**Required theorem.** A rank/count interface for the new support family that remains valid under localization, differentiation, and specialization. A favorable lattice-point count alone is not sufficient.

**First experiment.** Use Rust to search a small parametric family of support profiles, preserving these closure constraints. Compare exact small-instance matrix ranks and compute a full counting estimate. Promote only support families that improve the global objective enough to justify new formalization.

**Failure mode to avoid.** Applying sparse-polynomial or mixed-volume bounds after substitutions that destroy the sparsity assumptions, or using a generic-position hypothesis not available for adversarial received words.

### F. Exploit the base-field domain without assuming independent extension coordinates

**Question.** Can the identity $x^{2^{18}}=1$ on the evaluation domain, or the six-dimensional $\mathbb F_p$-structure of $\mathbb F_q$, give a stronger deterministic constraint on bad parameters?

Possible tools include residue-class decompositions modulo $X^n-1$, trace/coordinate projections, and descent of coefficient relations. These would be genuinely different uses of the pinned domain structure.

**First experiment.** Translate the exact bad-support event into base-field coordinates and determine which implications preserve the common coordinate set. Check small examples before inferring any gain.

**Failure mode to avoid.** Treating the six coordinates as independent random tests. The received words are adversarial, and all coordinates share the same agreement support. A prime-field theorem must also be transferred to extension-valued polynomials with an explicit proof.

## 11. A staged plan for 68.07 and then larger targets

### Stage 1: Establish a reproducible global diagnostic

Freeze a named version of the numerical model and retain the ten or twenty worst cells, not only the maximum. For each cell, record which branch wins, all characteristic gates, the exact degree domain, and every contribution to the ledger.

Keep the checked profile and the newer numerical candidate distinct. The purpose is to make it impossible to confuse a local improvement with a complete valid certificate.

### Stage 2: Audit the highest-leverage assumptions

First measure the scalar-prefix and interval-envelope losses in Direction C. This determines whether better finite optimization could close the target without a new geometric theorem.

Then prioritize Directions A and B using the specific precedent of #339: regular-solution contact information may strengthen the quotient-dimension obstruction. Map the remaining joint degree charges and test the nonlinear feature family from #479 as a separate numerical comparison. These approaches ask whether information already present in the hypotheses can give a stronger conclusion without increasing derivative order.

### Stage 3: Set a go/no-go numerical threshold before extensive Lean work

A new idea should be translated into the same global diagnostic as early as possible. A reduction of about 7% at the current total is necessary merely to reach the allowance, and the worst cell may move after an improvement. A method leaving a modest margin below the allowance is preferable to one relying on equality at a single cell.

If the proposed inequality cannot produce enough savings even when granted optimistically, do not spend weeks formalizing it for this target. Record the result and move to another direction.

### Stage 4: Prove the missing theorem, then generate small receipts

The preferred architecture is a shared mathematical lemma followed by exact scalar or row-level certificates. Keep numerical reductions over naturals where appropriate, close affine sums algebraically, and avoid large monolithic table evaluations.

The successful corner-check reduction is the model: prove why fewer checks imply the full assertion. Do not replace an exhaustive obligation with sampling.

### Stage 5: Verify the complete claim

A finished result requires the updated source selection, component bounds, split/corner receipts, phase and threshold certificates, scalar/list arm, and final protocol assembly to agree on the same radius and domain.

Then run the dependency-aware native build, exact theorem/metadata check, axiom audit, source-policy and size checks, and complete kernel verification. Cached leaf timings do not substitute for this run. Preserve any complete result locally before attempting a higher target. No external submission is authorized by this note.

### Stage 6: Reassess 68.5–74 using the mechanism, not the displayed increment

The approximate radius needed for a score $b$ is $1-2^{-b/128}$. The following are numerical guides, not certificates:

| Target score | Approximate required radius | First relevant error cell $\lfloor n(1-2^{-b/128})\rfloor$ |
|---|---:|---:|
| 68.07 | 0.3083073 | 80820 |
| 68.50 | 0.3099161 | 81242 |
| 69.00 | 0.3117820 | 81731 |
| 70.00 | 0.3154988 | 82706 |
| 72.00 | 0.3228722 | 84639 |
| 74.00 | 0.3301662 | 86551 |

A method that removes a structural degeneracy might extend across several of these cells. A profile that wins by a tiny dimension margin may not. We currently have no basis for predicting that 74 is attainable with the present construction.

## 12. Proof size: what the research could buy

There are two unrelated meanings of “proof size” in this work:

1. **Lean certificate size:** source bytes admitted by the challenge and the resources needed to check them.
2. **Cryptographic proof size:** bytes transmitted by a deployed prover, including commitments, openings, field elements, and other protocol messages.

The current repository instructions impose a 16 MiB total Lean submission limit and an 8 MiB per-file limit. They document a 24 GiB build-memory limit and a four-hour verifier budget; the local project aims for substantially faster checking. These are verification constraints, not network-proof-size targets. [Repository agent instructions][agent-instructions]

For the idealized query term alone, a radius with score $b$ under 128 queries would require

$$
t_{\mathrm{queries}}\ge
\left\lceil\frac{128\lambda}{b}\right\rceil
$$

queries to reach a $2^{-\lambda}$ query error. At $\lambda=128$, the corresponding counts are 241 for 68.06, 240 for 68.50, 238 for 69, and 222 for 74.

This does **not** establish 128-bit whole-protocol soundness. Other error terms must be allocated part of the total error budget. In particular, adding two terms each bounded by $2^{-128}$ yields only a $2^{-127}$ bound unless there is further slack.

Ignoring integer rounding, moving from 68.06 to 74 reduces the query-dependent cost by about

$$
1-\frac{68.06}{74}\approx8.03\%.
$$

Therefore even a 74-bit certificate would not, by itself, imply a reduction from 300 KiB to 250 KiB. If all bytes in a hypothetical 300 KiB proof scaled with queries, that improvement would give approximately 276 KiB; fixed overhead would reduce the percentage saving further.

The repository's public opening estimator is

$$
128(256\cdot18+62\cdot8)=653312\text{ bits}=81664\text{ bytes}.
$$

This prescribed estimator is not a complete serialization model for a deployed protocol. We do not yet have a protocol implementation and full error/byte accounting from which to certify a 250 KB or 250 KiB proof. Such a claim requires a separate engineering analysis, including multi-openings, round structure, extension-field encoding, batching, and all soundness terms. [Estimator definition][profile], [WHIR][whir]

## 13. Questions for a mathematician or research engineer

The most useful contributions would answer one of the following precise questions:

1. **Component realizability:** What additional relation must hold between $(r,y,t)$ for a regular common component of these interpolation sources? Can it exclude the present worst tuple or force a cheaper branch?
2. **Kernel escape:** Can the helper map modulo $F$ be proved nonzero on the interpolation kernel unless $F$ admits the already-excluded affine-pencil behavior?
3. **Aggregate counting:** Which normal, moving, and exceptional contributions draw from the same global degree resource? Can their sum be bounded without maximizing each one independently?
4. **Multiplicity strata:** Can one bound the total degree/count of all derivative strata, including identically vanishing discriminants and leading-coefficient exceptions, by a quantity that improves the current retained term?
5. **Support design:** Is there a localization-stable nonrectangular monomial family with a better global dimension/count tradeoff?
6. **Finite constants:** Which literature theorem gives explicit bounds that remain useful at $n=2^{18}$, $K=2^{17}$, $p=2130706433$, $q=p^6$, and $E=80820$? An unspecified polynomial exponent is not enough.

A useful proposed lemma should come with its exact hypotheses, the numerical term it replaces, treatment of degenerate cases, and an estimate of the resulting full bound. A counterexample to a proposed improvement would also be valuable: it prevents a misleading search direction from consuming further formalization effort.

## 14. Reading and navigation guide

For the benchmark semantics, read the pinned parameter and target files before the historical narrative. For the current proof task, start with the local status and the interpolation/counting interface; the large generated tables are not the best entry point.

| Resource | Purpose |
|---|---|
| [Pinned parameters][profile], [lower contract][lower-contract], [upper contract][upper-contract] | The exact problem being certified |
| [MCA definition][mca-definition], [certified expression][certified-expression] | Support-wise bad event and its use in the extractor bound |
| [PR #549][pr549], [PR #551][pr551] | Verified 68.06 claim, corner-check optimization, and subsequent layout change |
| [Closed-PR research review][pr-review], [all 554 PRs][pr-index] | Alternative verified proofs, failed routes, inherited techniques, and concrete leads |
| [Incremental 68.07 status][incremental-status] | Checked scalar/source results and unproved global obligations |
| [Advanced status][advanced-status] | The full numerical deficit and current checked profile |
| [Interpolation source][interpolation-local], [counting interface][asymmetric-local] | Mathematical inputs and the proper/retained case split |
| [Profile certificate][profile131], [component-count certificate][profile131-count] | Small examples of the current checked numerical receipts |
| [Derivative-stratum lemma][strata-local] | Repeated-factor-safe case coverage; counting remains open |
| [Rust search][profile-search], [phase simulator][phase-simulator] | Numerical exploration and global diagnostics |
| [Local paper index](PAPERS.md) | Downloaded literature and applicability cautions |

The principal literature references for the next stage are [Arnon–Boneh–Fenzi][abf], [WHIR][whir], [Jo's post-Johnson MCA paper][jo], and [Jeronimo's hidden-derivative preprint][jeronimo]. The [Crites–Stewart disproofs][crites-stewart] are necessary context for interpreting capacity statements correctly.

The practical conclusion is narrow but important: **68.07 is currently a problem of obtaining a stronger unconditional MCA count, not a problem of making Lean execute an already complete proof faster.** Rust search has improved the available construction and exposed where it stops helping. The next step is to distinguish recoverable numerical relaxation from genuinely missing geometry. The strongest identified geometric lead is a sharper contact-based constraint on shared components; the cheapest diagnostic is to measure the correlations lost by the present finite certificate.

---

## Source and reproducibility references

Public benchmark source links below are pinned to commit `7a25126134d1e5a8a2d6c7f0d74337718c14df40`. ArkLib links are pinned to the dependency revision in that checkout. The leaderboard and PR records were inspected on 12 September 2026. Local links refer to mutable research worktrees; their results must be read with the status qualifications above. No statement in this note promotes a numerical search result to a verified challenge claim.

[leaderboard]: https://better.codes/
[profile]: https://github.com/proximity-prize/proximity-prize/blob/7a25126134d1e5a8a2d6c7f0d74337718c14df40/ProximityPrize/Benchmark/IRSProfile.lean
[lower-contract]: https://github.com/proximity-prize/proximity-prize/blob/7a25126134d1e5a8a2d6c7f0d74337718c14df40/ProximityPrize/Benchmark/TargetLower.lean
[upper-contract]: https://github.com/proximity-prize/proximity-prize/blob/7a25126134d1e5a8a2d6c7f0d74337718c14df40/ProximityPrize/Benchmark/TargetUpper.lean
[repo-readme]: https://github.com/proximity-prize/proximity-prize/blob/7a25126134d1e5a8a2d6c7f0d74337718c14df40/README.md
[public-claim]: https://github.com/proximity-prize/proximity-prize/blob/7a25126134d1e5a8a2d6c7f0d74337718c14df40/ProximityPrize/SubmissionLower/BoundaryTailClaim.lean
[agent-instructions]: https://github.com/proximity-prize/proximity-prize/blob/7a25126134d1e5a8a2d6c7f0d74337718c14df40/AGENTS.md
[mca-definition]: https://github.com/Verified-zkEVM/ArkLib/blob/e65197892890b8fd9b0dc05b8980273cf1d595cc/ArkLib/Data/CodingTheory/ProximityGap/ProximityGenerators.lean
[certified-expression]: https://github.com/Verified-zkEVM/ArkLib/blob/e65197892890b8fd9b0dc05b8980273cf1d595cc/ArkLib/ProofSystem/ToyProblem/Impl/IRS.lean
[winning-set]: https://github.com/Verified-zkEVM/ArkLib/blob/e65197892890b8fd9b0dc05b8980273cf1d595cc/ArkLib/ProofSystem/ToyProblem/SoundnessBounds.lean
[pr549]: https://github.com/proximity-prize/proximity-prize/pull/549
[pr551]: https://github.com/proximity-prize/proximity-prize/pull/551
[pr241]: https://github.com/proximity-prize/proximity-prize/pull/241
[pr339]: https://github.com/proximity-prize/proximity-prize/pull/339
[pr378]: https://github.com/proximity-prize/proximity-prize/pull/378
[pr479]: https://github.com/proximity-prize/proximity-prize/pull/479
[pr480]: https://github.com/proximity-prize/proximity-prize/pull/480
[pr492]: https://github.com/proximity-prize/proximity-prize/pull/492
[pr506]: https://github.com/proximity-prize/proximity-prize/pull/506
[pr517]: https://github.com/proximity-prize/proximity-prize/pull/517
[pr-index]: pr-history-2026-09-12/INDEX.md
[pr-review]: CLOSED-PR-RESEARCH-REVIEW.md
[pr-compare]: https://github.com/proximity-prize/proximity-prize/compare/c9017066e76095f6974eb899da89987423f311ac...e639cd0c8f94f1946eb02718123aadb6b0dafabc
[incremental-status]: STATUS-6807.md
[advanced-status]: ../soundness-6807-advanced/research/STATUS.md
[status6850]: STATUS-6850.md
[scalar-local]: ../soundness-incremental/ProximityPrize/SubmissionLower/BoundaryTailScalar.lean
[protocol-local]: ../soundness-incremental/ProximityPrize/SubmissionLower/BoundaryTailProtocol.lean
[alignment-local]: ../soundness-6807-advanced/ProximityPrize/SubmissionLower/LowerFoundation.lean
[interpolation-local]: ../soundness-6807-advanced/ProximityPrize/SubmissionLower/BoundaryTailInterpolation.lean
[asymmetric-local]: ../soundness-6807-advanced/ProximityPrize/SubmissionLower/BoundaryTailAsymmetric.lean
[regular-data-local]: ../soundness-6807-advanced/ProximityPrize/SubmissionLower/BoundaryTailRegularData.lean
[profile131]: ../soundness-6807-advanced/ProximityPrize/SubmissionLower/BoundaryTailProfile131.lean
[profile131-count]: ../soundness-6807-advanced/ProximityPrize/SubmissionLower/BoundaryTailProfile131Count.lean
[profile131-audit]: ../soundness-6807-advanced/research/Profile131Checks.lean
[phase-simulator]: ../soundness-6807-advanced/research/simulate_phase6807.rs
[phase-log]: ../soundness-6807-advanced/research/phase-profile131-6807.log
[profile-search]: ../soundness-6807-advanced/research/search_profiles6807.rs
[refine-log]: ../soundness-6807-advanced/research/search-refine-6807.log
[strata-local]: ../soundness-target74/ProximityPrize/SubmissionLower/BoundaryTailDerivativeStrata.lean
[jeronimo-local]: tmp/pdfs/Jer26.txt
[abf]: https://eprint.iacr.org/2026/680
[whir]: https://eprint.iacr.org/2024/1586
[jo]: https://eprint.iacr.org/2026/1432
[jeronimo]: https://eccc.weizmann.ac.il/report/2026/169/
[crites-stewart]: https://eprint.iacr.org/2025/2046
