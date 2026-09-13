# Shared components and differential ideals

## The counting split

Work over a field of characteristic different from two. Let an irreducible polynomial $F(X,Y,R,Z)$ define a component, with $Y=f(X)$, $R=f'(X)$, and $Z=\gamma$ on selected message polynomials. An auxiliary equation can either intersect this component properly or retain $F$ as a factor. The first case permits an intersection bound under the theorem's degree and characteristic hypotheses. The second requires separate counting of the retained solutions and exceptional leading-coefficient cases.

Neither branch may be discarded. A small proper-intersection estimate is irrelevant if the expensive retained branch remains possible.

## Choosing a polynomial that avoids a factor

Let $V$ be a finite-dimensional source space and $T_F$ its contact map. The source polynomials divisible by $F$ form $V\cap(F)$. A sufficient condition for a nondivisible kernel element is

$$
\dim V-\operatorname{rank}T_F>\dim\bigl(V\cap(F)\bigr).
$$

This is stronger than positive kernel dimension. Two independent polynomials can share a factor, as can every element of a large interpolation space.

Avoiding $F$ is also different from producing a proper helper. A nondivisible source can have helpers that all retain $F$. Leading-coefficient nondivisibility is another distinct condition. Each property must be checked against the consumer theorem.

## Use the differential equation of the component

If $F(X,f,f',\gamma)=0$, differentiation gives

$$
Q=F_X+RF_Y+2SF_R=0
$$

on the selected jet, with $S=D^{[2]}f=f''/2$. Subscripts denote partial derivatives. Both relations can potentially reduce the contact constraints imposed on an interpolant.

At an agreement node $x$, use the substitution

$$
X=x+\epsilon,\qquad
Y=u_0+u_1Z+\epsilon R-\epsilon^2S+\epsilon^3T,
$$

where $u_0,u_1$ are the received values at that node. Factor out the entire $\epsilon$-valuation of the transformed polynomial:

$$
\operatorname{localize}(F)=\epsilon^\nu F_0.
$$

For the originally $S$-independent component $F$, the normalized differential relation uses

$$
J_0=\mathcal E(F_0),\qquad
\mathcal E=\partial_\epsilon+2S\partial_R+3T\partial_S.
$$

Here $T$ is a third-jet coordinate. The derivation sends the displayed expressions for $X,Y,R$ to $1,R,2S$, respectively, while fixing $Z$. This verifies the chain rule for $F$ in these coordinates. Removing its $\epsilon$-valuation also introduces a multiple of $F_0$, which vanishes on the component.

Two finite encodings have been tested: contact modulo an ideal containing a power of $J_0$, and separate contact conditions for each required $S$-derivative modulo $(F_0,J_0)$. For fixed $F$, both give linear constraints on source coefficients.

The chain rule above does not justify arbitrary further differentiation by $\mathcal E$. Once an equation depends on $S$, higher-jet terms need their own treatment.

## Normalization does not justify every cancellation

Removing the $\epsilon$-factor from $F$ does not make every two-generator ideal $\epsilon$-saturated. For example, in a polynomial ring,

$$
I=(Y,\epsilon Z)
$$

contains $\epsilon Z$ but not $Z$, although $Y$ has no $\epsilon$ factor.

A safe contact interface performs the required cancellation after specialization into a domain where the image of $\epsilon$ is nonzero. Cancellation in that domain is not the same as cancellation in an arbitrary quotient ring.

## What the experiments establish

One complete small example gives source-image dimensions modulo global $F$ of 4, 6, and 10 for the single-equation, paired-power, and separate-derivative constructions. Full-polynomial audits confirm the added directions. The proper-helper image remains dimension 4.

Other supports show no gain. A complete-ideal calculation for a tight $Z$-dependent example gives equal ranks 163 and 163. This matters because the actual component has much larger total degree than joint $Y,R$-degree: ignoring $Z$ removes a major constraint.

A quantitative application requires a uniform rank estimate retaining all degree caps, derivative reserves, and component hypotheses. Small examples demonstrate a mechanism, not a percentage improvement valid for arbitrary parameters.
