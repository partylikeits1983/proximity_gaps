/** Small prime fields only. Every arithmetic operation is exact in this range. */
export const SUPPORTED_FIELDS = [5, 7, 17] as const;
export const MAX_CODEWORDS = 10_000;
export const MAX_COORDINATE_EVALUATIONS = 250_000;

export function mod(value: number, q: number): number {
  return ((value % q) + q) % q;
}

/** Parse a decimal integer exactly, including values beyond Number's safe range. */
export function parseFieldInteger(input: string, q: number): number | null {
  if (!/^[+-]?\d+$/.test(input)) return null;
  const value = BigInt(input);
  const modulus = BigInt(q);
  return Number(((value % modulus) + modulus) % modulus);
}

export function evaluate(coefficients: readonly number[], x: number, q: number): number {
  return coefficients.reduceRight((acc, coefficient) => mod(acc * x + coefficient, q), 0);
}

export function encode(coefficients: readonly number[], n: number, q: number): number[] {
  if (
    !SUPPORTED_FIELDS.includes(q as 5 | 7 | 17) ||
    !Number.isInteger(n) ||
    coefficients.length < 1 ||
    coefficients.length > n ||
    n > q ||
    coefficients.some((a) => !Number.isInteger(a) || a < 0 || a >= q)
  ) {
    throw new RangeError('Use valid field elements and 1 ≤ k ≤ n ≤ q.');
  }
  return Array.from({ length: n }, (_, x) => evaluate(coefficients, x, q));
}

export function distance(a: readonly number[], b: readonly number[]): number {
  if (a.length !== b.length) throw new RangeError('Words must have the same length.');
  return a.reduce((count, value, index) => count + Number(value !== b[index]), 0);
}

export function parameters(k: number, n: number) {
  return { k, n, rate: k / n, d: n - k + 1, t: Math.floor((n - k) / 2) };
}

export function degree(coefficients: readonly number[]): number | null {
  for (let i = coefficients.length - 1; i >= 0; i--) if (coefficients[i] !== 0) return i;
  return null;
}

export function termTex(value: number, index: number, showZero = false): string {
  if (value === 0 && !showZero) return '';
  if (index === 0) return String(value);
  const coefficient = value === 1 ? '' : String(value);
  return `${coefficient}X${index === 1 ? '' : `^{${index}}`}`;
}

export function polynomialTex(coefficients: readonly number[], showZero = false): string {
  return (
    coefficients
      .map((a, i) => termTex(a, i, showZero))
      .filter(Boolean)
      .join(' + ') || '0'
  );
}

export function fraction(numerator: number, denominator: number): string {
  let a = numerator;
  let b = denominator;
  while (b) [a, b] = [b, a % b];
  return `${numerator / a}/${denominator / a}`;
}

export function wordText(word: readonly number[]): string {
  return `[${word.join(', ')}]`;
}

export type Codeword = { coefficients: number[]; word: number[]; id: string };
const codebooks = new Map<string, Codeword[]>();

export function enumerationSupported(q: number, k: number, n: number): boolean {
  return q ** k <= MAX_CODEWORDS && q ** k * n <= MAX_COORDINATE_EVALUATIONS;
}

export function codebook(q: number, k: number, n: number): Codeword[] | null {
  if (!enumerationSupported(q, k, n)) return null;
  const key = `${q}:${k}:${n}`;
  const cached = codebooks.get(key);
  if (cached) return cached;
  const result = Array.from({ length: q ** k }, (_, id) => {
    let rest = id;
    const coefficients = Array.from({ length: k }, () => {
      const value = rest % q;
      rest = Math.floor(rest / q);
      return value;
    });
    return { coefficients, word: encode(coefficients, n, q), id: coefficients.join(',') };
  });
  if (codebooks.size >= 3) codebooks.delete(codebooks.keys().next().value!);
  codebooks.set(key, result);
  return result;
}

export function candidates(book: readonly Codeword[], received: readonly number[], radius: number) {
  return book
    .map((entry) => ({ ...entry, distance: distance(entry.word, received) }))
    .filter((entry) => entry.distance <= radius)
    .sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id));
}

export function isDefaultExample(coefficients: readonly number[], n: number, q: number) {
  return q === 17 && n === 8 && coefficients.join(',') === '3,2,1';
}

export function corrupt(
  word: readonly number[],
  errors: number,
  q: number,
  seed = 1,
  ambiguity = false,
): number[] {
  if (!Number.isInteger(errors) || errors < 0 || errors > word.length)
    throw new RangeError('Invalid error count.');
  const result = [...word];
  if (ambiguity && q === 17 && word.join(',') === '3,6,11,1,10,4,0,15') {
    const alternate = encode([3, 1, 2], 8, 17);
    const order = [2, 3, 4, 5, 6, 7, 0, 1];
    order.slice(0, errors).forEach((i) => {
      result[i] = alternate[i] === word[i] ? mod(word[i] + 1, q) : alternate[i];
    });
    return result;
  }
  let state = seed >>> 0 || 1;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 2 ** 32;
  };
  const order = word.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  // Generate the complete path before selecting its prefix, so slider reversal is exact.
  const replacements = order.map((i) => mod(word[i] + 1 + Math.floor(random() * (q - 1)), q));
  order.slice(0, errors).forEach((index, position) => {
    result[index] = replacements[position];
  });
  return result;
}

export function binaryWord(value: number): number[] {
  return value.toString(2).padStart(5, '0').split('').map(Number);
}

export const BINARY_WORDS = Array.from({ length: 32 }, (_, id) => ({ id, word: binaryWord(id) }));

export function binomial(n: number, k: number): number {
  let result = 1;
  for (let j = 1; j <= k; j++) result = (result * (n - j + 1)) / j;
  return result;
}

export function ballSize(n: number, q: number, radius: number): number {
  return Array.from({ length: radius + 1 }, (_, j) => binomial(n, j) * (q - 1) ** j).reduce(
    (a, b) => a + b,
    0,
  );
}
