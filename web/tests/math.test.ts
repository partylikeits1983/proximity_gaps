import { describe, expect, it } from 'vitest';
import fixture from '../../examples/rs-f17-k3-n8.json';
import {
  ballSize,
  BINARY_WORDS,
  binaryWord,
  candidates,
  codebook,
  corrupt,
  degree,
  distance,
  encode,
  enumerationSupported,
  evaluate,
  parameters,
  polynomialTex,
} from '../src/core/math';

describe('Reed–Solomon construction', () => {
  it('matches the shared finite-field fixture', () => {
    const encoded = encode(
      fixture.coefficients.map(Number),
      fixture.evaluationDomain.length,
      Number(fixture.field.modulus),
    );
    expect(encoded).toEqual(fixture.codeword.map(Number));
    expect(encode(fixture.alternativeCoefficients.map(Number), 8, 17)).toEqual(
      fixture.alternativeCodeword.map(Number),
    );
    expect(distance(encoded, fixture.alternativeCodeword.map(Number))).toBe(6);
    expect(parameters(3, 8)).toEqual({ k: 3, n: 8, d: 6, t: 2, rate: 3 / 8 });
  });
  it('reduces during evaluation and handles zero polynomials and trailing zero slots', () => {
    expect(evaluate([3, 2, 1], 3, 17)).toBe(1);
    expect(encode([0, 0, 0], 8, 17)).toEqual(Array(8).fill(0));
    expect(degree([0, 0, 0])).toBeNull();
    expect(degree([3, 2, 0])).toBe(1);
    expect(encode([3, 2, 0], 8, 17)).toEqual(encode([3, 2], 8, 17));
    expect(polynomialTex([0, 0])).toBe('0');
    expect(polynomialTex([3, 0, 1], true)).toBe('3 + 0X + X^{2}');
    expect(evaluate(Array(17).fill(16), 16, 17)).toBe(16);
  });
  it('rejects unsupported fields, repeated-domain-length overflow, and invalid symbols', () => {
    expect(() => encode([1], 8, 7)).toThrow(RangeError);
    expect(() => encode([1, 2, 3], 2, 7)).toThrow(RangeError);
    expect(() => encode([1], 2, 6)).toThrow(RangeError);
    expect(() => encode([7], 2, 7)).toThrow(RangeError);
    expect(() => encode([1.5], 2, 7)).toThrow(RangeError);
  });
  it('has the claimed minimum distance in a completely enumerated small code', () => {
    const book = codebook(5, 2, 5)!;
    expect(new Set(book.map((entry) => entry.word.join(','))).size).toBe(25);
    let minimum = Infinity;
    for (let i = 0; i < book.length; i++)
      for (let j = i + 1; j < book.length; j++)
        minimum = Math.min(minimum, distance(book[i].word, book[j].word));
    expect(minimum).toBe(parameters(2, 5).d);
  });
});

describe('distance and complete Hamming balls', () => {
  it('counts disagreements, not their magnitudes', () => {
    expect(distance([0, 2, 3], [16, 2, 3])).toBe(1);
    expect(distance([0, 2, 3], [1, 2, 3])).toBe(1);
    expect(distance([16, 2, 3], [0, 2, 3])).toBe(1);
    expect(() => distance([1], [1, 2])).toThrow();
  });
  it('gives the correct ball sizes around every binary center', () => {
    const expected = [1, 6, 16, 26, 31, 32];
    for (let center = 0; center < 32; center++)
      for (let radius = 0; radius <= 5; radius++) {
        expect(
          BINARY_WORDS.filter(({ word }) => distance(binaryWord(center), word) <= radius),
        ).toHaveLength(expected[radius]);
        expect(ballSize(5, 2, radius)).toBe(expected[radius]);
      }
    expect(ballSize(5, 7, 1)).toBe(31);
  });
});

describe('corruption and list decoding', () => {
  const sent = fixture.codeword.map(Number);
  const book = codebook(17, 3, 8)!;
  it('reveals exactly two candidates in the three-error fixture', () => {
    const received = corrupt(sent, 3, 17, 1, true);
    expect(received).toEqual(fixture.received.map(Number));
    const list = candidates(book, received, fixture.radius);
    expect(list).toHaveLength(fixture.expectedListSize);
    expect(new Set(list.map((c) => c.id))).toEqual(new Set(['3,2,1', '3,1,2']));
    expect(candidates(book, corrupt(sent, 2, 17, 1, true), 2)).toHaveLength(1);
    expect(candidates(book, received, 2)).toHaveLength(0);
    expect(candidates(book, received, 4).length).toBeGreaterThanOrEqual(2);
  });
  it('can move to a different codeword and make that word the unique radius-zero candidate', () => {
    const received = corrupt(sent, 6, 17, 1, true);
    expect(received).toEqual(fixture.alternativeCodeword.map(Number));
    expect(candidates(book, received, 0).map((c) => c.id)).toEqual(['3,1,2']);
  });
  it('introduces exactly e errors with stable prefixes and reversible sliders', () => {
    for (const guided of [true, false])
      for (const seed of [1, 53, 0xffffffff]) {
        let previous = sent;
        for (let errors = 0; errors <= sent.length; errors++) {
          const next = corrupt(sent, errors, 17, seed, guided);
          expect(distance(sent, next)).toBe(errors);
          expect(next.every((value) => value >= 0 && value < 17)).toBe(true);
          if (errors) expect(distance(previous, next)).toBe(1);
          previous = next;
        }
        expect(corrupt(sent, 2, 17, seed, guided)).toEqual(corrupt(sent, 2, 17, seed, guided));
      }
  });
  it('bounds enumeration without silently substituting samples', () => {
    expect(enumerationSupported(17, 3, 8)).toBe(true);
    expect(enumerationSupported(17, 4, 8)).toBe(false);
    expect(codebook(17, 4, 8)).toBeNull();
  });
});
