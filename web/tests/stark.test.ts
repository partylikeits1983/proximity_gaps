import { describe, expect, it } from 'vitest';
import { evaluate, mod } from '../src/core/math';
import {
  fft,
  friFoldPair,
  interpolate,
  lagrangeBasis,
  lowDegreeExtension,
  multiplicativeDomain,
  rootOfUnity,
  starkSizes,
} from '../src/core/stark';

describe('STARK polynomial representations', () => {
  it('matches direct evaluation and recovers every coefficient in each supported FFT domain', () => {
    for (const q of [5, 7, 17])
      for (const size of [1, 2, 4, 8, 16]) {
        if ((q - 1) % size !== 0) continue;
        const domain = multiplicativeDomain(size, q);
        expect(new Set(domain).size).toBe(size);
        for (const seed of [0, 1, 3, q - 1]) {
          const coefficients = Array.from({ length: size }, (_, i) =>
            mod(seed * (i + 1) + i * i, q),
          );
          const values = fft(coefficients, q);
          expect(values).toEqual(domain.map((x) => evaluate(coefficients, x, q)));
          expect(fft(values, q, true)).toEqual(coefficients);
          expect(interpolate(domain, values, q)).toEqual(coefficients);
        }
      }
  });
  it('constructs Lagrange bases on arbitrary distinct points, including zero', () => {
    const points = [0, 2, 7, 11];
    const basis = lagrangeBasis(points, 17);
    basis.forEach((polynomial, i) => {
      expect(points.map((x) => evaluate(polynomial, x, 17))).toEqual(
        points.map((_, j) => Number(i === j)),
      );
    });
    const values = [4, 0, 12, 9];
    const recovered = interpolate(points, values, 17);
    expect(points.map((x) => evaluate(recovered, x, 17))).toEqual(values);
  });
  it('extends the shared example without changing its polynomial', () => {
    const example = lowDegreeExtension([3, 2, 1], 17, 2);
    expect(example.traceDomain).toEqual([1, 4, 16, 13]);
    expect(example.trace).toEqual([6, 10, 2, 11]);
    expect(example.recovered).toEqual([3, 2, 1, 0]);
    expect(example.codeword).toEqual([6, 11, 10, 15, 2, 3, 11, 0]);
    const larger = lowDegreeExtension([3, 2, 1], 17, 4);
    expect(larger.codeword).toHaveLength(16);
    expect(larger.recovered).toEqual(example.recovered);
    expect(larger.codeword).toEqual(larger.domain.map((x) => evaluate([3, 2, 1], x, 17)));
    expect(lowDegreeExtension([0], 5, 2).codeword).toEqual([0, 0]);
  });
  it('offers only valid domains and rejects undefined arithmetic', () => {
    expect(starkSizes(3, 17)).toEqual({ traceLength: 4, extensions: [2, 4] });
    expect(starkSizes(5, 5).extensions).toEqual([]);
    expect(starkSizes(3, 7).extensions).toEqual([]);
    expect(() => fft([], 17)).toThrow(RangeError);
    expect(() => rootOfUnity(8, 7)).toThrow(RangeError);
    expect(() => fft([1, 2, 3], 17)).toThrow(RangeError);
    expect(() => fft([1, 17], 17)).toThrow(RangeError);
    expect(() => lowDegreeExtension([1, 2, 3], 5, 2)).toThrow(RangeError);
    expect(() => interpolate([1, 1], [2, 3], 17)).toThrow(RangeError);
    expect(() => interpolate([0, 1], [2], 17)).toThrow(RangeError);
    expect(() => friFoldPair(1, 2, 0, 3, 17)).toThrow(RangeError);
  });
});

describe('one FRI fold', () => {
  it('matches even/odd polynomial folding for every challenge and pair', () => {
    const coefficients = [3, 2, 1, 4, 6, 0, 8, 2];
    const { domain, codeword } = lowDegreeExtension(coefficients, 17, 2);
    for (let alpha = 0; alpha < 17; alpha++) {
      const foldedCoefficients = Array.from({ length: 4 }, (_, i) =>
        mod(coefficients[2 * i] + alpha * coefficients[2 * i + 1], 17),
      );
      for (let i = 0; i < 8; i++) {
        const x = domain[i];
        expect(domain[i + 8]).toBe(mod(-x, 17));
        expect(friFoldPair(codeword[i], codeword[i + 8], x, alpha, 17)).toBe(
          evaluate(foldedCoefficients, mod(x * x, 17), 17),
        );
      }
    }
  });
});
