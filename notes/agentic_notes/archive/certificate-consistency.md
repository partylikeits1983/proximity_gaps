# Consistency of numerical certificates

## A certificate is a chain of compatible choices

An interpolation source, a component-degree domain, and a counting budget must use the same parameters. Replacing one source can change both its own dimension calculation and the degree resources available downstream.

A useful consistency audit checks the coefficient count, local rank, characteristic conditions, routing domain, and every dependent counting constant independently.

## A finite example

One source receipt records the coefficient count as `1154986853589423`. Recalculation gives `1154859688320800`. With local rank bound `4405925139` and 262144 evaluation nodes, the sufficient kernel margin is

$$
1154859688320800-262144\cdot4405925139
=-127151317216.
$$

The positive-dimension certificate therefore fails. This does not prove that the actual interpolation kernel is empty; it rejects that sufficient receipt.

A replacement source has positive sufficient margin `11154465`, but its slope budget is 34 instead of 33. A complement term using `33-r` must consequently use `34-r` unless another theorem justifies the smaller bound.

The apparent saving from mixing the smaller complement budget with the replacement source is unavailable. Each constant can be individually plausible while their combination is invalid.

## What cached builds can conceal

A downstream module can load a compiled prerequisite even when a fresh build of the edited prerequisite would fail. Checking a leaf against cached imports therefore does not establish consistency of the whole source tree.

The reliable sequence is to rebuild changed prerequisites, verify the exact exported theorem and metadata, and replay the required declaration closure. A small axiom list alone does not detect a theorem that assumes the missing estimate as a hypothesis.

## General lesson

Treat a candidate as one parameterized object. Keep its source receipts, degree caps, branch conditions, and error allocations together. Never combine the best-looking constants from different candidates without proving that they are simultaneously valid.
