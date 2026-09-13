# The first-jet interpolation balance

## The conclusion

The expression is

$$
\delta_0=\frac{4-\sqrt6}{5}\approx0.3101020514.
$$

For 128 independent queries, the query score is $b(\delta)=-128\log_2(1-\delta)$, giving about **68.55 bits** at $\delta_0$. The constant arises from the leading dimension balance of one first-jet interpolation model. It is **not an absolute upper bound on soundness**.

The calculation is useful because it identifies where that model loses its leading source-dimension advantage. It suggests when to improve the model rather than continue tuning its parameters. It neither proves a certificate near 68.55 nor rules out stronger results from another construction.

## 1. The dimension balance

Let $n$ be the code length, $m$ the interpolation multiplicity, and let the derivative-variable cap scale as $s\approx\beta m$. Write $A$ for required agreements and $w$ for the maximum message degree. First-jet interpolation uses the message and its first derivative as auxiliary variables.

In the analyzed first-jet family, the large-$m$ approximation to the coefficient of the total-degree cap $L$ in the sufficient kernel-dimension margin is proportional to $\beta f_A(\beta)$, where

$$
f_A(\beta)=3(A^2-B_0)+3(B_0-Ac)\beta-H_0\beta^2,
$$
$$
B_0=nw,\qquad c=w-1,\qquad H_0=2nw-(w-1)^2.
$$

For the benchmark, $H_0>0$, so this is a concave quadratic. Completing the square gives

$$
4H_0f_A(\beta)=3\Delta(A)
-\bigl(2H_0\beta-3(B_0-Ac)\bigr)^2,
$$
$$
\Delta(A)=4H_0(A^2-B_0)+3(B_0-Ac)^2.
$$

If $\Delta(A)<0$, the quadratic is negative for every $\beta$. If it is positive, a favorable quadratic value is possible, but the chosen $\beta$ must still satisfy the support constraints. Finite-size terms and the remaining source gates also matter.

## 2. Where the square root comes from

To expose the simple expression, approximate the rate-one-half setting by $n=2w$ and replace $w-1$ by $w$. Set $a=A/w$. Dividing the quadratic by $3w^2$ gives

$$
g_a(\beta)=a^2-2+(2-a)\beta-\beta^2.
$$

Its maximum occurs at

$$
\beta_*=\frac{2-a}{2},
\qquad
g_a(\beta_*)=\frac{5a^2-4a-4}{4}.
$$

The positive zero is

$$
a_0=\frac{2+2\sqrt6}{5}.
$$

Since $A/n=a/2$, the corresponding error radius is

$$
1-\frac{a_0}{2}=\frac{4-\sqrt6}{5}.
$$

This is the origin of the constant: optimizing a quadratic tradeoff between coefficient supply and contact constraints. There is no appearance of an extremal received word or an attack in the derivation.

## 3. Relation to the exact parameter point

Keeping the exact $n=262144$ and $w=131071$ shifts the quadratic's numerical transition slightly, to approximately 68.5507 query bits. The checked arithmetic includes

$$
\Delta(180851)<0<\Delta(180852).
$$

The sign change can be reproduced with exact integer arithmetic:

```python
n, w = 262144, 131071
B = n * w
c = w - 1
H = 2 * B - c * c

def delta(A):
    return 4 * H * (A * A - B) + 3 * (B - A * c) ** 2

assert delta(180851) == -46011825252335268
assert delta(180852) == 20176779896417728
```

These identities concern the quadratic model. They do not identify it with the exact finite interpolation dimension or construct a bad received word.

## 4. What this suggests for stronger results

**68.07 is not a mathematical ceiling.** The dimension calculation itself leaves a favorable leading region above it in this family. Exploiting that region requires both a valid finite source and an affordable count of all its solution components.

Progress beyond the family's apparent transition could come from a smaller global rank bound, a different monomial support, component-relative interpolation, higher-jet information, or a different counting theorem. Such changes alter the balance being optimized.

To turn the approximation into a rigorous limitation of this proof family, one would need uniform control of finite terms, floors, parameter ranges, and all allowed supports in that family. To obtain an absolute upper bound, one would instead need an obstruction to the benchmark property itself. These are different research problems.
