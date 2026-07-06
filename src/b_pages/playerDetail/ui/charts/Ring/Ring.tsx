/**
 * Ring chart (단일 값 진행률 — 예: GK 출전) — page-local chart (ADR-2). Ported
 * 1:1 from design source player-detail.jsx `Ring`. Domain-agnostic generic
 * props (value/max/label) so any single-metric progress can reuse it.
 */

const RADIUS = 52;
const STROKE_WIDTH = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = 134;
const CENTER = 67;

export interface RingProps {
  value: number;
  max: number;
  label: string;
}

export function Ring({ value, max, label }: RingProps) {
  const length = CIRCUMFERENCE * Math.min(1, value / max);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`${label} ${value}`}>
        <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth={STROKE_WIDTH} />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
            strokeLinecap="round"
          />
        </g>
        <text
          x={CENTER}
          y="62"
          textAnchor="middle"
          fontSize={32}
          fontWeight={800}
          fill="var(--foreground)"
          letterSpacing="-0.02em"
        >
          {value}
        </text>
        <text x={CENTER} y="82" textAnchor="middle" fontSize={11} fill="var(--muted-foreground)" letterSpacing="0.1em">
          {label}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span aria-hidden className="h-2.5 w-2.5 flex-none rounded-[3px] bg-foreground" />
          {label} {value} / {max}
        </span>
      </div>
    </div>
  );
}
