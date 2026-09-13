# Comparing interpolation constructions

An interpolation construction chooses a polynomial source space and linear contact constraints. Its usefulness depends on three quantities: the dimension of the resulting kernel, the conditions under which its polynomials avoid a shared component, and the cost of counting the resulting intersections.

These objectives can conflict. The comparisons below concern proof constructions, not a search over all received words.

## Local rather than global source conditions

Let a component $F(X,Y,R,Z)$ have bounds $(r,y,t)$ on its $R$-degree, joint $Y,R$-degree, and joint $Y,R,Z$-degree. Let an auxiliary have the corresponding bounds $(s,U,L)$. The variable $X$ is the evaluation coordinate. Mixed-degree conditions can include

$$
rL+ts<p,\qquad yL+tU<p,\qquad ys+rU<p,
$$

where $p$ is the characteristic. A source can satisfy these inequalities on a small component box while failing them on a larger one.

Using the smaller box is justified only when every component passed to the source lies in that box. A local improvement must also be propagated through the full counting recurrence. Recorded finite examples show why: making one formerly maximal cell affordable can move the maximum to an adjacent cell.

## Projection geometry versus source feasibility

A sharper projection theorem can reduce the proper-intersection cost without improving the source-existence inequality. One example reduces that branch from approximately $3.26\times10^{16}$ to $2.84\times10^{16}$ by using mixed flag volumes instead of rectangular degree bounds.

The saving applies only after the construction reaches that branch. It has no effect on a component for which the auxiliary-selection test fails or the retained-component branch dominates.

Likewise, sources with very large multiplicity can approach a favorable routing ratio without crossing it. A ratio close to one indicates sensitivity of that estimate, not proximity to a completed global theorem.

## Deleting coefficients has two costs

Let $T:V\to W$ be the local contact map, and let $K\subseteq\ker T$ be a known independent kernel subspace. Suppose a coordinate projection $\pi$ removes $c$ source coordinates and $\operatorname{rank}\pi(K)=d$. The surviving kernel contains $K\cap\ker\pi$, so the corresponding rank upper bound changes by

$$
R_{\mathrm{new}}\le R_{\mathrm{old}}-c+d,
$$

when $R_{\mathrm{old}}=\dim V-\dim K$.

Counting only the deleted columns misses the $d$ term: some removed coordinates were needed for existing cancellations. Exact small-matrix tests confirm this distinction. In one profile, removing the highest coefficient level gives exactly the already available lower-degree source, rather than a new rank improvement.

## Sparse supports and repeated roots

Under the appropriate characteristic bound, a nonzero polynomial with $t$ nonzero terms has multiplicity less than $t$ at a nonzero root. This can turn a sparse auxiliary into a factor-avoidance tool. The condition that the auxiliary remain nonzero modulo the component is essential. [Mattarei, *Root multiplicities and number of nonzero coefficients of a polynomial*](https://arxiv.org/abs/math/0512239)

Sparsity also removes coefficient freedom and contact-kernel cancellations. In the recorded sparse-source families, this dimension cost prevents the proposed geometric benefit from becoming available. The general lesson is to establish source existence and structural usefulness together.

## Stronger derivative-contact schedules

Let $m$ be the interpolation multiplicity and $e(d)$ a nondecreasing integer sequence with increments at most one. Instead of ordinary derivative contact, require the derivative of order $d$ to have contact at least $m-d+e(d)$.

Early, delayed, and staircase schedules trade a stronger local requirement for a less restrictive global degree reserve. Their rank formulas must retain all valid kernel alternatives. A small exact control exposes one otherwise missed alternative: a vector with no dependence on the differentiated variable can satisfy every derivative condition automatically.

After accounting for this alternative, the tested schedules did not outperform the best ordinary profile in their search ranges. That conclusion concerns those schedules and supports, not all derivative-aware constructions.

## A reproducible comparison

For each candidate, record the source support, contact map, proven or computed rank bound, factor-avoidance conditions, and final component cost. Evaluate the complete degree domain after any improvement. This prevents a gain in one intermediate quantity from being reported as a gain in the final maximum.
