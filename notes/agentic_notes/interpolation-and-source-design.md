# Polynomial interpolation and source design

## Interpolation as linear algebra

Choose a finite-dimensional space $V$ of auxiliary polynomials. Contact conditions define a linear map $T$ on their coefficients. Rank–nullity gives

$$
\dim\ker T=\dim V-\operatorname{rank}T.
$$

If the constraints are imposed at $n$ nodes and each local map has rank at most $R$, then

$$
\dim\ker T\ge\dim V-nR.
$$

A positive lower bound guarantees a nonzero interpolant. A nonpositive bound means this sufficient test fails; it does not prove that the actual kernel is zero.

The local rank sum can overestimate the global rank. However, a reduction observed in a small example is not a universal discount: recorded controls include both rank-deficient and full-rank global matrices.

## Designing the polynomial space

Let $f$ be a message polynomial of degree at most $w$, and let $A$ be its required number of agreements with a received word. The second-jet construction uses $P(X,S,Y,R,Z)$. Along $f$, substitute

$$
(S,Y,R,Z)=(D^{[2]}f,f,f',\gamma).
$$

Here $\gamma$ is a combination parameter, and $D^{[2]}f$ is the coefficient of $T^2$ in $f(X+T)$, the second Hasse derivative. When the characteristic is not two, it equals $f''/2$. Each $e_*$ below is the exponent of the corresponding variable in a source monomial.

The weights of $S,Y,R$ in the resulting $X$-degree are $w-2,w,w-1$. A coefficient-level support can therefore be specified by

$$
e_S=h\le s,\quad 2h+e_R\le B,
$$
$$
h+e_Y+e_R\le U_h,\qquad h+e_Y+e_R+e_Z\le L,
$$
$$
e_X+(w-2)h+we_Y+(w-1)e_R<D_h.
$$

Here $m$ denotes contact multiplicity, not code dimension or interleaving width. The derivative-reserve parameters are written $\kappa,n_0$ to avoid confusing them with $K$:

$$
D_h=mA-\operatorname{res}(h)(A-w+2),\qquad
\operatorname{res}(h)=
\begin{cases}
h,&h<n_0,\\
\kappa,&h\ge n_0.
\end{cases}
$$

The reserve makes the required derivatives vanish after specialization. Enlarging the support can improve coefficient count while worsening the local rank or geometric cost. Maximizing kernel dimension alone is not the objective.

## Why support dependencies matter

A local kernel vector may combine several consecutive $S$-levels. Removing one level can destroy that cancellation. The rank estimate must therefore change when the support changes.

If a block uses levels $h$ through $h+a$, its cutoff is controlled by

$$
\min_{h\le j\le h+a}U_j,
$$

not just the two endpoint values. A valid support optimizer must preserve these interval dependencies.

Another common restriction comes from the counting formula rather than the construction itself. A closed-form identity may require $U\ge m+s$, even though the underlying finite-index space permits smaller $U$. Search may explore the larger family only after replacing the formula with a valid count there.

## What a usable source requires

A candidate must pass all of the following:

1. A proved coefficient count and local rank bound for the same support.
2. Positive sufficient kernel dimension.
3. The derivative and specialization guarantees needed by its consumer.
4. Characteristic and factor-avoidance conditions.
5. A component cost that improves the complete counting calculation.

A source that passes the first four may still be too expensive. A shape with an attractive counting formula is unusable if its source-existence test fails.
