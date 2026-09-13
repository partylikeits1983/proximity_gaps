# Algebraic experiments with shared components

## The objects being compared

Let $F(X,Y,R,Z)$ define a component over a field of characteristic different from two, with $Y=f(X)$, $R=f'(X)$, and $Z=\gamma$ on a selected polynomial solution. A second-jet auxiliary also has a variable $S=D^{[2]}f(X)=f''(X)/2$.

There are three distinct tests:

1. Does the interpolation kernel contain nonzero polynomials?
2. Does its image modulo the global ideal $(F)$ contain nonzero directions?
3. Does a cleared helper restrict nontrivially to the regular component?

Here a helper is an auxiliary equation derived from a source, with denominators cleared so that it can be restricted to $F=0$. Passing one test does not imply the next. An entire nonzero kernel can share a component, and a source not divisible by $F$ can still have helpers that retain $F$.

## Exact two-equation comparisons

Differentiating $F(X,f,f',\gamma)=0$ gives the additional relation

$$
F_X+RF_Y+2SF_R=0.
$$

The experiments compare contact modulo the component alone with contact using both relations. One complete eight-node calculation over $\mathbb F_{65537}$ gives:

| Construction | Kernel dimension | Dimension modulo global $F$ |
|---|---:|---:|
| Single relation | 194 | 4 |
| Paired relation with a power condition | 196 | 6 |
| Separate derivative conditions using both relations | 200 | 10 |

Full polynomial reduction verifies the additional source directions. The proper-helper image remains dimension 4, so the improvement is in the available retained-source space, not in proper-helper escape.

Nearby controls behave differently. A complete-ideal calculation for a tight combination-variable-dependent example gives equal ranks 163 and 163. Higher derivative-variable degrees also produce both gains and no-gain controls.

The degree in $Z$ is especially important: a component can have modest joint $Y,R$-degree but large total degree. Suppressing $Z$ can remove the constraint that dominates the real construction.

## Bounded multipliers versus complete ideals

A search over polynomial multiples up to a chosen degree produces sufficient ideal-membership witnesses. It need not capture cancellations between higher-degree multiples.

A complete Gröbner-basis calculation answers a different question. The two methods should agree on explicit reduction identities, but their rank estimates need not agree until the bounded multiplier space is sufficient.

For helper restriction, a nonzero evaluation at one valid point witnesses nondivisibility. Vanishing at sampled points does not establish an identically zero restriction. The latter requires a polynomial identity or another complete argument.

## Successive differential equations

Put $H=F_R$, $G=-F_X-RF_Y$, and define the cleared derivation

$$
\mathcal D=H\partial_X+HR\partial_Y+G\partial_R.
$$

Starting from $N_2=G$, the recurrence

$$
N_{k+1}=H\mathcal D(N_k)-(2k-3)N_k\mathcal D(H)
$$

represents successive derivatives on $H\ne0$. For bounded-degree polynomial solutions, sufficiently high derivative numerators vanish.

Adding a third tail equation reduces algebraic quotient lengths from 20 to 2 and from 16 to 4 in two small examples. These lengths include multiplicity; they are not automatically counts of distinct finite-field parameters.

A complementary control uses

$$
F=R-Y-Z^2-h(Z)X^{w+1},\qquad h(Z)=Z(Z-1)(Z-2).
$$

Here $w$ bounds the message degree. When $(w+1)!\ne0$, the first two relevant tails already generate the ideal $(h(Z),Y+Z^2)$ on the component. Later tails add no restriction. Thus an additional differential equation does not guarantee a strict saving, even on a finite regular solution set.

## Derivative strata avoid a discriminant shortcut

A polynomial such as $(S-a)^4$ has an identically zero discriminant but still has a root. Under suitable degree and characteristic conditions, a repeated root can instead be assigned to a derivative that vanishes while the next derivative does not. Leading-coefficient zeros form a separate case.

This gives an exhaustive decomposition. An efficient count must control the sum of its strata, not merely establish that every root belongs to one.

Related perspective: [Pereira, *Vector Fields, Invariant Varieties and Linear Systems*](https://arxiv.org/abs/math/0011205). Its geometric setting is not a substitute for explicit finite-characteristic degree and counting conditions.
