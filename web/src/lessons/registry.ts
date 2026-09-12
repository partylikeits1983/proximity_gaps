import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { LessonId } from '../state/model';

export type LessonDefinition = {
  id: LessonId;
  number: string;
  title: string;
  shortTitle: string;
  group: string;
  description: string;
  question: string;
  noteSection: string;
  noteSource?: 'stark';
  component: LazyExoticComponent<ComponentType>;
};

export const lessons: LessonDefinition[] = [
  {
    id: 'tape-polynomial',
    number: '01',
    title: 'A message, a polynomial.',
    shortTitle: 'Tape to polynomial',
    group: 'Encoding',
    description: 'Every number has a place. Together, they describe a polynomial.',
    question: 'How does a message become mathematics?',
    noteSection: '1. Reed-Solomon Codes: The Basic Idea',
    component: lazy(() => import('./TapePolynomial')),
  },
  {
    id: 'evaluation-codeword',
    number: '02',
    title: 'A little more redundancy.',
    shortTitle: 'Build a codeword',
    group: 'Encoding',
    description: 'Evaluate one polynomial at many points. The results form a codeword.',
    question: 'What do the extra symbols buy us?',
    noteSection: '1. Reed-Solomon Codes: The Basic Idea',
    component: lazy(() => import('./EvaluationCodeword')),
  },
  {
    id: 'hamming-distance',
    number: '03',
    title: 'Count what changed.',
    shortTitle: 'Measure errors',
    group: 'Distance & decoding',
    description: 'Compare the sent and received words, one coordinate at a time.',
    question: 'How far apart are two words?',
    noteSection: '2. Distance, Hamming Balls, and List Size',
    component: lazy(() => import('./HammingDistance')),
  },
  {
    id: 'hamming-ball',
    number: '04',
    title: 'A neighborhood of words.',
    shortTitle: 'Grow a Hamming ball',
    group: 'Distance & decoding',
    description: 'A word is a point. A radius tells us which other words are nearby.',
    question: 'What lives inside a Hamming ball?',
    noteSection: '2. Distance, Hamming Balls, and List Size',
    component: lazy(() => import('./HammingBall')),
  },
  {
    id: 'decoding-radius',
    number: '05',
    title: 'When certainty runs out.',
    shortTitle: 'Decode through noise',
    group: 'Distance & decoding',
    description: 'Introduce errors and watch one possible message become a list.',
    question: 'When can we still recover the message?',
    noteSection: '3. Unique Decoding vs List Decoding',
    component: lazy(() => import('./DecodingRadius')),
  },
  {
    id: 'codes-to-proofs',
    number: '06',
    title: 'From codes to proofs',
    shortTitle: 'From codes to proofs',
    group: 'STARKs',
    description:
      'Follow trace values through interpolation, low-degree extension, and a local FRI check.',
    question: 'How do Reed–Solomon codes support a STARK?',
    noteSection: 'From codes to proofs',
    noteSource: 'stark',
    component: lazy(() => import('./CodesToProofs')),
  },
];
