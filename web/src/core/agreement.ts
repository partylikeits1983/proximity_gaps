import { codebook, distance, encode, mod, type Codeword } from './math';

export function interleave(messages: readonly (readonly number[])[], n: number, q: number) {
  if (!messages.length || messages.some((row) => row.length !== messages[0].length))
    throw new RangeError('Interleaved messages must have the same number of coefficient slots.');
  const rows = messages.map((message) => encode(message, n, q));
  const columns = Array.from({ length: n }, (_, x) => rows.map((row) => row[x]));
  return { rows, columns };
}

export function columnAgreement(
  reference: readonly (readonly number[])[],
  received: readonly (readonly number[])[],
) {
  if (
    !reference.length ||
    reference.length !== received.length ||
    reference.some(
      (row, i) => row.length !== reference[0].length || row.length !== received[i].length,
    )
  )
    throw new RangeError('Compare two matrices of the same dimensions.');
  const rowSupports = reference.map((row, j) =>
    row.flatMap((value, x) => (value === received[j][x] ? [x] : [])),
  );
  const commonSupport = rowSupports[0].filter((x) =>
    rowSupports.every((support) => support.includes(x)),
  );
  return { rowSupports, commonSupport, errors: reference[0].length - commonSupport.length };
}

export const MCA_Q = 5;
export const MCA_N = 5;
export const MCA_K = 2;

export type McaSettings = {
  u0: number[];
  u1: number[];
  radius: number;
  gamma: number;
  codeword: number;
};

export const MCA_PRESETS: Record<'radius' | 'cancellation' | 'code', McaSettings> = {
  radius: { u0: [3, 4, 2, 2, 1], u1: [1, 0, 2, 4, 3], radius: 1, gamma: 1, codeword: 0 },
  cancellation: { u0: [0, 0, 0, 1, 2], u1: [0, 0, 0, 4, 3], radius: 0, gamma: 1, codeword: 0 },
  code: { u0: [1, 2, 3, 4, 0], u1: [2, 2, 2, 2, 2], radius: 0, gamma: 0, codeword: 6 },
};

export function agreementSupport(a: readonly number[], b: readonly number[]) {
  if (a.length !== b.length) throw new RangeError('Words must have the same length.');
  return a.flatMap((value, x) => (value === b[x] ? [x] : []));
}

export function explanations(
  book: readonly Codeword[],
  word: readonly number[],
  support: readonly number[],
) {
  return book.filter((c) => support.every((x) => c.word[x] === word[x]));
}

export type McaCandidate = {
  index: number;
  distance: number;
  support: number[];
  explanations: [Codeword[], Codeword[]];
  bad: boolean;
};

/** Exact two-row instance of WHIR, ePrint 2024/1586, Definition 4.9
 * (PDF retrieved 2026-09-13). This is the event, not a uniform error bound.
 * It suffices to check each candidate's full agreement set A: a bad subset
 * T ⊆ A implies a bad A, since an explanation on A would also explain T.
 * Conversely a bad A is itself a qualifying witness. No supports are sampled.
 */
export function analyzeMca(u0: readonly number[], u1: readonly number[], radius: number) {
  if (
    [u0, u1].some(
      (word) =>
        word.length !== MCA_N || word.some((a) => !Number.isInteger(a) || a < 0 || a >= MCA_Q),
    ) ||
    !Number.isInteger(radius) ||
    radius < 0 ||
    radius > MCA_N
  )
    throw new RangeError('This exhaustive MCA model uses two words in F₅⁵ and radius 0…5.');
  const book = codebook(MCA_Q, MCA_K, MCA_N)!;
  const challenges = Array.from({ length: MCA_Q }, (_, gamma) => {
    const word = u0.map((a, x) => mod(a + gamma * u1[x], MCA_Q));
    const distances = book.map((c) => distance(c.word, word));
    const candidates: McaCandidate[] = book.flatMap((c, index) => {
      if (distances[index] > radius) return [];
      const support = agreementSupport(c.word, word);
      const inputExplanations: [Codeword[], Codeword[]] = [
        explanations(book, u0, support),
        explanations(book, u1, support),
      ];
      return [
        {
          index,
          distance: distances[index],
          support,
          explanations: inputExplanations,
          bad: inputExplanations.some((items) => items.length === 0),
        },
      ];
    });
    return {
      gamma,
      word,
      distances,
      nearest: Math.min(...distances),
      candidates,
      near: candidates.length > 0,
      bad: candidates.some((candidate) => candidate.bad),
    };
  });
  return {
    book,
    challenges,
    nearCount: challenges.filter((challenge) => challenge.near).length,
    badCount: challenges.filter((challenge) => challenge.bad).length,
  };
}
