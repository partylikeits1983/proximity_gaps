import { describe, expect, it } from 'vitest';
import { analyzeMca, columnAgreement, interleave, MCA_PRESETS } from '../src/core/agreement';
import { codebook, encode, mod } from '../src/core/math';
import {
  defaultExperiment,
  experimentUrl,
  readLocation,
  validExperiment,
} from '../src/state/model';

describe('interleaved column metric', () => {
  it('encodes independent rows and counts unequal columns once', () => {
    const { rows, columns } = interleave(
      [
        [1, 1],
        [2, 0],
        [0, 2],
      ],
      5,
      5,
    );
    expect(rows).toEqual([
      [1, 2, 3, 4, 0],
      [2, 2, 2, 2, 2],
      [0, 2, 4, 1, 3],
    ]);
    expect(columns[2]).toEqual([3, 2, 4]);
    const same = rows.map((row) => row.map((a, x) => (x === 0 ? mod(a + 1, 5) : a)));
    const different = rows.map((row, j) => row.map((a, x) => (x === j ? mod(a + 1, 5) : a)));
    expect(columnAgreement(rows, same)).toMatchObject({ errors: 1, commonSupport: [1, 2, 3, 4] });
    expect(columnAgreement(rows, different)).toMatchObject({ errors: 3, commonSupport: [3, 4] });
    expect(columnAgreement(rows, different).rowSupports.map((s) => s.length)).toEqual([4, 4, 4]);
  });
  it('requires aligned message lengths and matrix dimensions', () => {
    expect(() => interleave([[1], [1, 2]], 5, 5)).toThrow(RangeError);
    expect(() => columnAgreement([[1]], [[1, 2]])).toThrow(RangeError);
  });
});

describe('exact support-wise MCA event', () => {
  it('separates proximity and failures as the radius grows', () => {
    const { u0, u1 } = MCA_PRESETS.radius;
    expect(
      [0, 1, 2].map((r) => {
        const a = analyzeMca(u0, u1, r);
        return [a.nearCount, a.badCount];
      }),
    ).toEqual([
      [0, 0],
      [2, 2],
      [5, 4],
    ]);
    const a = analyzeMca(u0, u1, 2);
    expect(a.challenges[2]).toMatchObject({ near: true, bad: false });
    for (const challenge of a.challenges) {
      for (const candidate of challenge.candidates) {
        expect(candidate.support.length).toBe(5 - candidate.distance);
        for (const [i, explanations] of candidate.explanations.entries()) {
          for (const c of explanations)
            expect(candidate.support.every((x) => c.word[x] === [u0, u1][i][x])).toBe(true);
        }
      }
    }
  });
  it('a line entirely in the code has proximity one and MCA error zero at every radius', () => {
    const { u0, u1 } = MCA_PRESETS.code;
    for (let radius = 0; radius <= 5; radius++) {
      const result = analyzeMca(u0, u1, radius);
      expect(result).toMatchObject({ nearCount: 5, badCount: 0 });
      result.challenges.forEach((c) =>
        expect(c.word).toEqual(encode([mod(1 + 2 * c.gamma, 5), 1], 5, 5)),
      );
    }
  });
  it('detects cancellation even at radius zero and counts challenges rather than distinct words', () => {
    const { u0, u1 } = MCA_PRESETS.cancellation;
    const a = analyzeMca(u0, u1, 0);
    expect(a).toMatchObject({ nearCount: 1, badCount: 1 });
    expect(a.challenges[1].word).toEqual([0, 0, 0, 0, 0]);
    expect(a.challenges[1].candidates[0].explanations).toEqual([[], []]);
    expect(analyzeMca([0, 0, 0, 0, 0], [0, 0, 0, 0, 0], 0)).toMatchObject({
      nearCount: 5,
      badCount: 0,
    });
  });
  it('matches the definition by independently enumerating every qualifying support', () => {
    const book = codebook(5, 2, 5)!;
    const examples = [
      ...Object.values(MCA_PRESETS),
      { u0: [2, 4, 0, 3, 1], u1: [4, 0, 3, 4, 2] },
      { u0: [1, 3, 2, 0, 4], u1: [0, 0, 0, 0, 0] },
    ];
    const supports = Array.from({ length: 32 }, (_, mask) =>
      Array.from({ length: 5 }, (_, x) => x).filter((x) => (mask & (1 << x)) !== 0),
    );
    const fits = (word: number[], support: number[]) =>
      book.some((c) => support.every((x) => word[x] === c.word[x]));
    for (const { u0, u1 } of examples) {
      const previous = new Set<number>();
      for (let radius = 0; radius <= 5; radius++) {
        const result = analyzeMca(u0, u1, radius);
        for (const challenge of result.challenges) {
          const qualified = supports.filter((s) => s.length >= 5 - radius);
          const bad = qualified.some(
            (s) => fits(challenge.word, s) && (!fits(u0, s) || !fits(u1, s)),
          );
          expect(challenge.bad).toBe(bad);
          expect(challenge.near).toBe(qualified.some((s) => fits(challenge.word, s)));
          if (previous.has(challenge.gamma)) expect(challenge.bad).toBe(true);
          if (challenge.bad) previous.add(challenge.gamma);
        }
      }
    }
  });
});

describe('agreement lesson links', () => {
  it('round trips both lessons and rejects invalid finite-field settings', () => {
    const e = {
      ...defaultExperiment(),
      interleaving: {
        messages: [
          [1, 2],
          [0, 1],
        ],
        errors: [[0], [1], []],
        column: 2,
        corrupt: true,
      },
      mca: MCA_PRESETS.radius,
    };
    for (const id of ['interleaved-rs', 'mutual-correlated-agreement'] as const) {
      const url = new URL(experimentUrl(id, e), 'https://example.test');
      expect(readLocation(url.pathname, url.search)).toEqual({
        lesson: id,
        experiment: { v: 1, ...e },
        notice: '',
      });
    }
    for (const mca of [
      null,
      { ...e.mca, u0: [0] },
      { ...e.mca, gamma: 5 },
      { ...e.mca, radius: 6 },
      { ...e.mca, codeword: 25 },
      { ...e.mca, u1: [0, 0, 0, 0, 5] },
    ]) {
      expect(validExperiment({ ...e, mca })).toBe(false);
    }
    for (const interleaving of [
      null,
      { ...e.interleaving, messages: [] },
      { ...e.interleaving, errors: [[0, 0], [], []] },
      { ...e.interleaving, errors: [[]] },
    ]) {
      expect(validExperiment({ ...e, interleaving })).toBe(false);
    }
    expect(validExperiment(defaultExperiment())).toBe(true);
  });
});
