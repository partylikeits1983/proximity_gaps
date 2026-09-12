import { RotateCcw, WandSparkles } from 'lucide-react';
import { useExperiment } from '../state/ExperimentContext';
import { MathText } from '../components/Math';
import { Tape } from '../components/Tape';
import { Definition, Eyebrow, Insight, Slider, Stat } from '../components/Controls';
import { BallScene } from '../visuals/BallScene';

export default function HammingDistance() {
  const { experiment: e, sent, errors, patch, setErrors } = useExperiment();
  const mismatches = sent.flatMap((value, i) => (value !== e.received[i] ? [i] : []));
  return (
    <>
      <section className="experiment-panel comparison-panel">
        <div className="panel-topline">
          <Eyebrow>THE SAME POSITIONS. DIFFERENT SYMBOLS.</Eyebrow>
          <span className="micro-label">Click a received symbol to edit it</span>
        </div>
        <div className="word-pair">
          <div className="word-row">
            <div className="word-row-label">
              <MathText>c</MathText>
              <span>sent</span>
            </div>
            <Tape values={sent} label="Sent word" mismatches={mismatches} compact />
          </div>
          <div className="word-row">
            <div className="word-row-label">
              <MathText>w</MathText>
              <span>received</span>
            </div>
            <Tape
              values={e.received}
              q={e.q}
              label="Received word"
              editable
              compact
              mismatches={mismatches}
              onChange={(index, value) =>
                patch({ received: e.received.map((a, i) => (i === index ? value : a)) })
              }
            />
          </div>
        </div>
        <div className="panel-bottomline">
          <span>Different values count once, however large the change.</span>
          <div className="button-row">
            <button className="text-button" onClick={() => setErrors(Math.min(2, e.n))}>
              <WandSparkles size={14} /> Add two errors
            </button>
            <button className="text-button" onClick={() => patch({ received: sent })}>
              <RotateCcw size={14} /> Restore
            </button>
          </div>
        </div>
      </section>
      <div className="lesson-two-columns distance-layout">
        <section>
          <div className="stats-row">
            <Stat
              label="Absolute distance"
              value={<MathText>{`\\Delta=${errors}`}</MathText>}
              detail="different coordinates"
            />
            <Stat
              label="Relative distance"
              value={<MathText>{`\\delta=\\frac{${errors}}{${e.n}}`}</MathText>}
              detail={`${((errors / e.n) * 100).toFixed(1)}% of the word`}
            />
          </div>
          <div className="mismatch-strip" aria-label={`${errors} of ${e.n} positions differ`}>
            {sent.map((_, i) => (
              <span key={i} className={mismatches.includes(i) ? 'mismatch-segment' : ''}>
                {mismatches.includes(i) ? '×' : '·'}
              </span>
            ))}
          </div>
          <Slider
            label="Comparison radius"
            value={e.distanceRadius}
            max={e.n}
            onChange={(distanceRadius) => patch({ distanceRadius })}
          />
          <Insight tone={errors <= e.distanceRadius ? 'green' : 'amber'}>
            <MathText>{`w ${errors <= e.distanceRadius ? '\\in' : '\\notin'} B(c,${e.distanceRadius})`}</MathText>
            <br />
            {errors} differences {errors <= e.distanceRadius ? 'fit inside' : 'exceed'} a radius of{' '}
            {e.distanceRadius}.
          </Insight>
        </section>
        <div>
          <BallScene
            label="Distance of the received word from the sent codeword"
            maxDistance={e.n}
            radius={e.distanceRadius}
            centerLabel="c"
            points={[{ id: 'received', label: 'w', distance: errors, emphasis: true }]}
          />
          <p className="diagram-caption">
            The center is the sent codeword. Rings show distance from it.
          </p>
        </div>
      </div>
      <Definition>
        <MathText block>
          {'\\Delta(c,w)=|\\{i:c_i\\ne w_i\\}|,\\qquad \\delta(c,w)=\\frac{\\Delta(c,w)}n'}
        </MathText>
        <p>
          Hamming distance measures disagreement of symbols. Replacing one wrong symbol with a
          different wrong symbol does not change the distance. Restoring it to the sent value
          decreases the distance by one.
        </p>
      </Definition>
    </>
  );
}
