import type { CSSProperties } from 'react';

export type BallPoint = {
  id: string;
  label: string;
  distance: number;
  codeword?: boolean;
  emphasis?: boolean;
  selected?: boolean;
  description?: string;
  onSelect?: () => void;
};

export function BallScene({
  maxDistance,
  radius,
  points,
  centerLabel = 'w',
  guarantee,
  showLabels = false,
  coincidentLabel,
  label,
}: {
  maxDistance: number;
  radius: number;
  points: BallPoint[];
  centerLabel?: string;
  guarantee?: number;
  showLabels?: boolean;
  coincidentLabel?: string;
  label: string;
}) {
  const shells = Array.from({ length: maxDistance + 1 }, (_, i) =>
    points.filter((point) => point.distance === i),
  );
  const diameter = (r: number) => Math.max(4, (r / maxDistance) * 80) + '%';
  const hasCenterPoint = points.some((point) => point.distance === 0);
  return (
    <div
      className={
        'ball-stage graph-paper' + (showLabels ? ' ball-show-all' : ' ball-context-labels')
      }
      role="group"
      aria-label={label}
    >
      <div className="ball-coordinate">HAMMING DISTANCE FROM {centerLabel.toUpperCase()}</div>
      <span className="ball-radius-badge">E = {radius}</span>
      <div className="ball-square">
        {Array.from({ length: maxDistance }, (_, i) => i + 1).map((r) => (
          <div
            key={r}
            className="distance-ring"
            style={{ width: diameter(r), height: diameter(r) }}
          />
        ))}
        {Array.from({ length: maxDistance }, (_, i) => i + 1)
          .filter(
            (r) => maxDistance <= 8 || r % Math.ceil(maxDistance / 8) === 0 || r === maxDistance,
          )
          .map((r) => (
            <span
              className="ring-number"
              key={r}
              aria-hidden="true"
              style={{
                left: 50 - (r / maxDistance) * 28.284 + '%',
                top: 50 - (r / maxDistance) * 28.284 + '%',
              }}
            >
              {r}
            </span>
          ))}
        <div
          className="hamming-ball"
          style={{ width: diameter(radius), height: diameter(radius) }}
        />
        {guarantee !== undefined && (
          <div
            className="guarantee-ring"
            style={{ width: diameter(guarantee), height: diameter(guarantee) }}
          >
            <span>t = {guarantee}</span>
          </div>
        )}
        {shells.flatMap((shell, shellIndex) =>
          shell.map((point, index) => {
            const angle =
              ((-75 + shellIndex * 11 + (360 * index) / Math.max(shell.length, 1)) * Math.PI) / 180;
            const r = (point.distance / maxDistance) * 40;
            const style = {
              left: `${50 + Math.cos(angle) * r}%`,
              top: `${50 + Math.sin(angle) * r}%`,
            } as CSSProperties;
            const description =
              point.description ??
              `${point.label}, distance ${point.distance}, ${point.distance <= radius ? 'inside' : 'outside'} the ball`;
            return (
              <button
                key={point.id}
                className={`ball-point ${point.distance <= radius ? 'is-inside' : ''} ${point.codeword ? 'is-codeword' : ''} ${point.emphasis ? 'is-emphasis' : ''} ${point.selected ? 'is-selected' : ''} ${point.distance === 0 ? 'at-center' : ''}`}
                style={style}
                onClick={point.onSelect}
                aria-label={description}
                aria-pressed={point.onSelect ? Boolean(point.selected) : undefined}
                title={description}
              >
                <span className="point-dot" />
                {!(coincidentLabel && point.distance === 0) && (
                  <span className="point-label">{point.label}</span>
                )}
              </button>
            );
          }),
        )}
        <div className="center-marker" aria-hidden="true">
          {!hasCenterPoint && <span />}
          <i>{coincidentLabel ?? centerLabel}</i>
        </div>
      </div>
      <div className="ball-scale">One ring = one differing coordinate</div>
    </div>
  );
}
