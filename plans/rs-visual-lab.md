# Reed–Solomon Visual Lab — implementation and UI plan

Status: the first five experiments are implemented in `web/`. The user selected Vercel hosting after this plan was written, so the frontend uses standard React + TypeScript + Vite. See `web/README.md` for current functionality, commands, deployment settings, and planned features. This document records the original design; the README describes the shipped structure.

## 1. Product direction

Build an interactive mathematical notebook inside this research repository. Each screen teaches one idea through an experiment: change a number, move a discrete slider, inspect a word, and immediately see the corresponding mathematical change.

The first release contains five complete lessons. The architecture should accommodate 10–20 lessons without changing the application shell. The main experience is the experiment itself; explanations are short, with definitions and derivations available on demand.

Use `notes/grand_list_decoding.md` for the introductory sequence and `notes/better_codes.md` for the later research sequence. Keep these as ordinary Markdown. Each lesson links to the relevant note and section. UI copy can be shorter than the notes, but notation must agree.

Use one repository and one Git history. Put the TypeScript frontend in `web/`, alongside the current Rust package and notes. A future `lean/` project and shared examples belong to the same repository.

## 2. Overall layout

Desktop target: a fixed-width left navigation rail, approximately 240 px, and a flexible main region with a maximum reading width of approximately 1200 px. At 1440 × 900, the principal visual and its primary control should be visible together.

```text
┌────────────────────────┬─────────────────────────────────────────────────────┐
│ Reed–Solomon           │ 02 / Encoding                                       │
│ Visual Lab             │ From polynomial to codeword                         │
│                        │ Evaluate the same polynomial at more points.        │
│ ENCODING               │                                                     │
│ 01  Tape → polynomial  │ F₁₇     k = 3     n = 8     ρ = 3/8                │
│ 02  Build a codeword ● │                                                     │
│                        │ ┌─────────────────────────────────────────────────┐ │
│ DISTANCE & DECODING    │ │                                                 │ │
│ 03  Measure errors     │ │               MAIN VISUAL                       │ │
│ 04  Grow a Hamming ball│ │                                                 │ │
│ 05  Decode through noise│└─────────────────────────────────────────────────┘ │
│                        │                                                     │
│                        │ Rate / evaluation-count control                     │
│                        │                                                     │
│                        │ One sentence explaining the current result.         │
│                        │                                                     │
│                        │ Definition ▸   Read the notes ↗                     │
│                        │                                                     │
│                        │ Previous                  Reset · Copy link · Next   │
└────────────────────────┴─────────────────────────────────────────────────────┘
```

The reusable lesson shell contains:

1. Step number, title, and a one-sentence question or instruction.
2. A compact parameter strip containing only quantities relevant to this lesson.
3. A large stage occupying most of the screen.
4. The primary control immediately adjacent to the object it changes.
5. A short, state-dependent explanation: for example, “2 of 8 symbols differ.”
6. A collapsed definition/derivation panel and a link to the notes.
7. Previous, next, reset, and copy-experiment-link actions.

Avoid a permanent right settings rail: it would squeeze the diagrams. Advanced controls expand underneath the primary control. Keep tape editors and tables readable instead of shrinking them to fit.

### Navigation as the collection grows

- Use numbered entries with short titles and conceptual groups: Encoding, Distance & Decoding, List Decoding, Structure & MCA.
- Show only implemented lessons. Add future entries when they have actual content.
- Highlight the active lesson with a pale green background, dark text, and a narrow green marker.
- Make the rail independently scrollable. Introduce collapsible groups and title/keyword search when the collection grows beyond approximately ten lessons.
- Keep lesson identity independent of its displayed number. Reordering lessons must not break links.
- Every lesson has a stable route, such as `/visuals/hamming-ball`.
- On phones, replace the rail with a step selector that opens the complete lesson list. Preserve previous/next actions and stack the stage above secondary material.

## 3. Visual language and interaction

### Appearance

- Background: white, `#ffffff`.
- Main text: near-black, `#17211b`; secondary text: `#58645c`.
- Dividers: thin neutral lines, approximately `#e4e9e5`.
- Hamming-ball boundary: forest green, `#15803d`, approximately 2 px.
- Hamming-ball interior: translucent light green, `rgba(34, 197, 94, 0.10)`.
- Valid codewords: dark green stars or diamonds.
- Ordinary ambient words: neutral dots; members of the selected ball become green.
- Received word: a dark outlined point with a persistent `w` label.
- Changed coordinates: restrained amber plus a change marker; errors remain identifiable without color.
- Titles: a readable mathematical-book serif. Controls: a quiet sans serif. Tape values: aligned monospace or tabular numerals.
- Render formulas with KaTeX and include its accessible MathML output. Bundle the required fonts with the site.

Use whitespace and alignment to create hierarchy. Keep shadows minimal and reserve boxes for objects that benefit from boundaries, such as tape cells and tables.

### Behavior

- Update the formula, table, visual, and counts together from one underlying model.
- Hovering or focusing a tape cell highlights its polynomial term. Hovering or focusing a table row highlights its evaluation point and output cell.
- Moving a radius slider uses integer steps. Brief transitions make the change legible, but ball membership is always computed at the current integer radius.
- Use roughly 150–250 ms transitions. Honor reduced-motion preferences and never require watching an animation to understand the result.
- Keep point positions stable while the radius changes. Recompute positions only when the center or relevant mathematical parameters change.
- Tooltips also open on keyboard focus or tap. Numeric inputs, sliders, tabs, and point inspectors work with a keyboard.
- Give sliders explicit names and readouts, such as “Allowed errors: 3 of 8.” Provide buttons or numeric input for exact values.
- Announce useful result changes without narrating every intermediate animation frame.
- Display an accessible list or table for any point cloud. At small widths, reduce labels in the diagram and retain their details in the inspector.

## 4. Shared mathematical model

### First default example

Use a small prime field with familiar displayed integers:

\[
\mathbb F_{17},\qquad (a_0,a_1,a_2)=(3,2,1),\qquad p(X)=3+2X+X^2.
\]

With evaluation points `0, 1, …, 7`:

\[
c=(3,6,11,1,10,4,0,15),\quad k=3,\quad n=8,\quad \rho=3/8.
\]

Always label the field and show that arithmetic is modulo 17. A substitution inspector can explain, for example, `p(3) = 3 + 6 + 9 = 18 ≡ 1 (mod 17)`.

### Parameters and invariants

- `k` is the number of coefficient slots, including trailing zero slots; the actual polynomial degree can be smaller than `k−1`.
- `n` is the number of distinct evaluation points.
- Enforce `1 ≤ k ≤ n ≤ q` for the initial prime-field evaluation construction, which allows zero as an evaluation point.
- Initial field choices should be a small fixed list of primes, such as 5, 7, and 17. Field changes are explicit preset changes so existing values are not silently reinterpreted.
- `ρ = k/n` is a derived value, not an independent floating-point state variable.
- Minimum code distance is `d = n−k+1`.
- Guaranteed unique-decoding radius is `t = floor((d−1)/2)`.
- Actual corruption count is `e = Δ(c,w)`. Search radius is `E`. These are different controls even when a demonstration links them.
- Relative distance between two words is `δ(c,w) = Δ(c,w)/n`. A relative search radius is separately labeled `E/n`.
- All displayed candidate counts come from actual codewords in the specified code.
- Changing coefficients or `n` clears the existing corruption experiment with a visible status message. Navigate between lessons without losing unchanged parameters.

Keep the encoding, distance, and corruption lessons connected through the same example. The binary Hamming-ball lesson has its own clearly labeled toy alphabet and state.

## 5. First five lessons

The proposed learning order puts the standalone Hamming-ball experiment before the decoding-radius experiment. This introduces the geometric object before using it to explain a decoding limit.

### 01 — Tape to polynomial

**Question:** How does a message become a polynomial?

Show a horizontal tape of editable cells on the left and a large typeset polynomial on the right. Under each cell, show its coefficient index. Below the main row, include the compact correspondence table from the notes:

| Position | Value | Term |
|---|---|---|
| 0 | 3 | 3 |
| 1 | 2 | 2X |
| 2 | 1 | X² |

Interactions:

- Edit a field element directly, with integer validation and clear allowed range.
- Append a coefficient with a `+` cell. Remove the final coefficient with a labeled action. Keep at least one slot.
- Append zero initially; animate the new coefficient-to-term relationship without surprising the user with a random value.
- Highlight matching cell, table row, and term on hover/focus.
- Offer a small “Show zero terms” toggle so a zero coefficient remains understandable even when the simplified polynomial omits it.
- Keep `k` and `deg(p) < k` visible. For the zero polynomial, avoid displaying an incorrect ordinary numeric degree.
- If adding a coefficient makes `k > n`, extend the evaluation domain to `n = k` and explain the change. Disable additions at the selected field's supported limit.

**Completion criterion:** every edit and add/remove operation immediately produces a mathematically consistent polynomial and coefficient table.

### 02 — Evaluate to build a codeword

**Question:** What does redundancy add?

Keep a small summary of the tape and polynomial at the top. The main visual is an evaluation table that grows or shrinks with `n`. Display the resulting codeword as a second tape underneath.

| Coordinate | Evaluation point | Substitution | Output |
|---|---|---|---|
| 1 | 0 | p(0) | 3 |
| 2 | 1 | p(1) | 6 |
| 3 | 2 | p(2) | 11 |
| … | … | … | … |

Controls and behavior:

- A rate selector uses attainable values `k/n`, with labels such as `1/2 — 6 evaluations` for `k=3`.
- A matching discrete `n` slider covers `k…q`. Both controls change the same underlying `n`.
- Keep the message fixed when changing rate. Lower rate adds evaluation rows and output cells.
- Provide quick presets when attainable; do not label a rounded choice as an exact requested rate.
- Show `k → n`, the exact fraction and percentage for `ρ`, and `n−k` redundant symbols.
- Expanding a row reveals the substitution and modular reduction.
- Optionally include a discrete `(x,p(x))` plot, secondary to the table. Finite-field evaluations are points; a smooth real-valued curve would teach different arithmetic.
- Do not mark the first `k` evaluations as the original message: this coefficient encoder is not systematic.

**Completion criterion:** the table, output tape, and rate always agree, including the `n=k` no-redundancy endpoint.

### 03 — Measure corruption: Δ and δ

**Question:** How different are the sent and received words?

Show two aligned tapes, clean codeword `c` above received word `w`. Highlight differing coordinates with an amber border, a mismatch marker, and a connector.

Users can edit the received tape, restore a cell, or apply a deterministic error preset. A large readout shows, for example:

\[
\Delta(c,w)=2,\qquad \delta(c,w)=\frac{2}{8}=25\%.
\]

Add an eight-segment strip with one segment per coordinate. This makes the denominator visible and reinforces that Hamming distance counts differing positions, not the size of a numeric difference.

A compact distance scene places `w` on the shell at distance `e` from `c`, with a green boundary showing a chosen comparison radius `E`. Its caption states whether `w ∈ B(c,E)`.

**Completion criterion:** changing any received symbol updates mismatch count, fraction, percentage, and ball membership. Changing an already-wrong symbol to another wrong symbol leaves distance unchanged.

### 04 — Grow a Hamming ball

**Question:** Which words are within a chosen distance of a center?

Use binary words of length five: all 32 elements of `{0,1}⁵`. Start with `w = 00000`. Show every word as a point, organized into concentric shells by its exact Hamming distance from `w`.

The slider `E = 0…5` expands a green ball. Points inside gain green emphasis; outside points remain visible in gray. Show the selected word as a five-cell tape and highlight exactly which positions differ from the center.

For radius zero, highlight just the center; use a small visual halo so the state is still visible.

| E | New words at distance E | Words in B(w,E) |
|---|---:|---:|
| 0 | 1 | 1 |
| 1 | 5 | 6 |
| 2 | 10 | 16 |
| 3 | 10 | 26 |
| 4 | 5 | 31 |
| 5 | 1 | 32 |

The counts come from:

\[
|B(w,E)|=\sum_{j=0}^{E}\binom{5}{j}.
\]

Clicking a point first inspects it; a separate “Use as center” action recenters the scene. This prevents accidental layout changes during exploration.

An optional follow-on toggle marks the toy repetition code `C = {00000,11111}` with stars. Then display both `|B(w,E)|` and `|B(w,E) ∩ C|`. Label this as a repetition code, not an RS code. Include an optional preset center `00111`, for which both codewords enter by radius three.

The scene must explain its geometry: “Rings show distance from the selected center. Distances between other points are not represented.” The drawing cannot preserve every pairwise Hamming distance in two dimensions.

**Completion criterion:** all 32 words are represented exactly once; membership and counts match for every center and radius. Ordinary words and valid codewords remain distinguishable.

### 05 — Decode through noise

**Question:** When does the received word stop identifying the sent message?

Return to the shared RS example. Show the clean and received tapes with an `e = 0…n` corruption slider. Keep the distinct threshold `t` visible on an error-budget axis.

The main ball is centered at the current received word `w`. A dashed ring marks the fixed radius `t`. The growing green ball has search radius `E`, initially linked to `e`. Place displayed codewords on shells using their exact distances to `w`; the sent codeword moves outward as corruption grows.

For the default example:

\[
d=8-3+1=6,\qquad t=\left\lfloor\frac{5}{2}\right\rfloor=2.
\]

Provide an explicit “Guaranteed ambiguity” preset using a second valid polynomial:

\[
p'(X)=3+X+2X^2,\qquad c'=(3,6,13,7,5,7,13,6).
\]

The two codewords differ in exactly six positions. Change those positions in order toward `c'`:

| Actual errors e | Relevant result when E=e |
|---|---|
| 0 | The sent codeword is the sole candidate. |
| 1 | One candidate, within the guaranteed radius. |
| 2 | One candidate, at the guaranteed limit. |
| 3 | Exactly two candidates, each distance three from the received word. |
| 4 | Two candidates; the wrong codeword is closer than the sent one. |
| 6 | The received word is itself the other valid codeword. |

At three errors the received word is `(3,6,13,7,5,4,0,15)`. Exhaustive enumeration of all `17³ = 4913` codewords confirms that its radius-three list consists exactly of the two polynomials above. These data were verified while preparing this plan.

For errors beyond six in this preset, corrupt the formerly shared positions as well, preserving the exact requested error count.

Use precise status text:

- `e ≤ t`: “Recovery of the sent word is guaranteed within this error budget.”
- `e > t`: “The guarantee has ended.” Separately show the actual candidate result.
- Multiple candidates: “These codewords all fit the allowed error budget.”
- No candidates, when independent `E` is too small: “No codeword is within this search radius.”
- A unique candidate beyond the guaranteed regime does not establish that it was the sent word.

Allow users to unlink `E` from `e` in an advanced control. Then they can keep `w` fixed and grow the search ball. This separates corruption from the decoder's allowed budget. List size is monotone in `E` for a fixed center; it need not be monotone when corruption also changes the center.

Use deterministic corruption: increasing the slider changes one additional coordinate, decreasing it restores that coordinate, and “New pattern” explicitly selects another seed. Mark the sent word as information known to the learning simulation; candidate selection itself only uses `C`, `w`, and `E`.

**Completion criterion:** the verified preset reveals one candidate through two errors and exactly two at three. The UI never equates “past t” with universal decoding failure.

## 6. Point clouds, computation, and honesty

Use DOM elements and CSS circles for the first diagrams: they support crisp tape labels, keyboard focus, inspection, and the small binary universe. Introduce Canvas for genuinely dense scenes, with an accessible companion list. Use data-driven plotting libraries for future quantitative plots when needed.

Mathematical data and layout are separate. Compute every distance and membership predicate before placing points. Geometry is an explanation of the data, never the source of a mathematical conclusion.

The binary universe is small enough to show completely. Larger RS ambient spaces are not. Enumerate the codebook only for supported small parameters; never enumerate the entire ambient space `F₁₇⁸`.

For the initial exact-list explorer, use an explicit computation cap, initially at most 10,000 codewords and 250,000 coordinate evaluations per search. The default example fits comfortably. Cache codebooks by field/domain/`k`, and cache word distances when only `E` changes. Use a worker with cancellation if supported searches affect interaction responsiveness.

Encoding and distance work for larger supported tape settings even when enumeration is unavailable. In that case, show the formulas and offer “Load a small exact example” for candidate exploration. Do not silently replace an exact count with a sampled count.

Display a manageable subset of points in dense scenes and say how many are drawn. Counts and candidate tables still refer to the complete enumerated codebook. Keep deterministic selection and stable identities. Displaying a subset must not hide the fact that further candidates exist.

## 7. Frontend and repository architecture

Proposed structure, with future directories marked:

```text
research/
├── Cargo.toml                    # Existing Rust package
├── src/                          # Existing Rust source
├── notes/                        # Existing plain Markdown
├── plans/
│   └── rs-visual-lab.md
├── examples/                     # Versioned shared mathematical fixtures
│   ├── schema.json
│   └── rs-f17-k3-n8.json
├── lean/                         # Future Lean project
└── web/                          # TypeScript package, same Git repository
    ├── package.json
    ├── package-lock.json         # Preserve the chosen scaffold's lockfile
    ├── app/                      # Routes and application layout
    ├── src/
    │   ├── core/                 # Pure field, polynomial, RS, distance functions
    │   ├── components/           # Tape, Math, tables, controls, point inspector
    │   ├── visuals/              # Ball scene, shell layout, mismatch strip
    │   ├── lessons/
    │   │   ├── registry.ts
    │   │   ├── tape-polynomial/
    │   │   ├── evaluation-codeword/
    │   │   ├── hamming-distance/
    │   │   ├── hamming-ball/
    │   │   └── decoding-radius/
    │   ├── state/                # Shared example and route-state serialization
    │   ├── workers/              # Bounded enumeration, when needed
    │   └── styles/               # Tokens and shared layout
    └── tests/                    # Mathematical and key interaction checks
```

### Technology choices

- React and TypeScript for the application and lesson modules.
- Use a standard React + TypeScript + Vite frontend within `web/`, with Vercel SPA routing and deployment configuration.
- KaTeX through one reusable `Math` component for consistent notation and accessible output.
- CSS variables and shared components for the design system.
- A small reducer/context for the shared RS example; component state for selection and expanded details. A large state library is unnecessary initially.
- Vitest for mathematically meaningful unit tests and fixture checks.
- The first five lessons compute locally in the browser; their mathematical engine does not require a service.

Keep Rust, Lean, and TypeScript connected by versioned JSON examples, not by an immediate runtime dependency. Rust can later generate fixtures or run larger experiments; Lean can later verify exact claims. Record the field, ordered evaluation domain, coefficients, received word, radius, expected outputs, and provenance. Encode field elements as decimal strings at the interchange boundary so future large fields do not silently lose integer precision. The first frontend adapter accepts only its documented small-prime range.

Only attach a “Lean verified” label to a result tied to an actual checked theorem or certificate and its revision.

### Adding a lesson

Each lesson exports metadata and its component. A small registry supplies navigation, grouping, search keywords, note links, and lazy loading:

```ts
type LessonDefinition = {
  id: string;
  title: string;
  group: string;
  order: number;
  objective: string;
  keywords: string[];
  note: { path: string; section: string };
  load: () => Promise<{ default: React.ComponentType }>;
};
```

Add a folder, register its metadata, reuse the lesson shell, and add any independent mathematical helper it needs. Do not build a schema-driven page engine or a single component containing twenty conditional branches.

Use a versioned URL representation for compact experiment state: lesson, field, coefficients, domain length or explicit domain, received-word edits, radius, and seed. Initialize from it on direct load and preserve it through back/forward navigation. Copying an experiment link must reproduce its numbers and corruption pattern. Validate imported state and fall back to a named default with an explanation when it is unsupported.

Serve note content or downloadable Markdown through a build-time mapping of the existing `notes/` files so lesson links work on the deployed site. Keep mathematical fixture imports similarly explicit; avoid dependencies on absolute paths on the author's machine.

## 8. Suggested later lessons

These are candidates for the collection, not additional scope for the first implementation.

| Proposed step | Visual | Main interaction and learning outcome |
|---:|---|---|
| 06 | Recover from k evaluations | Select any k clean evaluations and reconstruct the polynomial. Remove one to reveal multiple possibilities. |
| 07 | Why d = n−k+1 | Compare p and q; highlight shared evaluations as roots of p−q, connecting a root bound to code distance. |
| 08 | Enumerate a decoding list | Hold w fixed; grow E and inspect actual candidate polynomials entering B(w,E) ∩ C. |
| 09 | Find the worst received word | On a sufficiently tiny code, enumerate every center and show the true maximum B_C(E). Larger sampled searches must be labeled lower bounds. |
| 10 | Rate and decoding thresholds | Change ρ; compare unique decoding, Johnson, and capacity benchmarks with explicit assumptions and finite-length corrections. |
| 11 | Errors versus erasures | Hide known positions versus replace unknown ones; visualize the budget 2e+s ≤ n−k. |
| 12 | Interleaving | Stack several polynomial evaluation tapes and compare column agreement. |
| 13 | Folding | Bundle consecutive positions of one polynomial's evaluation tape; show how the coordinate alphabet and error count change. |
| 14 | Structured evaluation domains | Traverse a small roots-of-unity subgroup or multiplicative coset and inspect algebraic relations. Clearly label cyclic-order layouts. |
| 15 | MDS through columns | Select columns of a Vandermonde generator matrix and watch exact finite-field rank. |
| 16 | Higher-order MDS | Compare intersections of several spans, using verified small examples and displayed dimensions. |
| 17 | Correlated agreement | Highlight common agreement coordinates in several words and inspect their linear combinations. |
| 18 | Mutual correlated agreement | Vary the field parameter and inspect exceptional combinations against the exact sourced definition. |
| 19 | Soundness in bits | Convert a stated error bound to bits with an exact formula and an explicit parameter regime. |
| 20 | Counterexample workbench | Load a Rust-generated or formally checked fixture and inspect the words and agreement sets that witness its claim. |

Highest-value additions after the first five: interpolation, the polynomial root explanation of minimum distance, and exact list enumeration. Together they explain why the first five experiments behave as they do.

### MCA and research-content requirements

`notes/better_codes.md` explicitly marks its MCA definition as reconstructed and asks for verification. Before implementing lessons 17–18, extract the exact definition and quantifiers from the selected version of WHIR and any follow-up source being illustrated. Distinguish an affine line from the higher-degree parameterized family `u₀ + z u₁ + …`, and distinguish an observed exceptional fraction in one family from a worst-case code parameter.

Use a coordinate-agreement matrix as the primary MCA visual: rows for input words and candidate codewords, columns for coordinates, a clearly marked common agreement set, and a finite-field parameter selector. This offers a more direct explanation of simultaneous agreement than another ball-only scene.

When implementing threshold and current-research lessons, verify source dates, hypotheses, and conventions. Display theorem, conjecture, counterexample, and finite experiment as different kinds of evidence. The asymptotic expression `1−sqrt(ρ)` must not be presented as an exact small-block threshold; the large-alphabet capacity benchmark `1−ρ` must not be presented as a universal proved achievement for every structured RS family.

## 9. Implementation sequence and reviewable milestones

1. **Foundation and first working lesson.** Initialize `web/`; build the shell, typography, responsive rail, `Math`, editable tape, and prime-field polynomial model. Complete lesson 01 so the visual direction can be judged in an actual interaction.
2. **Encoding.** Add the evaluation table, output tape, exact rate controls, shared example state, and lesson 02. Validate the default codeword and rate endpoints.
3. **Distance and balls.** Add the aligned word comparison and the complete 32-word binary universe. Finish lessons 03–04, including inspection, center changes, discrete boundaries, and accessible representations.
4. **Decoding.** Add bounded exact codebook enumeration, deterministic corruption, the guaranteed-radius marker, and the verified ambiguity preset. Finish lesson 05 with correct candidate and guarantee labels.
5. **Integration.** Complete reproducible experiment links, state restoration, note links, small-screen layouts, documentation, and production build checks. Record any visual simplification next to the corresponding diagram.

### Acceptance checks

- Known finite-field evaluations match the shared fixtures, including wraparound, zero coefficients, and the all-zero polynomial.
- The default tape encodes to `(3,6,11,1,10,4,0,15)` at the specified eight points.
- Supported `n` and `k` combinations obey the parameter invariants; trailing zeros do not change `k`.
- Mismatch counting is symmetric and counts coordinates rather than numerical magnitude.
- Binary-ball counts are exactly `1,6,16,26,31,32`; all centers give the same counts.
- Candidate membership agrees with exact distances at `E−1`, `E`, and `E+1` boundaries.
- The three-error ambiguity preset has exactly two candidates, while its two-error state has one.
- Unique-decoding labels follow the theorem's bound and distinguish that bound from the actual observed list.
- Enumeration limits produce an explicit unsupported state, not frozen controls or a fabricated count.
- Adding a lesson requires no changes to the navigation shell.
- Reloading a copied experiment URL reproduces its data and seed.
- Keyboard and touch users can perform the core edit, resize, inspect, recenter, and reset interactions.
- Core type checks, meaningful mathematical tests, and the production build pass. Review the UI against the stated desktop and mobile layouts; run an interactive browser review if requested for implementation.

## 10. Reference anchors

- Local introductory source: [Understanding the Grand List Decoding Challenge](../notes/grand_list_decoding.md), especially sections 1–3.
- Local advanced source: [From the Grand Challenge to better.codes](../notes/better_codes.md), especially section 6 and its definition-verification note.
- RS construction, dimension, and minimum-distance proof: [Guruswami's CMU coding theory notes, lecture 6](https://www.cs.cmu.edu/~venkatg/teaching/codingtheory/notes/notes6.pdf).
- Math rendering: [KaTeX API](https://katex.org/docs/api) and [output options](https://katex.org/docs/options).
- Mathematical tests: [Vitest guide](https://vitest.dev/guide/).
- Formal source to inspect for the later MCA lesson: [WHIR, ePrint 2024/1586](https://eprint.iacr.org/2024/1586).
