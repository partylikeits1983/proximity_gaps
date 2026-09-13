import { useMemo } from 'react';
import { MathText } from '../components/Math';
import { Tape } from '../components/Tape';
import { Definition, Slider, Stat } from '../components/Controls';
import { analyzeMca, MCA_PRESETS, type McaSettings } from '../core/agreement';
import { polynomialTex } from '../core/math';
import { useExperiment } from '../state/ExperimentContext';
import { BallScene } from '../visuals/BallScene';
import './ResearchLessons.css';

type Challenge = ReturnType<typeof analyzeMca>['challenges'][number];
function preferredCodeword(challenge: Challenge) {
  return (
    challenge.candidates.find((candidate) => candidate.bad)?.index ??
    challenge.distances.indexOf(challenge.nearest)
  );
}

const initial = MCA_PRESETS.radius;
const initialSettings = {
  ...initial,
  codeword: preferredCodeword(
    analyzeMca(initial.u0, initial.u1, initial.radius).challenges[initial.gamma],
  ),
};

export default function MutualAgreement() {
  const { experiment: e, patch } = useExperiment();
  const settings = e.mca ?? initialSettings;
  const update = (change: Partial<McaSettings>) => patch({ mca: { ...settings, ...change } });
  const analysis = useMemo(
    () => analyzeMca(settings.u0, settings.u1, settings.radius),
    [settings.u0, settings.u1, settings.radius],
  );
  const selected = analysis.challenges[settings.gamma];
  const center = analysis.book[settings.codeword];
  const witness = selected.candidates.find((candidate) => candidate.index === settings.codeword);
  const support = witness?.support ?? [];
  const chooseGamma = (gamma: number) =>
    update({ gamma, codeword: preferredCodeword(analysis.challenges[gamma]) });
  const load = (preset: keyof typeof MCA_PRESETS) => {
    const next = MCA_PRESETS[preset];
    const result = analyzeMca(next.u0, next.u1, next.radius);
    patch({ mca: { ...next, codeword: preferredCodeword(result.challenges[next.gamma]) } });
  };
  const changeRadius = (radius: number) => update({ radius });
  // Multiple challenge values may produce the same word (zero direction).
  // Draw that word once, but retain all five outcomes in probability counts.
  const distinct = [
    ...new Map(
      analysis.challenges.map((challenge) => [challenge.word.join(','), challenge]),
    ).values(),
  ];
  return (
    <div className="research-lesson">
      <div className="research-heading">
        <h2>When a combination looks polynomial.</h2>
        <p>
          Mix two received rows using one field challenge. MCA asks whether every large agreement of
          the result can be explained in both original rows, on the same positions.
        </p>
      </div>
      <section className="research-panel" aria-label="MCA experiment">
        <div className="research-toolbar mca-presets" role="group" aria-label="MCA examples">
          <span>Examples</span>
          <button className="subtle-button" onClick={() => load('radius')}>
            Growing radius
          </button>
          <button className="subtle-button" onClick={() => load('cancellation')}>
            Errors cancel
          </button>
          <button className="subtle-button" onClick={() => load('code')}>
            Line inside the code
          </button>
        </div>
        <div className="mca-line-section">
          <div className="mca-line-heading">
            <MathText>{'w_\\gamma=u_0+\\gamma u_1'}</MathText>
            <span>Choose a point on the affine line · arithmetic modulo 5</span>
          </div>
          <div className="challenge-line" role="group" aria-label="All five field challenges">
            {analysis.challenges.map((challenge) => (
              <button
                key={challenge.gamma}
                className={`challenge-point ${challenge.bad ? 'challenge-bad' : challenge.near ? 'challenge-near' : ''}`}
                aria-label={`Challenge ${challenge.gamma}: ${challenge.bad ? 'MCA failure' : challenge.near ? 'near code, all supports explained' : 'outside all balls'}`}
                aria-pressed={settings.gamma === challenge.gamma}
                onClick={() => chooseGamma(challenge.gamma)}
              >
                <span className="challenge-dot" />
                <MathText>{`\\gamma=${challenge.gamma}`}</MathText>
                <span className="challenge-status">
                  {challenge.bad ? 'MCA failure' : challenge.near ? 'Explained' : 'Outside'}
                </span>
                <span className="challenge-distance">distance {challenge.nearest}</span>
              </button>
            ))}
          </div>
          <p className="research-caption">
            Five equally likely challenges, placed in parameter order. This strip is not a Euclidean
            projection of the word space.
          </p>
        </div>
        <div className="mca-scene">
          <div className="mca-ball">
            <label className="mca-center-label">
              Focus on one codeword’s ball
              <select
                aria-label="Ball center polynomial"
                value={settings.codeword}
                onChange={(event) => update({ codeword: Number(event.target.value) })}
              >
                {analysis.book.map((c, i) => (
                  <option key={c.id} value={i}>
                    p(X) = {c.coefficients[0]} + {c.coefficients[1]}X · distance{' '}
                    {selected.distances[i]} from selected word
                  </option>
                ))}
              </select>
            </label>
            <BallScene
              maxDistance={5}
              radius={settings.radius}
              centerLabel="c"
              label="Hamming ball centered on the selected valid codeword"
              points={distinct.map((challenge) => {
                const group = analysis.challenges.filter(
                  (other) => other.word.join(',') === challenge.word.join(','),
                );
                const active = group.some((other) => other.gamma === settings.gamma);
                return {
                  id: challenge.word.join(','),
                  label: group.map((other) => `γ=${other.gamma}`).join(', '),
                  distance: challenge.distances[settings.codeword],
                  emphasis: active,
                  selected: active,
                  description: `Challenge ${group.map((other) => other.gamma).join(', ')}, word ${challenge.word.join(', ')}, distance ${challenge.distances[settings.codeword]} from this codeword`,
                  onSelect: () => update({ gamma: active ? settings.gamma : challenge.gamma }),
                };
              })}
              showLabels
            />
            <p className="research-caption">
              One of 25 codeword-centered balls. Rings give exact distances to this center; angles
              and distances between other points carry no meaning.
            </p>
          </div>
          <div className="mca-controls">
            <Slider label="Ball radius" value={settings.radius} max={5} onChange={changeRadius} />
            <div className="mca-radius-summary">
              <MathText>{`\\delta=\\frac{${settings.radius}}{5}`}</MathText>
              <span>
                Agreement needs at least <strong>{5 - settings.radius} of 5</strong> positions.
              </span>
            </div>
            <div className="mca-probabilities" aria-live="polite">
              <Stat
                label="Inside at least one ball"
                value={<span data-testid="mca-near-count">{analysis.nearCount}/5</span>}
                detail="Count each challenge once"
              />
              <Stat
                label="MCA failures"
                value={<span data-testid="mca-bad-count">{analysis.badCount}/5</span>}
                detail="Some qualifying support fails to explain an original row"
              />
            </div>
            <p className="research-caption">
              Exact fractions for these two input rows. A theorem must bound the failure fraction
              for every choice of input rows.
            </p>
          </div>
        </div>
      </section>
      <section className="research-panel mca-witness" aria-label="Same-support witness">
        <div className="research-toolbar">
          <h3>Inspect γ = {settings.gamma}</h3>
          <span className={`witness-status ${selected.bad ? 'is-bad' : ''}`}>
            {selected.bad
              ? 'At least one support fails'
              : selected.near
                ? 'All qualifying supports explained'
                : 'No qualifying agreement'}
          </span>
        </div>
        <div className="mca-witness-content">
          <p>
            {witness ? (
              <>
                The selected codeword{' '}
                <MathText>{`c=\\operatorname{ev}(${polynomialTex(center.coefficients)})`}</MathText>{' '}
                agrees with the combination on <strong>{support.length} positions</strong>. Can each
                original row be polynomial on this same set?
              </>
            ) : (
              <>
                The selected codeword is {selected.distances[settings.codeword]} positions away,
                outside radius {settings.radius}.{' '}
                {selected.near
                  ? 'Choose a nearby codeword above to inspect its agreement set.'
                  : 'Increase the radius to admit an agreement set.'}
              </>
            )}
          </p>
          <div
            className="research-scroll"
            tabIndex={0}
            role="region"
            aria-label="Original rows and combined agreement positions"
          >
            <table className="support-table">
              <thead>
                <tr>
                  <th scope="col">Row</th>
                  {selected.word.map((_, x) => (
                    <th scope="col" key={x}>
                      <MathText>{`x=${x}`}</MathText>
                    </th>
                  ))}
                  <th scope="col">Polynomial on this set?</th>
                </tr>
              </thead>
              <tbody>
                {[settings.u0, settings.u1, selected.word, center.word].map((row, j) => (
                  <tr key={j}>
                    <th scope="row">
                      <MathText>{['u_0', 'u_1', 'w_\\gamma', 'c'][j]}</MathText>
                      {j === 2 && <span className="support-row-hint">combined</span>}
                    </th>
                    {row.map((value, x) => (
                      <td key={x} className={support.includes(x) ? 'support-in' : 'support-out'}>
                        {value}
                      </td>
                    ))}
                    <td className="support-explanation">
                      {!witness ? (
                        '—'
                      ) : j < 2 ? (
                        witness.explanations[j].length ? (
                          <MathText>{`p_${j}(X)=${polynomialTex(witness.explanations[j][0].coefficients)}`}</MathText>
                        ) : (
                          <span className="is-bad">None of the 25 codewords</span>
                        )
                      ) : (
                        <span className="support-yes">✓ agrees on T</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Support T</th>
                  {selected.word.map((_, x) => (
                    <td key={x} className={support.includes(x) ? 'support-in' : 'support-out'}>
                      {support.includes(x) ? '✓' : '·'}
                    </td>
                  ))}
                  <td>
                    {witness ? `${support.length} ≥ ${5 - settings.radius}` : 'No selected support'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {witness && (
            <p className={`witness-conclusion ${witness.bad ? 'is-bad' : ''}`}>
              {witness.bad
                ? 'This is an MCA failure: the combination has a polynomial explanation here, but at least one original row has none on these same positions.'
                : selected.bad
                  ? 'This support is explained, but another qualifying support fails. Inspect a failing candidate below.'
                  : 'Both original rows have polynomial explanations on this set. Proximity here is consistent with the original rows.'}
            </p>
          )}
          {selected.candidates.length > 1 && (
            <div
              className="candidate-supports"
              role="group"
              aria-label="All qualifying candidate supports"
            >
              {selected.candidates.map((candidate) => (
                <button
                  key={candidate.index}
                  className={`subtle-button ${candidate.bad ? 'is-bad' : ''}`}
                  aria-label={`Inspect candidate ${candidate.index}, ${candidate.support.length} agreement positions, ${candidate.bad ? 'failing' : 'explained'} support`}
                  aria-pressed={settings.codeword === candidate.index}
                  onClick={() => update({ codeword: candidate.index })}
                >
                  <MathText>{polynomialTex(analysis.book[candidate.index].coefficients)}</MathText>
                  <span>
                    {candidate.support.length} positions · {candidate.bad ? 'failure' : 'explained'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <Definition title="Edit the two original rows">
        <p>
          These are received words, so they need not be valid RS codewords. Changing them changes
          the affine line.
        </p>
        <div className="mca-edit-rows">
          {[settings.u0, settings.u1].map((row, j) => (
            <div key={j}>
              <MathText>{`u_${j}`}</MathText>
              <Tape
                values={row}
                q={5}
                editable
                compact
                label={`MCA input row ${j}`}
                onChange={(index, value) => {
                  const next = {
                    ...settings,
                    [j === 0 ? 'u0' : 'u1']: row.map((a, x) => (x === index ? value : a)),
                  };
                  const result = analyzeMca(next.u0, next.u1, next.radius);
                  patch({
                    mca: { ...next, codeword: preferredCodeword(result.challenges[next.gamma]) },
                  });
                }}
              />
            </div>
          ))}
        </div>
      </Definition>
      <Definition title="What are the square, balls, line, and probability?">
        <p>
          The ambient space is <MathText>{'\\mathbb F_5^5'}</MathText>: 3,125 possible words, of
          which 25 are RS codewords of degree less than 2. A square can represent this space
          schematically. A ball <MathText>{'B(c,E)'}</MathText> contains every word differing from
          its center in at most E positions.
        </p>
        <p>
          The affine line is <MathText>{'\\{u_0+\\gamma u_1:\\gamma\\in\\mathbb F_5\\}'}</MathText>.
          Sample γ uniformly. Ball incidence is the fraction of challenges whose words are close to
          at least one codeword, not a fraction of the square’s drawn area. If the direction is
          zero, all challenges select the same word.
        </p>
        <p>
          MCA controls a smaller event: there exists a sufficiently large set T on which the
          combined word has a codeword explanation, but at least one input has none on T. A line
          inside the code has proximity 1 and failure 0.
        </p>
        <p>
          There is no universal radius where a drawn line “starts intersecting.” The research
          question is how large δ can be while keeping the worst-case failure probability below a
          target ε, for the specified code and challenge distribution.
        </p>
        <p>
          We check all 25 codewords and all five challenges. Checking each candidate’s full
          agreement set is sufficient: if an input has no explanation on a subset, it cannot have
          one on a larger set containing it. This is exact enumeration of this example, including
          radius endpoints, not a claim about a theorem’s admissible radius range.
        </p>
        <p>
          Definition:{' '}
          <a href="https://eprint.iacr.org/2024/1586" target="_blank" rel="noreferrer">
            WHIR, §4.2, Definition 4.9
          </a>{' '}
          (PDF retrieved September 13, 2026).
        </p>
      </Definition>
    </div>
  );
}
