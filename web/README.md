# Reed–Solomon Visual Lab

An interactive mathematical notebook for learning Reed–Solomon codes, Hamming distance, and list decoding in the context of STARKs. Built with TypeScript, React, and Vite, with a white paper-like interface, editable tapes, typeset mathematics, and green Hamming balls.

This is a frontend package inside the research repository. It shares the repository's Git history with the Rust code, Markdown notes, and future Lean work.

## Run locally

Use Node.js 22.12 or newer.

```sh
cd web
npm ci
npm run dev
```

Open the local URL printed by Vite. Each experiment has its own URL under `/visuals/`. The application computes locally in the browser and requires no API keys or backend.

```sh
npm run typecheck
npm test
npm run format:check
npm run build
npm run preview
```

`npm run build` checks TypeScript and writes the production site to `dist/`. `npm test` runs mathematical, serialization, and interaction tests. `npm run test:watch` watches tests during development.

Use `npm run format` to format the frontend's TypeScript, styles, configuration, and documentation with Prettier.

## Implemented experiments

| Step | Experiment           | Interactions                                                                                                                       |
| ---- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 01   | Tape to polynomial   | Edit coefficients, add/remove slots, inspect the coefficient-to-term mapping, and reveal zero terms.                               |
| 02   | Build a codeword     | Change the rate or evaluation count; inspect modular evaluation arithmetic and the resulting output tape.                          |
| 03   | Measure errors       | Edit the received word, compare mismatched positions, and see absolute distance Δ, relative distance δ, and ball membership.       |
| 04   | Grow a Hamming ball  | Explore all 32 binary words of length five, change the center and radius, and optionally highlight the repetition code.            |
| 05   | Decode through noise | Introduce deterministic errors, cross the guaranteed decoding radius, and inspect the exact list of candidate RS codewords.        |
| 06   | From codes to proofs | Edit trace evaluations, recover the polynomial with IFFT/Lagrange interpolation, extend it with FFT, and inspect a local FRI fold. |

The default RS example uses the prime field F₁₇, coefficients `[3, 2, 1]`, and evaluation points `0…7`. Its codeword is `[3, 6, 11, 1, 10, 4, 0, 15]`. Its minimum distance is 6 and its guaranteed unique-decoding radius is 2.

The guided corruption pattern has exactly one candidate at two errors and exactly two at three errors. The **Three-error example** button loads that ambiguity directly. The shared fixture is [rs-f17-k3-n8.json](../examples/rs-f17-k3-n8.json).

Experiments share the current polynomial and received word. Changing coefficients, block length, or field restores the received word to the new clean codeword. A compact polynomial stays visible in the later RS steps; the binary Hamming-ball universe has separate settings. **Reset** restores all experiments to their defaults.

**From codes to proofs** uses the same polynomial on a roots-of-unity domain. The initial trace is [6, 10, 2, 11] on [1, 4, 16, 13] in F₁₇. Its eight-value LDE is [6, 11, 10, 15, 2, 3, 11, 0]. The different evaluation points explain why this codeword differs from step 02. The trace length m is the next power of two at least as large as the message's coefficient count, with zero padding. Its degree bound is less than m, and the LDE rate is m/N.

The four views distinguish the prover's interpolation and extension work from the verifier's local folding relation. Change the first folded entry, then inspect different query pairs to see a failure or a missed alteration. This computes exact field arithmetic; it does not implement Merkle authentication, Fiat–Shamir, multiple FRI rounds, computation constraints, or zero-knowledge masking. A passing local check is not a complete proof. Fields or message lengths without a suitable FFT extension offer an explicit F₁₇ preset.

**Copy link** preserves the full experiment, including the field, message, received word, radius, and deterministic seed. Browser back/forward navigation restores the settings in those URLs. There is no browser-storage dependency.

## Deploy on Vercel

Import the **whole research repository** into Vercel and configure:

| Setting                                                              | Value                               |
| -------------------------------------------------------------------- | ----------------------------------- |
| Root Directory                                                       | `web`                               |
| Framework Preset                                                     | Vite                                |
| Install Command                                                      | `npm ci`                            |
| Build Command                                                        | `npm run build`                     |
| Output Directory                                                     | `dist`                              |
| Node.js Version                                                      | `22.x` or a newer supported version |
| Include source files outside of the Root Directory in the Build Step | Enabled                             |

The last setting lets Vite read the existing Markdown notes from `../notes/`. Tests also consume fixtures from `../examples/`. The notes are bundled at build time, so the deployed app does not depend on a local filesystem or a separate notes server.

[vercel.json](./vercel.json) includes the SPA rewrite required for opening or refreshing a deep link such as `/visuals/hamming-ball`. No deployment has been created by this implementation.

See [Vercel's Vite documentation](https://vercel.com/docs/frameworks/frontend/vite) for SPA routing and its [monorepo FAQ](https://vercel.com/docs/monorepos/monorepo-faq) for including files outside the root directory.

## Structure

```text
web/
├── src/
│   ├── App.tsx                 Shared shell, navigation, and note access
│   ├── main.tsx                Application entry and bundled fonts
│   ├── core/math.ts            Pure small-field math and bounded enumeration
│   ├── core/stark.ts           Lagrange interpolation, FFT/IFFT, LDE, and FRI pair arithmetic
│   ├── state/
│   │   ├── model.ts            Experiment types, validation, URL format
│   │   └── ExperimentContext.tsx
│   ├── components/             Math, tape, controls, and notes dialog
│   ├── visuals/BallScene.tsx    Distance-shell layout and green ball rendering
│   ├── lessons/
│   │   ├── registry.ts         Lesson metadata and lazy imports
│   │   └── *.tsx               One module per experiment
│   └── styles.css              Shared styles and responsive layout
├── tests/                      Math, links, and primary interactions
├── vite.config.ts
└── vercel.json
```

Add an experiment by creating a lesson module, adding its stable ID to `LESSON_IDS` in `src/state/model.ts`, and registering its metadata and lazy import in `src/lessons/registry.ts`. The shell automatically supplies navigation, grouping, step headings, note access, and previous/next links. Add the mathematics to `core/` rather than embedding it in layout code.

The notes remain ordinary Markdown in [notes/](../notes/). The notes dialog renders the relevant section of [grand_list_decoding.md](../notes/grand_list_decoding.md), or [codes_to_proofs.md](../notes/codes_to_proofs.md) for the STARK lesson, with math support and a download of the source. Mermaid blocks in the source are displayed as code.

## Mathematical conventions and limits

- The initial arithmetic engine supports the prime fields F₅, F₇, and F₁₇. Switching fields loads a fresh preset. It does not silently reinterpret an existing experiment.
- The message has `k` coefficient slots, even when trailing coefficients are zero. The zero polynomial has no ordinary nonnegative degree.
- The first five lessons use the ordered RS domain `0…n−1`. Parameters satisfy `1 ≤ k ≤ n ≤ q`. The STARK lesson uses its own power-of-two multiplicative domains, with `m < N` and `N` dividing `q−1`; it does not reinterpret the earlier received word on those domains.
- Rate is the exact derived fraction `k/n`; the rate selector only offers attainable choices.
- Errors `e = Δ(c,w)` and search radius `E` are separate quantities. They can be linked for the guided decoding experiment.
- Crossing `t = floor((n−k)/2)` ends the worst-case unique-decoding guarantee. A particular received word can still have a unique candidate beyond it.
- All candidate lists are computed from the actual RS codebook. Enumeration is capped at 10,000 codewords and 250,000 coordinate evaluations per search. Unsupported settings remain usable for encoding and distance, and offer an explicit small-example fallback for enumeration.
- The decoding diagram draws a labeled subset of codewords; its count searches the complete supported codebook. It does not enumerate the ambient space F₁₇⁸.
- Ball membership uses exact Hamming distances. Circular layouts preserve distance from the selected center, not all pairwise distances. Small visual padding lets markers on the boundary remain readable.
- The binary repetition code `{00000,11111}` is a separate teaching example, not a Reed–Solomon code.
- Shared JSON fixtures encode field elements as decimal strings to support future Rust/Lean examples without JavaScript integer rounding. The current TypeScript engine accepts only its documented small fields.
- Exhaustive checks are not Lean proofs. The fixture records that it is not formally verified.

## Planned features

These are future experiments, separate from the six implemented lessons. Selecting arbitrary interpolation points, understanding minimum distance through roots, and following FRI through multiple rounds are the next priorities.

| Planned visual                       | What the interaction will teach                                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Recover from any k evaluations       | Select clean evaluation points and reconstruct the message polynomial; remove one to see the remaining freedom. |
| FRI across rounds                    | Follow linked queries through successive folds, Merkle authentication, and the final degree check.              |
| From constraints to proximity        | Connect trace constraints, quotient polynomials, and low-degree testing in a complete STARK example.            |
| Why d = n−k+1                        | Compare two polynomials and relate shared evaluations to the roots of their difference.                         |
| Explore an actual decoding list      | Hold a received word fixed, grow its ball, and inspect candidate polynomials as they enter.                     |
| Find the worst received word         | Compare a particular list with the maximum list size over all centers in a fully enumerable tiny example.       |
| Rate versus decoding thresholds      | Compare unique decoding, Johnson, and capacity benchmarks with their assumptions and finite-length corrections. |
| Errors versus erasures               | Compare unknown corruptions with known missing positions and explore the budget `2e+s ≤ n−k`.                   |
| Interleaving                         | Stack polynomial evaluation tapes and inspect simultaneous column agreement.                                    |
| Folding                              | Bundle positions of one evaluation tape and see how the alphabet and Hamming metric change.                     |
| Roots-of-unity domains and cosets    | Traverse structured evaluation domains and inspect their algebraic relations.                                   |
| MDS through generator-matrix columns | Select Vandermonde columns and compute their exact finite-field rank.                                           |
| Higher-order MDS                     | Inspect intersections of several column spans using verified small examples.                                    |
| Correlated agreement                 | Highlight shared agreement coordinates and inspect combinations of words.                                       |
| Mutual correlated agreement (MCA)    | Vary a field parameter and inspect exceptional combinations against the exact sourced definition.               |
| Soundness in bits                    | Convert stated error bounds into bits with explicit parameters and hypotheses.                                  |
| Counterexample workbench             | Load Rust-generated or formally checked fixtures and inspect their words and agreement sets.                    |

For MCA, [better_codes.md](../notes/better_codes.md) flags its informal definition for verification. Implementing that lesson requires checking the precise definition and quantifiers in the selected version of [WHIR](https://eprint.iacr.org/2024/1586). A measured exceptional fraction for one example must remain distinct from a worst-case theorem.

The longer design and implementation plan is [plans/rs-visual-lab.md](../plans/rs-visual-lab.md).
