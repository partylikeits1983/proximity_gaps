# Reed–Solomon soundness: methods and evidence

A subject-based reference on finite-parameter Reed–Solomon soundness, polynomial interpolation, and machine-checked counting arguments.

## Reading order

1. [The soundness problem](reed-solomon-soundness.md): codes, agreement, reduction error, and bit scores.
2. [Interpolation and source design](interpolation-and-source-design.md): coefficient spaces, contact constraints, and rank–nullity.
3. [Contact and derivative methods](contact-and-derivative-methods.md): contact order, specialization, and support-sensitive root counting.
4. [Shared components and differential ideals](shared-components-and-differential-ideals.md): factor avoidance and the use of additional equations.
5. [Exact search and optimization](search-and-optimization.md): support selection and numerical certificate design.
6. [The first-jet balance constant](interpolation-family-limit.md): the derivation and meaning of $(4-\sqrt6)/5$.
7. [Designing stronger bounds](research-directions.md): precise questions suggested by these methods.
8. [Verification and proof engineering](verification-and-proof-engineering.md): turning a mathematical argument into a reliable certificate.

The [technical studies](archive/README.md) contain worked examples, construction comparisons, and public sources. Each article defines its own notation and assumptions; this index provides an optional reading order.

## How to read the results

A proved identity, an exact finite experiment, and a proposed generalization have different scopes. The notes retain the assumptions needed to tell them apart. A limitation of an interpolation construction is not automatically an upper bound on the underlying code property.

Numerical targets such as 68.07 are examples of finite certification milestones, not presumed mathematical ceilings. The first-jet balance calculation suggests a proof-family transition near 68.55; different constructions may behave differently.

## Supporting material

- [Literature guide](archive/literature-guide.md)
- [Methods illustrated by public proofs](archive/public-proof-methods.md)
- [Algebraic experiments](archive/algebraic-experiments.md)
- [Construction comparisons](archive/construction-comparisons.md)
