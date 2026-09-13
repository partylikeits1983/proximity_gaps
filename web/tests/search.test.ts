import { describe, expect, it } from 'vitest';
import { codebook, distance, encode } from '../src/core/math';
import { listWithoutEnumeration } from '../src/core/search';

describe('exact lists without enumerating the code', () => {
  it('agrees with exhaustive search whenever its distance argument determines a list', () => {
    const book = codebook(5, 2, 5)!;
    const reference = [1, 2];
    const sent = encode(reference, 5, 5);
    for (let changed = 0; changed <= 5; changed++) {
      const received = sent.map((value, index) => (index < changed ? (value + 1) % 5 : value));
      for (let radius = 0; radius <= 5; radius++) {
        const result = listWithoutEnumeration(reference, received, 5, radius);
        if (result !== null) {
          const actual = book.filter((entry) => distance(entry.word, received) <= radius);
          expect(result.map((entry) => entry.word)).toEqual(actual.map((entry) => entry.word));
        }
      }
    }
  });
  it('returns one known word, an empty ball, or unknown distinctly for a large codebook', () => {
    const reference = [14, 1, 4, 16];
    const sent = encode(reference, 8, 17);
    expect(codebook(17, 4, 8)).toBeNull();
    expect(listWithoutEnumeration(reference, sent, 17, 0)).toHaveLength(1);
    expect(listWithoutEnumeration(reference, sent, 17, 4)).toHaveLength(1);
    expect(listWithoutEnumeration(reference, sent, 17, 5)).toBeNull();
    const received = sent.map((value, i) => (i < 2 ? (value + 1) % 17 : value));
    expect(listWithoutEnumeration(reference, received, 17, 0)).toEqual([]);
    expect(listWithoutEnumeration(reference, received, 17, 2)).toHaveLength(1);
    expect(listWithoutEnumeration(reference, received, 17, 3)).toBeNull();
  });
  it('recognizes a different valid codeword at radius zero by interpolation', () => {
    const other = encode([1, 3, 2, 1], 8, 17);
    const result = listWithoutEnumeration([14, 1, 4, 16], other, 17, 0);
    expect(result).toHaveLength(1);
    expect(result![0].coefficients).toEqual([1, 3, 2, 1]);
    expect(result![0].word).toEqual(other);
  });
});
