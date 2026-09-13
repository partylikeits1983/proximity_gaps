import { Crosshair } from 'lucide-react';
import { BINARY_WORDS, binaryWord, distance, ballSize } from '../core/math';
import { useExperiment } from '../state/ExperimentContext';
import { MathText } from '../components/Math';
import { Tape } from '../components/Tape';
import { Definition, Eyebrow, Slider, Stat, Toggle } from '../components/Controls';
import { BallScene } from '../visuals/BallScene';

export default function HammingBall() {
  const { experiment: e, patch } = useExperiment();
  const center = binaryWord(e.ballCenter);
  const selected = binaryWord(e.selectedBinary);
  const selectedDistance = distance(center, selected);
  const points = BINARY_WORDS.map(({ id, word }) => ({
    id: String(id),
    label: word.join(''),
    distance: distance(word, center),
    codeword: e.repetition && (id === 0 || id === 31),
    selected: e.selectedBinary === id,
    onSelect: () => patch({ selectedBinary: id }),
  }));
  const listSize = points.filter((p) => p.codeword && p.distance <= e.ballRadius).length;
  return (
    <>
      <section className="experiment-panel ball-experiment">
        <div className="panel-topline">
          <Eyebrow>ALL 32 WORDS · FIVE BINARY SYMBOLS</Eyebrow>
          <span className="small muted">Select a point to compare its symbols</span>
        </div>
        <div className="ball-lesson-layout">
          <div className="ball-visual-column">
            <BallScene
              label="All binary words of length five, grouped by distance"
              maxDistance={5}
              radius={e.ballRadius}
              points={points}
              centerLabel="w"
            />
            <div className="legend">
              <span>
                <i className="legend-dot inside" /> Inside the ball
              </span>
              <span>
                <i className="legend-dot" /> Outside
              </span>
              {e.repetition && (
                <span>
                  <i className="legend-diamond" /> Codeword
                </span>
              )}
            </div>
            <p className="diagram-caption">
              Rings show distance from the center. Distances between other points are not
              represented.
            </p>
          </div>
          <div className="ball-controls">
            <div className="ball-formula">
              <MathText>{`B(w,${e.ballRadius})`}</MathText>
            </div>
            <Slider
              label="Hamming radius"
              value={e.ballRadius}
              max={5}
              onChange={(ballRadius) => patch({ ballRadius })}
            />
            <div className="stats-row">
              <Stat
                label="Words inside"
                value={ballSize(5, 2, e.ballRadius)}
                detail="of 32 possible words"
              />
              <Stat
                label="Relative radius"
                value={<MathText>{`\\frac{${e.ballRadius}}{5}`}</MathText>}
                detail={`${e.ballRadius * 20}% of coordinates`}
              />
            </div>
            <div className="word-inspector">
              <span className="micro-label">INSPECT A POINT</span>
              <div className="inspector-word">
                <span>
                  Center <i>w</i>
                </span>
                <code>{center.join('')}</code>
              </div>
              <div className="inspector-word">
                <span>Selected word</span>
                <code>{selected.join('')}</code>
              </div>
              <Tape
                values={selected}
                label="Selected binary word"
                compact
                mismatches={selected.flatMap((v, i) => (v !== center[i] ? [i] : []))}
              />
              <p className="small">
                Distance <strong>{selectedDistance}</strong> ·{' '}
                {selectedDistance <= e.ballRadius ? 'inside' : 'outside'} the ball
              </p>
              <button
                className="secondary-button"
                disabled={e.selectedBinary === e.ballCenter}
                onClick={() => patch({ ballCenter: e.selectedBinary })}
              >
                <Crosshair size={14} /> Use as center
              </button>
            </div>
            <Toggle
              label="Highlight a simple code"
              checked={e.repetition}
              onChange={(repetition) => patch({ repetition })}
            />
            {e.repetition && (
              <div className="repetition-explanation">
                <p className="small">
                  Repetition code: <code>{'{00000, 11111}'}</code>. This toy code is separate from
                  the RS example.
                </p>
                <MathText>{`|B(w,${e.ballRadius})\\cap C|=${listSize}`}</MathText>
                <button
                  className="text-button"
                  onClick={() => patch({ ballCenter: 7, ballRadius: 3 })}
                >
                  Try a center near both codewords →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Definition>
        <MathText block>{'B(w,E)=\\{y\\in\\mathbb{F}^n:\\Delta(y,w)\\le E\\}'}</MathText>
        <p>
          A shell contains words at exactly one distance. A ball includes all shells up to its
          radius.
        </p>
        <MathText block>{'|B(w,E)|=\\sum_{j=0}^{E}\\binom{n}{j}(q-1)^j'}</MathText>
        <div className="table-scroll">
          <table className="math-table">
            <thead>
              <tr>
                <th>Radius</th>
                <th>Words in the ball</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, radius) => (
                <tr key={radius}>
                  <td>{radius}</td>
                  <td>{ballSize(5, 2, radius)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details>
          <summary>All words and their exact distances</summary>
          <div className="table-scroll">
            <table className="math-table">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Distance</th>
                  <th>Membership</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.id}>
                    <td>
                      <button className="text-button" onClick={point.onSelect}>
                        {point.label}
                      </button>
                    </td>
                    <td>{point.distance}</td>
                    <td>
                      {point.distance <= e.ballRadius ? 'Inside' : 'Outside'}
                      {point.codeword ? ' · codeword' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </Definition>
    </>
  );
}
