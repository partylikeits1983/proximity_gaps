import { useState } from 'react';
import { ArrowDown, ChevronRight } from 'lucide-react';
import { fraction, polynomialTex } from '../core/math';
import { useExperiment } from '../state/ExperimentContext';
import { MathText } from '../components/Math';
import { Tape } from '../components/Tape';
import { Definition, Eyebrow, Insight, Slider } from '../components/Controls';

export default function EvaluationCodeword() {
  const { experiment: e, sent, setExample } = useExperiment();
  const [selected, setSelected] = useState(3);
  const [active, setActive] = useState<number | null>(null);
  const x = Math.min(selected, e.n - 1);
  const k = e.coefficients.length;
  // Horner's method keeps intermediate values exact even for the largest supported tape.
  let acc = 0;
  const steps = [...e.coefficients].reverse().map((a) => {
    const input = acc;
    const raw = acc * x + a;
    acc = raw % e.q;
    return { input, coefficient: a, raw, result: acc };
  });
  return (
    <>
      <section className="experiment-panel">
        <div className="panel-topline">
          <Eyebrow>ONE POLYNOMIAL, MANY EVALUATIONS</Eyebrow>
          <MathText>{`p(X)=${polynomialTex(e.coefficients)}`}</MathText>
        </div>
        <div className="evaluation-layout">
          <div className="evaluation-table-wrap">
            <table className="math-table evaluation-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Point</th>
                  <th>Evaluate</th>
                  <th>Symbol</th>
                </tr>
              </thead>
              <tbody>
                {sent.map((value, i) => (
                  <tr
                    key={i}
                    className={i === x || i === active ? 'row-active' : ''}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <td className="index-label">{String(i + 1).padStart(2, '0')}</td>
                    <td>
                      <MathText>{`x_{${i + 1}}=${i}`}</MathText>
                    </td>
                    <td>
                      <button
                        className="evaluation-button"
                        aria-label={`Inspect evaluation at ${i}`}
                        aria-pressed={x === i}
                        onClick={() => setSelected(i)}
                        onFocus={() => setActive(i)}
                      >
                        <MathText>{`p(${i})`}</MathText>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                    <td>
                      <span className="output-symbol">{value}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="evaluation-controls">
            <Eyebrow>MORE POINTS, MORE REDUNDANCY</Eyebrow>
            <h2>
              The message stays.
              <br />
              The codeword grows.
            </h2>
            <label className="select-label" htmlFor="rate-select">
              Code rate <MathText>{'\\rho=k/n'}</MathText>
            </label>
            <select
              id="rate-select"
              aria-label="Code rate"
              className="select-input"
              value={e.n}
              onChange={(event) => setExample(e.coefficients, Number(event.target.value))}
            >
              {Array.from({ length: e.q - k + 1 }, (_, i) => k + i).map((n) => (
                <option key={n} value={n}>
                  {fraction(k, n)} · {n} evaluations
                </option>
              ))}
            </select>
            <Slider
              label="Evaluation points"
              min={k}
              max={e.q}
              value={e.n}
              onChange={(n) => setExample(e.coefficients, n)}
            />
            <div className="evaluation-inspector">
              <span className="micro-label">
                AT X = {x} · MODULO {e.q}
              </span>
              <MathText block>{`p(${x})=${sent[x]}`}</MathText>
              <details>
                <summary>See the arithmetic</summary>
                <p className="small">
                  Evaluate from the highest coefficient, reducing after every step:
                </p>
                {steps.map((step, i) => (
                  <div className="arithmetic-step" key={i}>
                    <MathText>{`(${step.input}\\cdot${x}+${step.coefficient})=${step.raw}\\equiv${step.result}\\pmod{${e.q}}`}</MathText>
                  </div>
                ))}
              </details>
            </div>
          </div>
        </div>
        <div className="codeword-output">
          <div className="object-label">
            <ArrowDown size={17} />
            <span>The Reed–Solomon codeword</span>
            <span className="muted">{e.n} symbols</span>
          </div>
          <Tape values={sent} label="Codeword" active={active ?? x} onActive={setActive} compact />
        </div>
      </section>
      <Insight>
        {e.n === k ? (
          <>
            <strong>No redundancy yet.</strong> There are as many evaluations as message
            coefficients.
          </>
        ) : (
          <>
            <strong>
              {k} message symbols → {e.n} codeword symbols.
            </strong>{' '}
            The rate is {fraction(k, e.n)} ({((k / e.n) * 100).toFixed(1)}%), with {e.n - k}{' '}
            redundant symbols.
          </>
        )}
      </Insight>
      <Definition>
        <MathText block>
          {'\\operatorname{Enc}(a_0,\\ldots,a_{k-1})=(p(x_1),\\ldots,p(x_n))'}
        </MathText>
        <p>
          The evaluation points must be distinct field elements. This experiment uses{' '}
          <MathText>{`0,1,\\ldots,${e.n - 1}`}</MathText>. Every output is a polynomial evaluation;
          the first <MathText>k</MathText> output symbols are not necessarily the original
          coefficients.
        </p>
      </Definition>
    </>
  );
}
