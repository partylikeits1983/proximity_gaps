# The Reed–Solomon soundness problem

## Codes and agreement

A Reed–Solomon code over $\mathbb F_q$ consists of evaluations of degree-less-than-$K$ polynomials at $n$ distinct field points, where $1\le K\le n$. Its rate is $\rho=K/n$, and its minimum distance is $n-K+1$.

A received word is within relative radius $\delta$ of a codeword when they agree on at least $(1-\delta)n$ coordinates. List decoding bounds how many codewords can satisfy this condition.

The classical field-size-independent Johnson expression is

$$
\delta_J=1-\sqrt{\frac{K-1}{n}}.
$$

It provides list-size control strictly below this radius. A finite result beyond Johnson does not by itself establish a uniform improvement for an asymptotic family.

## Why interleaving still matters

An $\ell$-fold interleaving stacks $\ell$ codewords into columns. A column agrees only when all its entries agree, so the layers must share an agreement support.

Base-code list bounds can control interleaved list bounds. General reductions preserve the list-decoding radius, but introduce quantitative list-size dependence; the two finite counting problems are not identical. Correlated-agreement arguments also need a transfer theorem that preserves their support conditions. [Gopalan–Guruswami–Raghavendra, *List Decoding Tensor Products and Interleaved Codes*](https://arxiv.org/abs/0811.4395)

There is an algebraic identification: choosing an $\mathbb F_q$-basis of $\mathbb F_{q^\ell}$ turns interleaved RS into ordinary RS over that larger alphabet, on the same evaluation points. This preserves column distance. It does **not** enlarge the field from which a protocol samples its random challenge. In particular, it does not justify replacing a probability denominator $q$ by $q^\ell$.

Interleaving therefore reuses ordinary RS mathematics, but its shared supports, quantitative bounds, and protocol role remain relevant.

## Mutual correlated agreement

For received words $u_0,u_1$, consider $u_\gamma=u_0+\gamma u_1$, with $\gamma$ uniform in $\mathbb F_q$. In the support-wise formulation of mutual correlated agreement (MCA), a bad parameter admits a sufficiently large support $T$ on which $u_\gamma$ is the restriction of a codeword, but at least one input has no codeword explanation on that same support.

The support may depend on $\gamma$. A soundness argument must control the worst case over the inputs and qualifying supports. An estimate for one received word or one selected support is insufficient.

List bounds and MCA bounds serve different roles. A reduction may require both, even when they are proved using related interpolation constructions.

## Three quantities that must remain separate

Suppose the certified reduction error is bounded by

$$
\varepsilon_{\mathrm{red}}\le\frac{M+L}{q},
$$

where $M$ counts exceptional parameters, $L$ is a list contribution, and $q$ is the challenge-field cardinality. Meeting a reduction target $2^{-\lambda}$ requires $M+L\le q2^{-\lambda}$.

A query term instead has the form $(1-\delta)^t$. Its associated score is

$$
b=-t\log_2(1-\delta).
$$

This score is neither $\log_2(q/L)$ nor whole-protocol security. Combining several error terms requires an explicit total error budget.

## A fixed-parameter example

One benchmark uses

$$
n=2^{18},\quad K=2^{17},\quad w=K-1,
\quad p=2130706433,\quad q=p^6,
$$

with 128 spot checks. The rational radius $\delta=10345087/33554432$ gives at least 68.07 query bits. Its integer error budget is $\lfloor n\delta\rfloor=80820$, so the required agreement count is 181324.

This number is a certification milestone, not a decoding limit. Improving a geometric or interpolation estimate matters only if it permits a larger admissible radius while satisfying the separate reduction-error target.

Although the evaluation domain lies in the base field, coefficients and received words may lie in the extension. Probability denominators involve $q$; derivative and factorial nonvanishing depend on the characteristic $p$.

## The main proof challenge

Interpolation supplies auxiliary equations that vanish on close polynomial solutions. Proper intersections can be counted efficiently, but shared components require additional structure: factor avoidance, differential relations, multiplicity bounds, or joint degree accounting.

The central task is therefore not merely finding a nonzero interpolant. It is constructing one whose entire solution geometry admits an affordable uniform count.
