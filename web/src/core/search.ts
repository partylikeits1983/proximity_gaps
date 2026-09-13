import { distance, encode, parameters, type Codeword } from './math';
import { interpolate } from './stark';

export type NearbyWord = Codeword & { distance: number };

/** Exact small cases that do not require enumerating the whole codebook. Null means unknown. */
export function listWithoutEnumeration(
  coefficients: readonly number[],
  received: readonly number[],
  q: number,
  radius: number,
): NearbyWord[] | null {
  const word = encode(coefficients, received.length, q);
  const errors = distance(word, received);
  const { d } = parameters(coefficients.length, received.length);
  // Any second candidate would have distance at most errors + radius from this codeword.
  if (errors <= radius && errors + radius < d) {
    return [
      { coefficients: [...coefficients], word, distance: errors, id: coefficients.join(',') },
    ];
  }
  if (radius === 0) {
    const xs = Array.from({ length: coefficients.length }, (_, i) => i);
    const recovered = interpolate(xs, received.slice(0, xs.length), q);
    const encoded = encode(recovered, received.length, q);
    return distance(encoded, received) === 0
      ? [{ coefficients: recovered, word: encoded, distance: 0, id: recovered.join(',') }]
      : [];
  }
  return null;
}
