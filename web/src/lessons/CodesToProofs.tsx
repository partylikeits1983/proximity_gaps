import { useMemo, useState } from 'react';
import { ArrowRight, Check, LockKeyhole, X } from 'lucide-react';
import { MathText } from '../components/Math';
import { Tape } from '../components/Tape';
import { Definition, Toggle } from '../components/Controls';
import { evaluate, mod, polynomialTex } from '../core/math';
import {
  fft,
  friFoldPair,
  interpolate,
  lagrangeBasis,
  lowDegreeExtension,
  starkSizes,
} from '../core/stark';
import { useExperiment } from '../state/ExperimentContext';
import { DEFAULT_PROOF, type ProofSettings } from '../state/model';
import './CodesToProofs.css';

const stages = [
  { title: 'Trace values', actor: 'Prover' },
  { title: 'Interpolate', actor: 'Prover' },
  { title: 'Extend', actor: 'Prover' },
  { title: 'FRI check', actor: 'Verifier' },
];

function QueryTable({
  title,
  points,
  values,
  opened,
}: {
  title: string;
  points: readonly number[];
  values: readonly number[];
  opened: readonly number[];
}) {
  return (
    <div className="proof-query-table" role="group" aria-label={title}>
      <div className="proof-table-heading">
        <LockKeyhole size={13} />
        <span>{title}</span>
      </div>
      <div className="proof-query-cells">
        {points.map((point, i) => (
          <div
            key={point}
            className={'proof-query-cell' + (opened.includes(i) ? ' is-open' : '')}
            aria-label={
              opened.includes(i)
                ? 'Opened at x=' + point + ': ' + values[i]
                : 'Unopened at x=' + point
            }
          >
            <span className="proof-coordinate">{point}</span>
            <strong>{opened.includes(i) ? values[i] : '·'}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CodesToProofs() {
  const { experiment: e, patch, setExample, loadDefault } = useExperiment();
  const settings = e.proof ?? DEFAULT_PROOF;
  const update = (change: Partial<ProofSettings>) => patch({ proof: { ...settings, ...change } });
  const [basisIndex, setBasisIndex] = useState(0);
  const { traceLength, extensions } = starkSizes(e.coefficients.length, e.q);
  const extension = extensions.includes(settings.extension) ? settings.extension : extensions[0];
  const example = useMemo(
    () => (extension ? lowDegreeExtension(e.coefficients, e.q, extension) : null),
    [e.coefficients, e.q, extension],
  );
  const basis = useMemo(
    () => (example ? lagrangeBasis(example.traceDomain, e.q) : []),
    [example, e.q],
  );
  const currentBasis = Math.min(basisIndex, traceLength - 1);

  if (!example)
    return (
      <section className="experiment-panel proof-unavailable">
        <h2>A domain with room to extend.</h2>
        <p>
          This FFT example needs {traceLength} trace points and at least {traceLength * 2}{' '}
          evaluation points in a power-of-two multiplicative subgroup. The current field and message
          length cannot provide that domain.
        </p>
        <button className="proof-load-button" onClick={() => loadDefault()}>
          Load the F₁₇ FFT example <ArrowRight size={16} />
        </button>
        <p className="small muted">
          The preset uses the polynomial 3 + 2X + X², four trace values, and eight extended values.
        </p>
      </section>
    );

  const { traceDomain, trace, recovered, domain, codeword } = example;
  const half = domain.length / 2;
  const query = Math.min(settings.query, half - 1);
  const x = domain[query];
  const foldedDomain = domain.slice(0, half).map((point) => mod(point * point, e.q));
  const folded = foldedDomain.map((_, i) =>
    friFoldPair(codeword[i], codeword[i + half], domain[i], settings.alpha, e.q),
  );
  const claimed = folded.map((value, i) =>
    settings.tamper && i === 0 ? mod(value + 1, e.q) : value,
  );
  const expected = friFoldPair(codeword[query], codeword[query + half], x, settings.alpha, e.q);
  const agrees = expected === claimed[query];
  const lagrange = interpolate(traceDomain, trace, e.q);
  const changeTrace = (index: number, value: number) => {
    const next = trace.map((entry, i) => (i === index ? value : entry));
    setExample(fft(next, e.q, true), e.n);
  };

  return (
    <>
      <section className="experiment-panel proof-experiment">
        <div className="proof-topline">
          <span>STARK · low-degree extension</span>
          <span>
            <MathText>{'m=' + traceLength}</MathText> trace values
            <ArrowRight size={13} />
            <MathText>{'N=' + domain.length}</MathText> evaluations
          </span>
        </div>
        <div className="proof-stages" role="group" aria-label="From codes to proofs stages">
          {stages.map((stage, i) => (
            <button
              key={stage.title}
              className={'proof-stage' + (settings.stage === i ? ' is-current' : '')}
              aria-label={stage.actor + ': ' + stage.title}
              aria-pressed={settings.stage === i}
              aria-controls="proof-stage-content"
              onClick={() => update({ stage: i })}
            >
              <span className="proof-stage-number">{i + 1}</span>
              <span>
                <small>{stage.actor}</small>
                <strong>{stage.title}</strong>
              </span>
              {i < stages.length - 1 && <ArrowRight size={14} className="proof-stage-arrow" />}
            </button>
          ))}
        </div>
        <div className="proof-content" id="proof-stage-content">
          {settings.stage === 0 && (
            <>
              <div className="proof-introduction">
                <h2>Start with evaluations.</h2>
                <p>
                  A trace column records values at known points: <MathText>{'v_i=p(h_i)'}</MathText>
                  . Edit one to change the polynomial.
                </p>
              </div>
              <Tape
                values={trace}
                points={traceDomain}
                pointSymbol="h"
                label="Trace values"
                q={e.q}
                editable
                onChange={changeTrace}
              />
              <div className="proof-key-equation">
                <MathText>{'p(h_i)=v_i,\\qquad \\deg(p)<' + traceLength}</MathText>
              </div>
              <p className="proof-caption">
                Earlier, the message tape held coefficients. This tape holds evaluations of the same
                polynomial on a roots-of-unity domain.
              </p>
            </>
          )}
          {settings.stage === 1 && (
            <>
              <div className="proof-introduction">
                <h2>Recover the same polynomial.</h2>
                <p>
                  The prover knows every trace value. An inverse FFT converts them into
                  coefficients.
                </p>
              </div>
              <div
                className="proof-key-equation proof-polynomial"
                aria-label={'Interpolated polynomial: ' + polynomialTex(recovered)}
              >
                <MathText>{'p(X)=' + polynomialTex(recovered)}</MathText>
              </div>
              <Tape
                values={recovered}
                q={e.q}
                label="Interpolated coefficients"
                coefficientLabels
              />
              <p className="proof-caption">
                There are {traceLength} coefficient slots, including trailing zeros. No transmission
                errors are being corrected.
              </p>
              <Definition title="See the Lagrange interpolation">
                <p>
                  Lagrange interpolation gives the same result. Each basis polynomial is 1 at its
                  own trace point and 0 at every other trace point.
                </p>
                <div className="proof-controls">
                  <label>
                    Basis polynomial
                    <select
                      aria-label="Lagrange basis polynomial"
                      value={currentBasis}
                      onChange={(event) => setBasisIndex(Number(event.target.value))}
                    >
                      {trace.map((_, i) => (
                        <option key={i} value={i}>
                          {'L' + i + ' at h=' + traceDomain[i]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <MathText block>
                  {'L_{' + currentBasis + '}(X)=' + polynomialTex(basis[currentBasis])}
                </MathText>
                <Tape
                  values={traceDomain.map((point) => evaluate(basis[currentBasis], point, e.q))}
                  points={traceDomain}
                  pointSymbol="h"
                  label="Lagrange basis evaluations"
                  compact
                />
                <MathText block>
                  {'p(X)=\\sum_{i=0}^{' +
                    (traceLength - 1) +
                    '}v_i L_i(X)=' +
                    polynomialTex(lagrange)}
                </MathText>
              </Definition>
            </>
          )}
          {settings.stage === 2 && (
            <>
              <div className="proof-introduction">
                <h2>Evaluate on a larger domain.</h2>
                <p>
                  An FFT evaluates the polynomial at {domain.length} points. This low-degree
                  extension is a Reed–Solomon codeword.
                </p>
              </div>
              <div className="proof-controls">
                <label>
                  Blowup factor
                  <select
                    aria-label="STARK blowup factor"
                    value={extension}
                    onChange={(event) =>
                      update({ extension: Number(event.target.value), query: 0 })
                    }
                  >
                    {extensions.map((factor) => (
                      <option key={factor} value={factor}>
                        {factor}× · {traceLength * factor} evaluations
                      </option>
                    ))}
                  </select>
                </label>
                <span className="proof-rate">
                  <MathText>
                    {'\\rho=\\frac{m}{N}=\\frac{' +
                      traceLength +
                      '}{' +
                      domain.length +
                      '}=\\frac{1}{' +
                      extension +
                      '}'}
                  </MathText>
                </span>
              </div>
              <Tape values={codeword} points={domain} label="STARK codeword" q={e.q} compact />
              <div className="proof-key-equation">
                <MathText>
                  {'\\deg(p)<' +
                    traceLength +
                    '\\quad\\text{on }' +
                    domain.length +
                    '\\text{ evaluation points}'}
                </MathText>
              </div>
              <p className="proof-caption">
                The degree bound stays fixed as the table grows. The new evaluation domain changes
                the codeword from the earlier steps.
              </p>
            </>
          )}
          {settings.stage === 3 && (
            <>
              <div className="proof-introduction">
                <h2>Check a fold, locally.</h2>
                <p>
                  The verifier opens two values at <MathText>{'x,-x'}</MathText> and one value in
                  the folded table at <MathText>{'x^2'}</MathText>.
                </p>
              </div>
              <div className="proof-controls">
                <label>
                  Challenge α
                  <select
                    aria-label="FRI challenge"
                    value={settings.alpha}
                    onChange={(event) => update({ alpha: Number(event.target.value) })}
                  >
                    {Array.from({ length: e.q }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Query pair
                  <select
                    aria-label="FRI query pair"
                    value={query}
                    onChange={(event) => update({ query: Number(event.target.value) })}
                  >
                    {domain.slice(0, half).map((point, i) => (
                      <option key={i} value={i}>
                        {point + ' and ' + domain[i + half]}
                      </option>
                    ))}
                  </select>
                </label>
                <Toggle
                  label="Change first folded entry"
                  checked={settings.tamper}
                  onChange={(tamper) => update({ tamper })}
                />
              </div>
              <div className="proof-openings">
                <QueryTable
                  title="Original table w"
                  points={domain}
                  values={codeword}
                  opened={[query, query + half]}
                />
                <div className="proof-fold-connector">
                  <span />
                  <MathText>{'x,-x\\longmapsto x^2'}</MathText>
                  <span />
                </div>
                <QueryTable
                  title="Folded table g"
                  points={foldedDomain}
                  values={claimed}
                  opened={[query]}
                />
              </div>
              <div
                className={'proof-check ' + (agrees ? 'is-consistent' : 'is-inconsistent')}
                role="status"
              >
                <div>
                  {agrees ? <Check size={18} /> : <X size={18} />}
                  <strong>{agrees ? 'This pair agrees.' : 'The fold relation fails.'}</strong>
                  <span>
                    Opened <MathText>{'g(' + foldedDomain[query] + ')=' + claimed[query]}</MathText>
                  </span>
                </div>
                <MathText block>
                  {'\\frac{' +
                    codeword[query] +
                    '+' +
                    codeword[query + half] +
                    '}{2}+' +
                    settings.alpha +
                    '\\cdot\\frac{' +
                    codeword[query] +
                    '-' +
                    codeword[query + half] +
                    '}{2\\cdot' +
                    x +
                    '}\\equiv ' +
                    expected +
                    '\\pmod{' +
                    e.q +
                    '}'}
                </MathText>
              </div>
              <p className="proof-caption">
                Only three opened values are needed for this relation. A passing pair alone does not
                establish low degree. The verifier never needs the reference polynomial shown above.
              </p>
              <Definition title="What the full FRI protocol adds">
                <p>
                  The prover commits to each table with a Merkle root. Challenges determine folds;
                  queries are chosen after the layer commitments. FRI checks authenticated openings
                  across several rounds and the degree of a small final polynomial.
                </p>
                <MathText block>{'p(X)=p_{\\rm even}(X^2)+X p_{\\rm odd}(X^2)'}</MathText>
                <MathText block>{'g(Y)=p_{\\rm even}(Y)+\\alpha p_{\\rm odd}(Y)'}</MathText>
                <p>
                  Here you choose the challenge and pair to inspect the arithmetic. Merkle
                  authentication, Fiat–Shamir, and the remaining rounds are omitted. A full STARK
                  also checks the computation constraints and adds masking for zero knowledge.
                </p>
                <p>
                  See the{' '}
                  <a
                    href="https://eccc.weizmann.ac.il/report/2017/134/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    FRI paper
                  </a>{' '}
                  and this{' '}
                  <a
                    href="https://aszepieniec.github.io/stark-anatomy/fri.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    worked folding construction
                  </a>
                  .
                </p>
              </Definition>
            </>
          )}
        </div>
        <div className="proof-navigation">
          <span>
            {settings.stage < 3
              ? 'Prover: knows the complete trace.'
              : 'Verifier: checks a few authenticated openings.'}
          </span>
          {settings.stage < 3 && (
            <button className="text-button" onClick={() => update({ stage: settings.stage + 1 })}>
              {stages[settings.stage + 1].title} <ArrowRight size={15} />
            </button>
          )}
        </div>
      </section>
      <div className="proof-bridge">
        <div className="proof-bridge-symbol">
          <MathText>{'\\Delta(w,C)'}</MathText>
        </div>
        <div>
          <h3>Why the Hamming balls still matter</h3>
          <p>
            In a STARK, a dishonest prover can supply a table <MathText>w</MathText>. Distance is
            measured to the nearest valid codeword. Nearby polynomial lists help bound the chance of
            cheating; the verifier does not enumerate them.
          </p>
        </div>
      </div>
    </>
  );
}
