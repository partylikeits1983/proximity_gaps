# Exact search and support optimization

## Search proof constructions, not received words

The field and received-word spaces are too large to enumerate. The useful search space is a family of proof constructions: interpolation multiplicities, support shapes, derivative reserves, routing choices, and counting potentials.

Each candidate must be evaluated against the complete objective. A positive source margin does not imply an affordable component count. Improving one component can move the maximum to another cell.

Use exact arithmetic for feasibility tests. Enable overflow checks, reproduce a known fixture, and compare optimized formulas with direct small enumerations. A fast wrong rejection can hide a useful construction just as a wrong acceptance can suggest a false proof.

## A joint objective for coefficient cutoffs

Consider auxiliary polynomials $P(X,S,Y,R,Z)$, where $Y,R,S$ represent a message and its first two Hasse derivatives, and $Z$ is a combination parameter. There are $n$ agreement nodes at which contact constraints are imposed. For fixed outer parameters, choose a cutoff $U_h$ for the joint $Y,R,S$-degree at each exponent $h$ of $S$. Let $C_h$ count global coefficients, $S_h$ local source coordinates, and $K_b$ independent local kernel vectors in a block $b$ spanning levels $I_b$.

The sufficient source margin is

$$
\mathcal N(U)=\sum_h C_h(U_h)-n\sum_h S_h(U_h)
+n\sum_b K_b\left(\min_{j\in I_b}U_j\right).
$$

The interval minimum preserves the support dependencies of the kernel vectors. Removing one level can remove a cancellation involving several levels.

Introduce a Boolean variable for each threshold $U_h\ge u$. Higher thresholds imply lower ones. A positive kernel reward requires every threshold in its interval. These implications give a maximum-weight closure problem, solvable by minimum cut.

For example, two levels may each cost 5 while enabling a shared reward of 12. Keeping either alone is unfavorable; keeping both gains 2. Independent greedy choices would miss the improvement.

The graph algorithm need not become part of a submitted proof. A positive returned support can be checked through finite coefficient and rank receipts. However, an optimality claim about the entire modeled family needs stronger validation than merely re-evaluating the winning support.

## Validate both the model and its optimizer

Compare the optimizer with exhaustive enumeration on small supports, then independently recompute coefficient and kernel counts for its returned support. These checks test different claims: optimization of the encoded objective and correct evaluation of the selected construction.

A useful sensitivity calculation asks how much the rank bound would have to fall, with coefficient count fixed, to make the source margin positive. This sets a numerical target for a new rank theorem; it does not justify applying that discount.

An empty optimal support or an unchanged profile can be informative. It identifies a limitation of the tested objective and parameter range, rather than proving that all interpolation constructions fail.

## Keep evidence categories separate

| Result | Valid interpretation |
|---|---|
| Positive sufficient dimension margin | A source exists once the count and rank interface are proved. |
| Failed sufficient margin | This test does not establish source existence. |
| No gain in a bounded scan | No improvement was found in the specified family and range. |
| A modular rank calculation | An exact rank for that matrix over that field. |
| Timeout | The calculation is incomplete. |
| A passing component | Only that component's estimate is established, not the full degree domain. |
