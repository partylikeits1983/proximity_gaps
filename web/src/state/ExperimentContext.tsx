import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { corrupt, distance, encode, isDefaultExample } from '../core/math';
import {
  defaultExperiment,
  experimentUrl,
  readLocation,
  type Experiment,
  type LessonId,
} from './model';

type Store = ReturnType<typeof readLocation>;
type ContextValue = Store & {
  patch: (change: Partial<Experiment>) => void;
  setExample: (coefficients: number[], n: number) => void;
  setErrors: (errors: number, newSeed?: number) => void;
  loadDefault: (ambiguity?: boolean) => void;
  setField: (q: number) => void;
  navigate: (id: LessonId) => void;
  reset: () => void;
  notify: (message: string) => void;
};

const Context = createContext<ContextValue | null>(null);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(() =>
    readLocation(window.location.pathname, window.location.search),
  );
  useEffect(() => {
    const onPop = () => setStore(readLocation(window.location.pathname, window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    window.history.replaceState(null, '', experimentUrl(store.lesson, store.experiment));
  }, [store.lesson, store.experiment]);

  const patch = (change: Partial<Experiment>) =>
    setStore((s) => ({ ...s, experiment: { ...s.experiment, ...change } }));
  const notify = (notice: string) => setStore((s) => ({ ...s, notice }));
  const setExample = (coefficients: number[], n: number) =>
    setStore((s) => {
      const length = Math.max(n, coefficients.length);
      return {
        ...s,
        notice: '',
        experiment: {
          ...s.experiment,
          coefficients,
          n: length,
          received: encode(coefficients, length, s.experiment.q),
          radius: 0,
          distanceRadius: Math.min(s.experiment.distanceRadius, length),
        },
      };
    });
  const setErrors = (errors: number, newSeed?: number) =>
    setStore((s) => {
      const e = s.experiment;
      const seed = newSeed ?? e.seed;
      const pattern = newSeed === undefined ? e.pattern : 'seeded';
      const sent = encode(e.coefficients, e.n, e.q);
      const received = corrupt(
        sent,
        errors,
        e.q,
        seed,
        pattern === 'ambiguity' && isDefaultExample(e.coefficients, e.n, e.q),
      );
      return {
        ...s,
        experiment: { ...e, received, seed, pattern, radius: e.linked ? errors : e.radius },
      };
    });
  const loadDefault = (ambiguity = false) =>
    setStore((s) => {
      const experiment = defaultExperiment();
      if (ambiguity) {
        experiment.received = corrupt(experiment.received, 3, 17, 1, true);
        experiment.radius = 3;
      }
      return {
        ...s,
        experiment,
        notice: ambiguity
          ? 'Loaded the exact three-error ambiguity example.'
          : 'Loaded the default Reed–Solomon example.',
      };
    });
  const setField = (q: number) =>
    setStore((s) => ({
      ...s,
      experiment: defaultExperiment(q),
      notice: `Loaded a fresh example over the field with ${q} elements.`,
    }));
  const navigate = (lesson: LessonId) => {
    window.history.pushState(null, '', experimentUrl(lesson, store.experiment));
    setStore((s) => ({ ...s, lesson, notice: '' }));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const reset = () =>
    setStore((s) => ({
      ...s,
      experiment: defaultExperiment(),
      notice: 'All experiments reset to their starting values.',
    }));
  return (
    <Context.Provider
      value={{
        ...store,
        patch,
        setExample,
        setErrors,
        loadDefault,
        setField,
        navigate,
        reset,
        notify,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useExperiment() {
  const context = useContext(Context);
  if (!context) throw new Error('ExperimentProvider is missing.');
  const e = context.experiment;
  const sent = encode(e.coefficients, e.n, e.q);
  return { ...context, sent, errors: distance(sent, e.received) };
}
