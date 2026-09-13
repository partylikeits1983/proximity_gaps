import { useId, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MathText } from './Math';

const topics = ['The idea', 'Why a list?', 'In a STARK'];

/** A short guided explanation above the live list experiment. */
export function ListDecodingExplainer({
  k,
  n,
  radius,
  onExample,
}: {
  k: number;
  n: number;
  radius: number;
  onExample: (errors: 2 | 3) => void;
}) {
  const [topic, setTopic] = useState(0);
  const panelId = useId();
  return (
    <section className="list-explainer" aria-labelledby={panelId + '-title'}>
      <div className="list-explainer-heading">
        <h2 id={panelId + '-title'}>List decoding</h2>
        <div className="list-explainer-topics" role="group" aria-label="List decoding explanation">
          {topics.map((title, index) => (
            <button
              key={title}
              aria-pressed={topic === index}
              aria-controls={panelId}
              onClick={() => setTopic(index)}
            >
              {title}
            </button>
          ))}
        </div>
      </div>
      <div id={panelId} className="list-explainer-content">
        {topic === 0 && (
          <>
            <p>
              Given a received word <MathText>w</MathText> and an error budget{' '}
              <MathText>E</MathText>, return <strong>every valid codeword</strong> that differs from
              it in at most <MathText>E</MathText> positions.
            </p>
            <div
              className="list-definition-flow"
              role="group"
              aria-label="Received word, distance filter, candidate list"
            >
              <div>
                <span>Input</span>
                <MathText>w</MathText>
                <small>possibly corrupted</small>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
              <div>
                <span>Keep every codeword with</span>
                <MathText>{'\\Delta(c,w)\\le E'}</MathText>
                <small>at most {radius} differences here</small>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
              <div>
                <span>Output</span>
                <MathText>{'\\Lambda(C,w,E)'}</MathText>
                <small>the complete candidate list</small>
              </div>
            </div>
            <p className="list-explainer-detail">
              For this RS code, each candidate is the evaluation of a polynomial with degree less
              than {k}, agreeing with <MathText>w</MathText> in at least {n - radius} of {n}{' '}
              positions. The list may be empty, contain one answer, or contain several.
            </p>
          </>
        )}
        {topic === 1 && (
          <>
            <p>
              Two different polynomials can both fit the error budget. Returning a list preserves
              both possibilities; the received word and budget alone may not identify the original.
            </p>
            <div className="list-example-choices">
              <button onClick={() => onExample(2)} aria-label="Load 2 errors: one candidate">
                <span>Load 2 errors · E = 2</span>
                <MathText>{'w\\longrightarrow\\{c_1\\}'}</MathText>
                <small>One candidate</small>
              </button>
              <button onClick={() => onExample(3)} aria-label="Load 3 errors: two candidates">
                <span>Load 3 errors · E = 3</span>
                <MathText>{'w\\longrightarrow\\{c_1,c_2\\}'}</MathText>
                <small>Two candidates, each at distance 3</small>
              </button>
            </div>
            <p className="list-explainer-detail">
              These buttons load the F₁₇ example with k = 3 and n = 8. Its unique-decoding radius is
              t = 2. Beyond t, uniqueness is no longer guaranteed. Then keep the received word fixed
              and move the search-radius slider: increasing E can only add candidates.
            </p>
          </>
        )}
        {topic === 2 && (
          <>
            <p>
              In a STARK, the verifier checks a committed table for proximity to a low-degree
              polynomial code through protocols such as FRI. It does not normally run a
              list-decoding algorithm or reconstruct the prover’s polynomial.
            </p>
            <div className="list-stark-connection">
              <div>
                <MathText>{'|\\Lambda(C,w,E)|'}</MathText>
                <span>How many low-degree explanations could fit?</span>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
              <div>
                <strong>Soundness analysis</strong>
                <span>
                  Bounds on those possibilities help analyze the chance of accepting a false claim.
                </span>
              </div>
            </div>
            <p className="list-explainer-detail">
              Interpolation has a different role: once a clean candidate codeword is known, any k
              distinct evaluations recover its polynomial. Interpolating arbitrary values from a
              corrupted word does not, by itself, find the decoding list. The next step shows the
              prover’s FFT work and a verifier’s local FRI check.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
