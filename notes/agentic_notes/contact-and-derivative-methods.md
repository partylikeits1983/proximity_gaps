# Contact and derivative methods

## What contact measures

Contact records how strongly an auxiliary polynomial vanishes near an agreement node, including the relations between a message and its derivatives. It is more structured than ordinary root multiplicity.

At a node $x$, the second-jet substitution has the form

$$
X=x+\epsilon,\qquad
Y=u_0+u_1Z+\epsilon R-\epsilon^2S+\epsilon^3T.
$$

Here $u_0,u_1$ are the received values at $x$, $Z$ is the combination parameter, and $R,S$ represent the first and second Hasse derivatives of a candidate polynomial. The variable $\epsilon$ measures displacement from the node; $T$ is a local auxiliary coordinate for the higher-order remainder. Divisibility by powers of $\epsilon$ expresses contact in these coordinates. Any transfer from a different contact definition requires an explicit substitution identity.

## A degree-sensitive contact bound

For first-jet contact, define $\nu_x(F)$ as the $\epsilon$-adic order after substituting $X=x+\epsilon$ and $Y=u_0+u_1Z+\epsilon R$. If $X-x$ does not divide $F(X,Y,R,Z)$, then

$$
\nu_x(F)\le\deg_Y F+\deg_R F.
$$

The argument compares the contact vanishing of translated coefficient blocks with their available polynomial degrees. For an irreducible component of positive $R$-degree, the nondivisibility condition follows automatically.

For example, degree bounds 48 and 11 give contact order at most 59. This is a local bound. It does not tell us how contact orders are distributed across nodes or how many bad combination parameters exist.

## Count derivative roots on the actual support

Let $f$ be a selected solution of $F(X,f,f',\gamma)=0$, and let $\operatorname{spec}$ denote this substitution. Define

$$
H(X)=F_R(X,f(X),f'(X),\gamma).
$$

Regularity requires $H\ne0$. Now let $T$ denote the set of agreement nodes, rather than the auxiliary coordinate above. Define its support-root mass by

$$
\sigma_T(H)=\sum_{x\in T}\operatorname{ord}_x H.
$$

Always $\sigma_T(H)\le\deg H$. Roots outside the support do not need to be charged.

Let $Q$ be another auxiliary polynomial and let $j\ge0$ be an integer. Suppose $F^jQ$ has interpolation contact of order $m$ and specialization sends $F$ to zero. Differentiation gives

$$
\operatorname{spec}\bigl(\partial_R^j(F^jQ)\bigr)
=j!H^j\operatorname{spec}(Q).
$$

Assume $j!\ne0$ and that the product has multiplicity at least $m-j$ at every point of $T$. If $\operatorname{spec}(Q)\ne0$, root counting implies

$$
(m-j)|T|\le\deg\operatorname{spec}(Q)+j\sigma_T(H).
$$

The strict reverse inequality therefore forces the quotient to vanish. This includes repeated roots and needs no squarefreeness assumption. In positive characteristic, factorial nonvanishing depends on the characteristic, not the field cardinality.

## Counting by support-root mass

A stronger propagation condition can separate parameters into two classes:

- Low support-root mass, for which a cheap component bound applies.
- High support-root mass, which needs another bound.

Proving the partition does not control the second class. Regularity alone does not imply a degree saving, and a generic discriminant argument may fail because a relevant specialization can vanish identically.

Useful additional hypotheses include many selected solutions, their shared supports, divisibility of the interpolation space, or absence of a large affine-pencil explanation. Here an affine pencil means solutions of the form $f_\gamma=f_0+\gamma f_1$ on the required supports. A counting theorem must explain how its hypotheses restrict the high-mass class.
