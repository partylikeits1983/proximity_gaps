import { useState } from 'react';
import { ArrowRight, CornerDownRight } from 'lucide-react';
import { degree, polynomialTex, termTex } from '../core/math';
import { useExperiment } from '../state/ExperimentContext';
import { MathText } from '../components/Math';
import { Tape } from '../components/Tape';
import { Definition, Eyebrow, Insight, Toggle } from '../components/Controls';

export default function TapePolynomial() {
  const { experiment: e, setExample, patch } = useExperiment();
  const [active, setActive] = useState<number | null>(null);
  const k = e.coefficients.length;
  const actualDegree = degree(e.coefficients);
  const change = (index: number, value: number) =>
    setExample(
      e.coefficients.map((a, i) => (i === index ? value : a)),
      e.n,
    );
  return (
    <>
      <section className="experiment-panel encoding-panel">
        <div className="panel-topline">
          <span className="micro-label">01 / 03 · coefficients</span>
        </div>
        <div className="tape-polynomial-stage">
          <div className="message-side">
            <div className="object-label">
              <span className="object-badge">a</span>
              <span>Your message</span>
              <span className="muted">{k} symbols</span>
            </div>
            <Tape
              label="Message"
              values={e.coefficients}
              q={e.q}
              editable
              coefficientLabels
              onChange={change}
              active={active}
              onActive={setActive}
              onAdd={k < e.q ? () => setExample([...e.coefficients, 0], e.n) : undefined}
              onRemove={k > 1 ? () => setExample(e.coefficients.slice(0, -1), e.n) : undefined}
              onRemoveAt={(index) =>
                setExample(
                  e.coefficients.filter((_, i) => i !== index),
                  e.n,
                )
              }
            />
            <p className="stage-helper">Edit a cell; press Delete or Backspace to remove it.</p>
          </div>
          <div className="transformation-arrow">
            <ArrowRight size={26} strokeWidth={1.3} />
            <span>interpret</span>
          </div>
          <div className="polynomial-side">
            <div className="object-label">
              <span className="object-badge">p</span>
              <span>Your polynomial</span>
            </div>
            <div
              className="polynomial-display"
              aria-label={`Polynomial: ${polynomialTex(e.coefficients, e.showZero)}`}
            >
              <MathText>{'p(X) ='}</MathText>
              <div className="polynomial-terms">
                {(() => {
                  const terms = e.coefficients
                    .map((a, i) => ({ a, i, tex: termTex(a, i, e.showZero) }))
                    .filter((term) => term.tex);
                  return terms.length ? (
                    terms.map((term, index) => (
                      <span
                        className={`polynomial-term ${active === term.i ? 'term-active' : ''}`}
                        key={term.i}
                        onMouseEnter={() => setActive(term.i)}
                        onMouseLeave={() => setActive(null)}
                      >
                        {index > 0 && <span className="term-plus">+</span>}
                        <MathText>{term.tex}</MathText>
                      </span>
                    ))
                  ) : (
                    <MathText>0</MathText>
                  );
                })()}
              </div>
            </div>
            <div className="polynomial-constraint">
              <MathText>{`\\deg(p) < ${k}`}</MathText>
              <span>·</span>
              <span>
                {actualDegree === null ? 'the zero polynomial' : `degree ${actualDegree}`}
              </span>
            </div>
          </div>
        </div>
        <div className="panel-bottomline">
          <span>
            <CornerDownRight size={15} /> Each tape position becomes a power of{' '}
            <MathText>X</MathText>.
          </span>
          <Toggle
            label="Show zero terms"
            checked={e.showZero}
            onChange={(showZero) => patch({ showZero })}
          />
        </div>
      </section>
      <div className="lesson-two-columns">
        <section className="mapping-section">
          <Eyebrow>ONE CELL, ONE TERM</Eyebrow>
          <div className="table-scroll">
            <table className="math-table">
              <thead>
                <tr>
                  <th>Tape position</th>
                  <th>Value</th>
                  <th>Polynomial term</th>
                </tr>
              </thead>
              <tbody>
                {e.coefficients.map((a, i) => (
                  <tr
                    key={i}
                    className={active === i ? 'row-active' : ''}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <td>
                      <span className="index-label">{String(i).padStart(2, '0')}</span>
                    </td>
                    <td>{a}</td>
                    <td>
                      <MathText>{termTex(a, i, true)}</MathText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="side-explanation">
          <Eyebrow>THE IDEA</Eyebrow>
          <h2>
            The position gives
            <br />
            the number its power.
          </h2>
          <p>
            The first cell is the constant. The next multiplies <MathText>X</MathText>, then{' '}
            <MathText>{'X^2'}</MathText>, and so on.
          </p>
          <Insight>
            <strong>{k} coefficients.</strong> A polynomial of degree less than {k}. The same
            message, written another way.
          </Insight>
          <p className="small muted">
            We work in <MathText>{`\\mathbb{F}_{${e.q}}`}</MathText>: all values are integers from 0
            to {e.q - 1}, and arithmetic wraps modulo {e.q}.
          </p>
        </section>
      </div>
      <Definition>
        <MathText block>{'p(X)=\\sum_{i=0}^{k-1} a_iX^i,\\qquad \\deg(p)<k'}</MathText>
        <p>
          The message length <MathText>k</MathText> counts coefficient slots, including trailing
          zero slots. A zero leading coefficient can lower the actual degree without changing the
          dimension of the code.
        </p>
      </Definition>
    </>
  );
}
