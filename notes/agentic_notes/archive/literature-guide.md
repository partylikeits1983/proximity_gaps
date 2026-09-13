# Literature guide for Reed–Solomon soundness

Read a theorem for its domain, field, quantifiers, and quantitative dependence—not only its decoding radius. Generic evaluation sets, smooth subgroups, prime fields, and extension fields are different settings. Ordinary interleaving is also distinct from folding.

## Definitions and reductions

- [Arnon–Boneh–Fenzi, *Open Problems in List Decoding and Correlated Agreement*](https://eprint.iacr.org/2026/680): the relationship between list decoding and correlated-agreement questions.
- [Gopalan–Guruswami–Raghavendra, *List Decoding Tensor Products and Interleaved Codes*](https://arxiv.org/abs/0811.4395): reductions between base-code and interleaved list decoding. Transfer of a radius does not mean equality of finite list-size bounds.
- [Ben-Sasson–Carmon–Ishai–Kopparty–Saraf, *Proximity Gaps for Reed–Solomon Codes*](https://eprint.iacr.org/2020/654): interpolation and proximity-gap methods underlying several constructions.

## Beyond Johnson

- [Muralidhara–Sen, *Improvements to the Johnson Bound for Reed–Solomon Codes*](https://www.cse.iitd.ac.in/~ssen/journals/dam.pdf): finite-length movement beyond the Johnson radius. A constant number of additional errors is a relative-radius gain that shrinks with block length.
- [Shangguan–Tamo, *Combinatorial List-Decoding of Reed–Solomon Codes Beyond the Johnson Radius*](https://arxiv.org/abs/1911.01502): combinatorial techniques for extending decoding guarantees.
- [Guruswami–Shangguan–Tamo, *List-Decoding and List-Recovery of Reed–Solomon Codes Beyond the Johnson Radius*](https://arxiv.org/abs/2105.14754): related list-decoding and recovery bounds.

## Generic domains and hidden derivatives

- [Brakensiek–Gopi–Makam, *Generic Reed–Solomon Codes Achieve List-Decoding Capacity*](https://arxiv.org/abs/2206.05256): higher-order genericity techniques. A theorem for generic points cannot be substituted for a prescribed subgroup without checking its hypotheses.
- [*Algorithmic List Decoding of Reed–Solomon Codes up to Capacity*](https://eccc.weizmann.ac.il/report/2026/164/revision/1/): prescribed evaluation sets over prime fields; distinguish algorithmic field restrictions from geometric counting statements.
- [Jeronimo, *Algorithmic List Decoding at Capacity and Optimal Proximity Gaps for Reed–Solomon Codes*](https://eccc.weizmann.ac.il/report/2026/169/): hidden derivatives and solution geometry. Finite applications require the characteristic conditions and explicit degree/count dependence, not just an unspecified polynomial bound.

## Multiplicity and differential structure

- [Mattarei, *Root Multiplicities and Number of Nonzero Coefficients of a Polynomial*](https://arxiv.org/abs/math/0512239): sparse polynomials and repeated roots, with characteristic-sensitive hypotheses.
- [Pereira, *Vector Fields, Invariant Varieties and Linear Systems*](https://arxiv.org/abs/math/0011205): the distinction between one derivative divisor and an ideal of successive differential conditions. Its geometric setting must be checked before transferring conclusions to finite fields.

## From coding bounds to protocol costs

- [FRI](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14): the relation between low-degree testing and query complexity.
- [WHIR](https://eprint.iacr.org/2024/1586): proximity testing and mutual correlated agreement in a protocol setting.

For a concrete protocol, account for every error term and every transmitted object. A reduction-error improvement, a query-score improvement, a smaller Lean certificate, and a smaller serialized cryptographic proof are distinct outcomes.
