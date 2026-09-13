# Designing stronger soundness bounds

## Objective

Improve the unconditional counting argument, not merely the displayed target. A 68.07 certificate is a useful first milestone; it is not evidence of an optimum. Larger gains may require a construction that changes the source dimension balance or removes an expensive component class.

In this setting, interpolation constructs auxiliary equations vanishing on close Reed–Solomon messages. Counting their solutions bounds exceptional random combination parameters. The challenge is to improve that uniform count while preserving every source-existence, degree, and characteristic condition.

## 1. Quantify interpolation using two equations

**Question:** can the component and its differential equation give a better uniform contact-rank bound while preserving economical support limits?

Let $F(X,Y,R,Z)$ be an irreducible component, with $Y=f(X)$, $R=f'(X)$, and $Z$ a combination parameter. Let $V$ be an auxiliary polynomial space and $T_F$ its linear contact map. A sufficient condition for a kernel element not divisible by $F$ is

$$
\dim V-\operatorname{rank}T_F>\dim(V\cap(F)).
$$

Small exact examples show additional source directions, but some tighter and combination-variable-dependent controls show no gain. The missing theorem must retain all degree caps and cover the relevant component types. A polynomial-matrix or graded-basis computation could help identify the degree dependence before a full formalization.

**Reject early:** an improvement that disappears when the $Z$-degree is restored, or one whose new degree cost exceeds the counting allowance.

## 2. Bound the high support-root-mass class

**Question:** how many selected parameters can make the regular derivative have nearly maximal root multiplicity on their own agreement supports?

For a solution $f$, put $H=F_R(X,f,f',\gamma)\ne0$. Its support-root mass is $\sum_{x\in T}\operatorname{ord}_x H$, where $T$ is its agreement support. Small mass can force additional quotient equations to vanish by root counting. The complementary large-mass class needs a bound using information shared across solutions: common divisibility, support incidence, or absence of many solutions of the form $f_\gamma=f_0+\gamma f_1$.

**Reject early:** an argument that assumes a discriminant is nonzero without treating identically vanishing specializations, or that replaces support-root mass by an unsupported degree saving.

## 3. Improve source supports without losing cancellations

**Question:** can a richer support pass source existence and the full counting objective simultaneously?

A support optimizer can choose coefficient cutoffs at each derivative-variable level. It must preserve every interval of levels used by a kernel cancellation, along with the degree reserves needed for derivative vanishing. A positive result still requires valid finite coefficient counts, rank bounds, and complete domain checks.

**Reject early:** a coefficient gain calculated with the old local rank after removing levels used by its kernel vectors.

## 4. Recover a genuinely shared counting resource

**Question:** do normal, moving, or exceptional contributions draw from one degree resource that is still being charged separately?

Factorization distributes a finite degree budget among common and residual factors. A useful joint constraint must follow from the theorem hypotheses, rather than combine separately attainable maxima. Pure reweighting cannot repair an admissible singleton whose unchanged pointwise estimate already exceeds the allowance.

**Reject early:** deleting a positive charge without a conservation law, or improving only one cell without rerunning the maximum.

## Specification of a proposed bound

Record five items:

```text
Statement:   the exact implication to prove
Hypotheses:  all field, degree, support, regularity, and nonvanishing conditions
Replacement: the numerical term or proof interface it improves
Evidence:    theorem, complete computation, bounded experiment, or conjecture
Next check:  the cheapest test capable of rejecting the proposal
```

This format makes failures reusable and prevents a promising example from silently becoming a universal assumption.
