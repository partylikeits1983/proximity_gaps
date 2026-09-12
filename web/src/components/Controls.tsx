import { useId, type CSSProperties, type ReactNode } from 'react';
import { ChevronDown, Minus, Plus } from 'lucide-react';

export function Slider({
  label,
  value,
  min = 0,
  max,
  onChange,
  hint,
  markers = [],
}: {
  label: string;
  value: number;
  min?: number;
  max: number;
  onChange: (n: number) => void;
  hint?: ReactNode;
  markers?: { value: number; label: string }[];
}) {
  const id = useId();
  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-control">
      <div className="control-heading">
        <label htmlFor={id}>{label}</label>
        <div className="stepper">
          <button
            className="icon-button"
            aria-label={`Decrease ${label.toLowerCase()}`}
            disabled={value <= min}
            onClick={() => onChange(value - 1)}
          >
            <Minus size={14} />
          </button>
          <output htmlFor={id}>
            {value}
            <span> / {max}</span>
          </output>
          <button
            className="icon-button"
            aria-label={`Increase ${label.toLowerCase()}`}
            disabled={value >= max}
            onClick={() => onChange(value + 1)}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="slider-track-wrap">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          disabled={min === max}
          aria-valuetext={`${value} of ${max}`}
          style={{ '--progress': `${percentage}%` } as CSSProperties}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {markers
          .filter((marker) => marker.value > min && marker.value < max)
          .map((marker) => (
            <span
              className="slider-marker"
              key={marker.label}
              style={{ left: `${((marker.value - min) / (max - min || 1)) * 100}%` }}
            >
              <i />
              {marker.label}
            </span>
          ))}
      </div>
      <div className="slider-endpoints">
        <span>{markers.find((marker) => marker.value === min)?.label ?? min}</span>
        <span>{markers.find((marker) => marker.value === max)?.label ?? max}</span>
      </div>
      {hint && <p className="control-hint">{hint}</p>}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export function Definition({
  children,
  title = 'The mathematics behind it',
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <details className="definition">
      <summary>
        <span>{title}</span>
        <ChevronDown size={16} />
      </summary>
      <div className="definition-content">{children}</div>
    </details>
  );
}

export function Insight({
  children,
  tone = 'green',
}: {
  children: ReactNode;
  tone?: 'green' | 'amber' | 'neutral';
}) {
  return (
    <div className={`insight insight-${tone}`}>
      <span className="insight-dot" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function Stat({
  label,
  value,
  detail,
}: {
  label: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
}) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <div className="stat-value">{value}</div>
      {detail && <span className="stat-detail">{detail}</span>}
    </div>
  );
}
