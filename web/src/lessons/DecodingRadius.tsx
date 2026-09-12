import { useMemo, useState } from 'react';
import { Check, Shuffle, Sparkles } from 'lucide-react';
import {
  codebook,
  distance,
  isDefaultExample,
  parameters,
  polynomialTex,
  wordText,
} from '../core/math';
import { useExperiment } from '../state/ExperimentContext';
import { MathText } from '../components/Math';
import { Tape } from '../components/Tape';
import { Definition, Eyebrow, Insight, Slider, Stat, Toggle } from '../components/Controls';
import { BallScene } from '../visuals/BallScene';

export default function DecodingRadius() {
  const { experiment: e, sent, errors, setErrors, patch, loadDefault } = useExperiment();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const k = e.coefficients.length;
  const { d, t } = parameters(k, e.n);
  const radius = e.linked ? errors : e.radius;
  const book = useMemo(() => codebook(e.q, k, e.n), [e.q, k, e.n]);
  const distances = useMemo(
    () => book?.map((entry) => ({ ...entry, distance: distance(entry.word, e.received) })) ?? null,
    [book, e.received],
  );
  const list = useMemo(
    () =>
      distances
        ?.filter((entry) => entry.distance <= radius)
        .sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id)) ?? null,
    [distances, radius],
  );
  const closest = useMemo(
    () =>
      distances
        ? [...distances]
            .sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id))
            .slice(0, 24)
        : [],
    [distances],
  );
  const sentId = e.coefficients.join(',');
  const defaultExample = isDefaultExample(e.coefficients, e.n, e.q);
  const sentEntry = distances?.find((entry) => entry.id === sentId);
  const alternateEntry = defaultExample
    ? distances?.find((entry) => entry.id === '3,1,2')
    : undefined;
  const displayEntries = [
    ...new Map(
      [
        ...(sentEntry ? [sentEntry] : []),
        ...(alternateEntry ? [alternateEntry] : []),
        ...closest,
        ...(distances
          ?.filter((_, i) => i % Math.max(1, Math.floor(distances.length / 24)) === 0)
          .slice(0, 24) ?? []),
      ].map((entry) => [entry.id, entry]),
    ).values(),
  ];
  const selected = distances?.find((entry) => entry.id === selectedId) ?? list?.[0] ?? sentEntry;
  const mismatchIndices = sent.flatMap((value, i) => (value !== e.received[i] ? [i] : []));
  const inGuaranteedRange = errors <= t;
  return (
    <>
      <section className="experiment-panel decoding-experiment">
        <div className="panel-topline">
          <Eyebrow>FROM A SINGLE ANSWER TO A LIST</Eyebrow>
          <div className="button-row">
            <button className="text-button" onClick={() => loadDefault(true)}>
              <Sparkles size={14} /> Three-error example
            </button>
          </div>
        </div>
        <div className="decoding-layout">
          <div className="decoding-visual">
            <BallScene
              label="Reed–Solomon codewords at their exact distances from the received word"
              maxDistance={e.n}
              radius={radius}
              guarantee={t}
              showLabels={false}
              points={displayEntries.map((entry) => ({
                id: entry.id,
                label: entry.id === sentId ? 'sent c' : `p(X)=${polynomialTex(entry.coefficients)}`,
                distance: entry.distance,
                codeword: true,
                emphasis: entry.id === sentId,
                selected: entry.id === selected?.id,
                description: `${wordText(entry.word)}, distance ${entry.distance}${entry.id === sentId ? ', sent codeword' : ''}${entry.distance <= radius ? ', inside ball' : ', outside ball'}`,
                onSelect: () => setSelectedId(entry.id),
              }))}
            />
            <div className="legend">
              <span>
                <i className="legend-diamond" /> Valid codeword
              </span>
              <span>
                <i className="legend-dashed" /> Guaranteed radius t
              </span>
            </div>
            <p className="diagram-caption">
              {book
                ? `${displayEntries.length} of ${book.length.toLocaleString()} codewords drawn; the candidate count searches all of them.`
                : 'Load a smaller example to show actual candidate codewords.'}
              <br />
              Distances are exact from the current center w; other point-to-point distances are not
              represented.
            </p>
          </div>
          <div className="decoding-controls">
            <div className={`guarantee-status ${inGuaranteedRange ? '' : 'past-guarantee'}`}>
              <span className="status-dot" />
              {inGuaranteedRange
                ? 'Within the guaranteed error budget'
                : 'Beyond the guaranteed error budget'}
            </div>
            <Slider
              label="Introduced errors"
              value={errors}
              max={e.n}
              onChange={(value) => setErrors(value)}
              markers={[{ value: t, label: `t = ${t}` }]}
            />
            <div className="button-row">
              <button
                className="text-button"
                onClick={() => setErrors(errors, (e.seed % 0xfffffffe) + 1)}
              >
                <Shuffle size={14} /> New error pattern
              </button>
              <span className="micro-label">
                {e.pattern === 'ambiguity' && defaultExample
                  ? 'Guided ambiguity'
                  : `Seed ${e.seed}`}
              </span>
            </div>
            <div className="stats-row">
              <Stat
                label="Minimum distance"
                value={<MathText>{`d=${d}`}</MathText>}
                detail={`${e.n} − ${k} + 1`}
              />
              <Stat
                label="Guaranteed radius"
                value={<MathText>{`t=${t}`}</MathText>}
                detail="errors we can always correct"
              />
            </div>
            <div className="candidate-count">
              <span className="micro-label">CODEWORDS WITHIN RADIUS {radius}</span>
              <div className="candidate-count-value" data-testid="candidate-count">
                {list === null ? '—' : list.length.toLocaleString()}
              </div>
              <MathText>{`|\\Lambda(C,w,${radius})|`}</MathText>
            </div>
            <details className="advanced-controls">
              <summary>Separate search radius from corruption</summary>
              <Toggle
                label="Search radius follows errors"
                checked={e.linked}
                onChange={(linked) => patch({ linked, radius: errors })}
              />
              {!e.linked && (
                <Slider
                  label="Search radius"
                  value={e.radius}
                  max={e.n}
                  onChange={(value) => patch({ radius: value })}
                />
              )}
              <p className="small muted">
                The error count changes the received word. The search radius changes which
                candidates the decoder accepts.
              </p>
            </details>
          </div>
        </div>
        <div className="decoding-tapes word-pair">
          <div className="word-row">
            <div className="word-row-label">
              <MathText>c</MathText>
              <span>sent</span>
            </div>
            <Tape values={sent} label="Sent codeword" mismatches={mismatchIndices} compact />
          </div>
          <div className="word-row">
            <div className="word-row-label">
              <MathText>w</MathText>
              <span>received</span>
            </div>
            <Tape values={e.received} label="Corrupted word" mismatches={mismatchIndices} compact />
          </div>
        </div>
      </section>
      <Insight tone={inGuaranteedRange ? 'green' : 'amber'}>
        {inGuaranteedRange ? (
          <>
            <strong>Recovery is guaranteed with at most {t} errors.</strong>{' '}
            {errors === 0
              ? 'The received word is the sent codeword.'
              : `This word has ${errors} errors.`}{' '}
            {radius < errors && 'The current search radius is too small to include the sent word.'}
            {radius > t && 'Your wider search radius can still include extra candidates.'}
          </>
        ) : (
          <>
            <strong>The guarantee has ended.</strong>{' '}
            {list && list.length > 1
              ? `${list.length.toLocaleString()} codewords fit this search radius, so the budget alone does not identify the sent one.`
              : list?.length === 1
                ? 'One candidate fits this search radius, but it need not be the word that was sent.'
                : list?.length === 0
                  ? 'No codeword fits this search radius.'
                  : 'Use a small exact example to inspect the candidates.'}
          </>
        )}
      </Insight>
      {list === null ? (
        <div className="enumeration-limit">
          <h2>Keep this experiment small enough to count.</h2>
          <p>
            This setting has {e.q}
            <sup>{k}</sup> possible codewords. Exact exploration supports up to 10,000 codewords and
            250,000 coordinate evaluations. Encoding and distance still work at your current
            settings.
          </p>
          <button className="secondary-button" onClick={() => loadDefault()}>
            Load a small exact example
          </button>
        </div>
      ) : (
        <section className="candidate-section">
          <div className="section-heading">
            <Eyebrow>THE DECODER'S CANDIDATES</Eyebrow>
            <span className="micro-label">The sent label is known to this demonstration</span>
          </div>
          {list.length === 0 ? (
            <p className="empty-state">
              No codeword is within {radius} changes of this received word. Increase the search
              radius to explore further.
            </p>
          ) : (
            <div className="table-scroll">
              <table className="math-table candidate-table">
                <thead>
                  <tr>
                    <th>Message polynomial</th>
                    <th>Distance to w</th>
                    <th>In this demonstration</th>
                  </tr>
                </thead>
                <tbody>
                  {list.slice(0, visibleCount).map((entry) => (
                    <tr className={entry.id === selected?.id ? 'row-active' : ''} key={entry.id}>
                      <td>
                        <button
                          className="text-button candidate-polynomial"
                          aria-label={`Inspect codeword with coefficients ${entry.coefficients.join(', ')}, distance ${entry.distance}`}
                          onClick={() => setSelectedId(entry.id)}
                          aria-pressed={entry.id === selected?.id}
                        >
                          <MathText>{`p(X)=${polynomialTex(entry.coefficients)}`}</MathText>
                        </button>
                      </td>
                      <td>{entry.distance}</td>
                      <td>
                        {entry.id === sentId ? (
                          <span className="sent-tag">
                            <Check size={12} /> Sent word
                          </span>
                        ) : (
                          'Another valid word'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {list.length > visibleCount && (
            <button
              className="secondary-button"
              onClick={() => setVisibleCount((count) => count + 16)}
            >
              Show more · {visibleCount} of {list.length.toLocaleString()}
            </button>
          )}
          {selected && (
            <div className="candidate-inspector">
              <div className="object-label">
                <span>Selected codeword</span>
                <MathText>{`p(X)=${polynomialTex(selected.coefficients)}`}</MathText>
              </div>
              <Tape
                values={selected.word}
                label="Selected candidate"
                mismatches={selected.word.flatMap((a, i) => (a !== e.received[i] ? [i] : []))}
                compact
              />
              <p className="small muted">
                Distance {selected.distance} from the received word ·{' '}
                {selected.distance <= radius ? 'inside' : 'outside'} the search ball.
              </p>
            </div>
          )}
        </section>
      )}
      <Definition>
        <MathText block>{'d=n-k+1,\\qquad t=\\left\\lfloor\\frac{d-1}{2}\\right\\rfloor'}</MathText>
        <p>
          Two different codewords cannot both be within distance <MathText>t</MathText> of the same
          received word: their mutual distance would be at most <MathText>2t&lt;d</MathText>.
        </p>
        <MathText block>{'\\Lambda(C,w,E)=B(w,E)\\cap C'}</MathText>
        <p>
          Beyond the guaranteed radius, a particular received word may still have one candidate.
          List decoding returns every codeword within the chosen budget; it does not know which one
          was originally sent. Holding the center fixed and increasing the radius can only add
          candidates.
        </p>
      </Definition>
    </>
  );
}
