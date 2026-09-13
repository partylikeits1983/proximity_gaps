import { MathText } from './Math';
import { Tape } from './Tape';

export function WordComparison({
  reference,
  received,
  q,
  onChange,
}: {
  reference: readonly number[];
  received: readonly number[];
  q: number;
  onChange?: (index: number, value: number) => void;
}) {
  const mismatches = reference.flatMap((value, i) => (value !== received[i] ? [i] : []));
  return (
    <div className="aligned-words-scroll">
      <div className="aligned-words">
        <div className="aligned-word-row">
          <span className="aligned-word-label">
            <MathText>c</MathText>
            <span>reference</span>
          </span>
          <Tape
            values={reference}
            label="Sent word"
            mismatches={mismatches}
            compact
            hideMismatchMarks
          />
        </div>
        <div className="aligned-word-row">
          <span />
          <div
            className="aligned-comparisons"
            aria-label={mismatches.length + ' of ' + reference.length + ' positions differ'}
          >
            {reference.map((_, i) => (
              <span
                key={i}
                className={mismatches.includes(i) ? 'is-different' : ''}
                aria-label={
                  'Position ' + (i + 1) + (mismatches.includes(i) ? ' differs' : ' matches')
                }
              >
                {mismatches.includes(i) ? '≠' : '='}
              </span>
            ))}
          </div>
        </div>
        <div className="aligned-word-row">
          <span className="aligned-word-label">
            <MathText>w</MathText>
            <span>received</span>
          </span>
          <Tape
            values={received}
            label="Received word"
            q={q}
            editable={Boolean(onChange)}
            onChange={onChange}
            mismatches={mismatches}
            compact
            hideIndices
            hideMismatchMarks
          />
        </div>
      </div>
    </div>
  );
}
