import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Plus, X } from 'lucide-react';
import { MathText } from './Math';

function NumberCell({
  value,
  q,
  label,
  onChange,
  onFocus,
  onDelete,
}: {
  value: number;
  q: number;
  label: string;
  onChange: (n: number) => void;
  onFocus?: () => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const valid =
    draft !== '' && Number.isInteger(Number(draft)) && Number(draft) >= 0 && Number(draft) < q;
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      max={q - 1}
      step={1}
      aria-label={label}
      aria-invalid={!valid}
      title={`A whole number from 0 to ${q - 1}`}
      value={draft}
      onFocus={onFocus}
      onBlur={() => setDraft(String(value))}
      onKeyDown={(event) => {
        if (
          onDelete &&
          (event.key === 'Delete' || event.key === 'Backspace') &&
          !event.nativeEvent.isComposing &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey
        ) {
          event.preventDefault();
          setDraft(String(value));
          onDelete();
        }
      }}
      onChange={(event) => {
        const raw = event.target.value;
        setDraft(raw);
        const number = Number(raw);
        if (raw !== '' && Number.isInteger(number) && number >= 0 && number < q) onChange(number);
      }}
    />
  );
}

export function Tape({
  values,
  q = 17,
  label,
  editable = false,
  coefficientLabels = false,
  points,
  pointSymbol = 'x',
  onChange,
  active,
  onActive,
  mismatches = [],
  onAdd,
  onRemove,
  onRemoveAt,
  compact = false,
  hideIndices = false,
  hideMismatchMarks = false,
  onSelect,
  renderBelow,
}: {
  values: readonly number[];
  q?: number;
  label: string;
  editable?: boolean;
  coefficientLabels?: boolean;
  points?: readonly number[];
  pointSymbol?: string;
  onChange?: (index: number, value: number) => void;
  active?: number | null;
  onActive?: (index: number | null) => void;
  mismatches?: readonly number[];
  onAdd?: () => void;
  onRemove?: () => void;
  onRemoveAt?: (index: number) => void;
  compact?: boolean;
  hideIndices?: boolean;
  hideMismatchMarks?: boolean;
  onSelect?: (index: number) => void;
  renderBelow?: (value: number, index: number) => ReactNode;
}) {
  const tapeRef = useRef<HTMLDivElement>(null);
  const focusAfterRemoval = useRef<number | null>(null);
  useEffect(() => {
    const index = focusAfterRemoval.current;
    if (index === null) return;
    focusAfterRemoval.current = null;
    tapeRef.current?.querySelectorAll('input')[Math.min(index, values.length - 1)]?.focus();
  }, [values.length]);

  return (
    <div
      ref={tapeRef}
      className={`tape-scroll ${compact ? 'tape-compact' : ''} ${points ? 'tape-with-points' : ''}`}
      role="group"
      aria-label={label}
    >
      <div className="tape" onMouseLeave={() => onActive?.(null)}>
        {values.map((value, index) => (
          <div
            className={`tape-column ${active === index ? 'is-active' : ''} ${mismatches.includes(index) ? 'is-changed' : ''}`}
            key={index}
            onMouseEnter={() => onActive?.(index)}
          >
            {!hideIndices && (
              <span className="tape-index">
                {points ? (
                  <MathText>{pointSymbol + '_{' + index + '}=' + points[index]}</MathText>
                ) : coefficientLabels ? (
                  <MathText>{`a_{${index}}`}</MathText>
                ) : (
                  String(index + 1).padStart(2, '0')
                )}
              </span>
            )}
            <div className="tape-cell">
              {editable && onChange ? (
                <NumberCell
                  value={value}
                  q={q}
                  label={`${label}, ${coefficientLabels ? 'coefficient' : 'position'} ${coefficientLabels ? index : index + 1}`}
                  onChange={(n) => onChange(index, n)}
                  onFocus={() => onActive?.(index)}
                  onDelete={
                    onRemoveAt
                      ? () => {
                          if (values.length <= 1) return;
                          focusAfterRemoval.current = index;
                          onRemoveAt(index);
                        }
                      : undefined
                  }
                />
              ) : onSelect ? (
                <button
                  className="tape-select"
                  aria-label={label + ', position ' + (index + 1) + ', value ' + value}
                  aria-pressed={active === index}
                  onClick={() => onSelect(index)}
                  onFocus={() => onActive?.(index)}
                >
                  {value}
                </button>
              ) : (
                <span>{value}</span>
              )}
            </div>
            {renderBelow?.(value, index)}
            {!hideMismatchMarks && mismatches.includes(index) && (
              <X size={12} className="mismatch-mark" aria-label="Different symbol" />
            )}
          </div>
        ))}
        {onAdd && (
          <div className="tape-column tape-add">
            <span className="tape-index">&nbsp;</span>
            <button className="tape-cell" onClick={onAdd} aria-label="Add coefficient">
              <Plus size={20} />
            </button>
          </div>
        )}
      </div>
      {onRemove && (
        <button className="text-button tape-remove" onClick={onRemove}>
          Remove last coefficient
        </button>
      )}
    </div>
  );
}
