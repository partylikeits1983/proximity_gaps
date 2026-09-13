# Visual sequence for the soundness research notes

Plan written 2026-09-13, before implementation. Source collection: [notes/agentic_notes](../notes/agentic_notes/README.md). Keep the existing lessons and their stable URLs. The foundations now lead into interleaving (06), MCA (07), then the STARK connection (08). This sequence extends the UI to eighteen lessons.

## Learning path and delivery

The first build adds two working lessons: interleaved RS and mutual correlated agreement, following the requested focus on columns, balls, and affine lines. Soundness budgets and interpolation as linear algebra follow next. The rest of the sequence remains planned work.

Each lesson has one main interactive scene, a short question, adjacent controls, and collapsed derivations. Keep the white background, green mathematical objects, amber discrepancies, and typeset formulas. Use exact finite-field examples for algebra and explicitly labeled numerical plots for analytic models.

| Step | Visual | Interaction and intuition | Source | Delivery |
|---|---|---|---|---|
| 06 | Interleaved RS | Edit independent messages; follow each polynomial into its evaluation row. Toggle cell discrepancies; see row supports and their intersection. Move errors into the same/different columns. A column agrees only when every row agrees. | reed-solomon-soundness.md | First build |
| 07 | Mutual correlated agreement | Select γ on an affine line; grow codeword-centered balls, count proximity and MCA failures separately, inspect the exact same-support witness. | reed-solomon-soundness.md; WHIR §4.2 | First build |
| 08 | From codes to proofs | Connect interpolation, low-degree extension, and FRI to the preceding agreement ideas. | codes_to_proofs.md | Existing lesson, moved after MCA |
| 09 | Soundness budget | Move radius and query count; watch the query-score curve. Separately vary assumed exceptional/list bounds and test their sum against a reduction budget. | reed-solomon-soundness.md | Next build |
| 10 | Build an interpolant | Add source monomials. Show contact constraints as matrix rows, exact rank, free directions, and a nonzero kernel witness. | interpolation-and-source-design.md | Next build |
| 11 | Hasse derivatives and jets | Expand f(x+ε) into a tape. Read f(x), D^[1]f(x), D^[2]f(x). Compare ordinary derivatives and factorials in small characteristic. | interpolation-and-source-design.md; contact-and-derivative-methods.md | Second wave |
| 12 | Contact at an agreement node | Substitute X=x+ε and the first-/second-jet expressions. Show coefficients of ε vanishing in order. Distinguish contact from an ordinary root of f. | contact-and-derivative-methods.md | After jets |
| 13 | Roots on the actual support | Select agreement nodes on a root/multiplicity diagram. Accumulate σ_T(H); inspect the strict inequality forcing a quotient to vanish. | contact-and-derivative-methods.md | After contact |
| 14 | Escaping a shared factor | Compare the kernel with its intersection with (F). Show a nonzero kernel whose every member retains F, then a direction that escapes it. | shared-components-and-differential-ideals.md; archive/algebraic-experiments.md | After kernel lesson |
| 15 | Adding a differential equation | Display F and F_X+RF_Y+2SF_R on a jet; compare exact rank spaces. Include a no-gain control. | shared-components-and-differential-ideals.md; archive/algebraic-experiments.md | After jets and factors |
| 16 | Choosing a source support | Layered monomial grid with cutoffs U_h. Highlight every interval required for cancellation. Begin with two costs of 5 and joint reward of 12, then exact small optimization. | search-and-optimization.md; interpolation-and-source-design.md | Third wave |
| 17 | Where the first-jet balance changes | Animate g_a(β), its maximum, and the zero crossing (4−√6)/5. Compare the normalized model and exact finite discriminant signs. | interpolation-family-limit.md | Third wave |
| 18 | From experiment to certificate | Connect source, derivative, component, domain, and budget receipts. Change a parameter and reveal dependent obligations. Distinguish toy evidence, assumed bounds, and checked theorems. | verification-and-proof-engineering.md; archive/certificate-consistency.md; research-directions.md | Third wave |

## 06 — Agreement across columns

Use the shared polynomial as row one. Two to four independent, editable coefficient tapes feed their own displayed polynomials and evaluation rows over the same field and domain. Extra rows are padded or truncated to the shared k slots. Discrepancies add one modulo q; clicking again restores the value.

Layout:
- Aligned message → polynomial → evaluations table. Selecting a column enlarges its tuple below. Each changed cell shows current and expected values.
- Row agreement counts at the right.
- A strip directly beneath the grid marks the common support and differing columns.
- “Same column” and “Different columns” presets introduce one discrepancy per row: the same symbol-error count gives different column distances.
- A selected-column inspector displays sent/received tuples. The alphabet is F_q^ℓ; it does not change a protocol's challenge distribution.

Acceptance: common support equals the intersection of row supports; column errors count once; presets' coordinate/symbol totals are exact; settings survive shared URLs. Truncate out-of-domain discrepancy coordinates consistently if shared q/n changes.

## 07 — Mutual correlated agreement

Use an explicitly separate, exhaustive RS code over F₅ with k=2 and n=5: 25 codewords in 3,125 ambient words. There are five equally likely challenges γ and two editable input words u₀,u₁. No requirement that the received inputs are codewords.

Main scene:
- A five-point parameter strip represents the affine family u₀+γu₁. Each point shows its exact distance to the code and whether it is outside, explained, or an MCA failure.
- A green ball centered on one selectable codeword shows the five line words at their exact distances from that center. Angles are schematic; this is not a planar embedding preserving every distance. The point strip represents parameter order, not Euclidean geometry.
- The radius slider changes the minimum support size n−E. Count all codewords, not just the selected ball; count each challenge once even if balls overlap or challenges give the same word.
- Separate counters: proximity fraction and support-wise MCA failure fraction.
- The witness matrix highlights the same support T in u₀, u₁, the combination, and its candidate codeword. Display a polynomial explanation for each original row, or the exhaustive absence of one. Every candidate support is inspectable.
- Presets: growing radius gives (near,bad) counts (0,0), (2,2), (5,4) at E=0,1,2; cancellation gives a failure even at E=0; a line contained in the code has proximity 1 and failure 0.

Source checked: WHIR, ePrint 2024/1586, PDF retrieved September 13, 2026, §4.2 Definition 4.9. The bad event is existential in T: the combination agrees with some codeword on T, |T|≥n−E, and at least one input has no codeword explanation on that same T. A measured example is not a worst-case bound.

Algorithm: check the full agreement set of each candidate codeword. This covers all supports, because inability to explain a subset implies inability to explain its superset. Verify this reduction independently by enumerating all 32 supports in tests. Handle the zero direction and radius endpoints explicitly. The target research question is the largest admissible radius for a specified uniform error bound, not a geometric area or intersection threshold.

## 09 — Soundness budget

This lesson uses the note's fixed benchmark independently of the small-field tape:
n=262144, K=131072, p=2130706433, q=p^6. Its header shows these parameters instead of the earlier F₁₇ polynomial.

Main scene:
- Plot b(δ)=−t log₂(1−δ), with radius and query controls.
- Default to the exact rational 10345087/33554432. Show floor(nδ)=80820 and A=181324 separately. Moving the integer-error slider uses E/n; a preset restores the original rational threshold.
- Mark 1−sqrt((K−1)/n) as a strict-below Johnson reference. Crossing it does not certify a stronger bound.
- A separate panel displays ε_red≤(M+L)/q. M and L are assumed illustrative bounds, entered as powers of two.
- Check (M+L)·2^λ≤q with BigInt. Keep query and reduction scores separate. Any two-term union bound is explicitly conditional and omits other protocol terms.

Acceptance: reproduce the exact floor/agreement count and approximate query score; test exact gate equality and just-over-bound inputs; larger counts worsen the reduction bound; q=p^6 uses BigInt. Never call the query score whole-protocol security or the assumed inputs a certificate.

## 10 — Build an interpolant

Start with bivariate Q(X,Y), an introductory model before the notes' five-variable jet spaces. V contains monomials X^iY^j with i+(k−1)j≤D and j≤J. The caps keep the space finite even for k=1.

At each node (x,w_x), impose Hasse conditions D^[a,b]Q(x,w_x)=0 for a+b<m. Build and row-reduce the exact matrix over the shared small prime field.

Main scene:
- Clickable monomial lattice, showing weighted degree and included/excluded cells.
- A compact flow: coefficient slots → independent constraints → free coefficients.
- Display the sufficient lower bound max(0,dim V−number of constraints) alongside actual nullity dim V−rank(T).
- Display a concrete nonzero kernel vector and Q when available; directly verify all contact residuals.
- Keep the full matrix in an expandable inspector linked to the monomial/node views.

This is source construction, not a complete list decoder or the advanced source from the notes. A failed sufficient margin is inconclusive. Exact zero nullity settles only the displayed finite system. Nonzero interpolation does not prove factor avoidance or soundness.

## Safeguards for later waves

- 68.55 is a leading-model transition, not a certified finite result or absolute code limit.
- Contact identities must retain characteristic, nonvanishing, and support hypotheses.
- A larger kernel modulo F need not improve the proper-helper image; include no-gain examples.
- The ideal (Y,εZ) explains why normalizing one generator does not justify arbitrary ε cancellation.
- Support optimization includes interval minima and downstream counting costs. A winning toy support is not a uniform theorem.
- MCA requires exact support-wise quantifiers from a pinned primary source. A single support or affine line cannot establish a worst-case bound.
- Archived receipts are attributed examples unless full artifacts are available and reproduced. Markdown alone does not justify a “Lean verified” label.

## Integration

- Keep stable slugs. Place interleaving and MCA at 06–07, then the STARK lesson at 08. Renumber display labels and navigation together; existing shared links remain valid.
- Add typed optional URL-state blocks. Accept old links; validate new arrays, integers, and selectors.
- Use a typed note-source registry so each lesson opens/downloads the appropriate Markdown file.
- Give independent benchmark lessons their own parameter-summary mode. Keep the shared polynomial for algebra lessons.
- Reuse Tape, MathText, controls, diagram colors, and responsive patterns. Use accessible HTML/SVG.
- Put finite-field linear algebra and budget calculations in reusable core modules.
- Compact navigation spacing as groups grow; add search when implemented lessons exceed ten.
- Update the UI README with implemented versus planned status.

## Validation and delivery

First build: exact arithmetic tests, URL round trips and invalid-state tests, interactions, note routing, production build, and desktop/mobile review. Rebuild the local preview on port 4173. Later waves remain explicitly planned. No remote publication is part of this work.

Primary references checked for this bridge:
- [Gopalan–Guruswami–Raghavendra, interleaved codes](https://arxiv.org/abs/0811.4395).
- [WHIR, MCA definition](https://eprint.iacr.org/2024/1586).
- [FRI](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14).

The local notes supply the benchmark and source-design teaching models. New research claims need their own source and hypothesis audit.

## First delivery status

Implemented interleaving (06) and MCA (07), with exact arithmetic, shareable settings, note integration, responsive layouts, and independent support-enumeration tests. Soundness budgets and interpolation remain the next build, followed by the sequenced research visuals above.
