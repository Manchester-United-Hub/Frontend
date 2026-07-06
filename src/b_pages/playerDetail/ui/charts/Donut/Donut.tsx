/**
 * Donut chart (공격 포인트: 득점/도움) — page-local chart (ADR-2). Ported 1:1
 * from design source player-detail.jsx `Donut`. The design's raw hex
 * `#a1a1aa` (도움 색) is replaced with `var(--muted-foreground)` per ADR-6.
 */

const RADIUS = 52;
const STROKE_WIDTH = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = 134;
const CENTER = 67;

export interface DonutProps {
  goals: number;
  assists: number;
}

export function Donut({ goals, assists }: DonutProps) {
  const total = goals + assists;
  const goalsLength = total ? (CIRCUMFERENCE * goals) / total : 0;
  const assistsLength = total ? (CIRCUMFERENCE * assists) / total : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`공격 포인트 ${total}`}>
        <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth={STROKE_WIDTH} />
          {total > 0 ? (
            <>
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="var(--united-red)"
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${goalsLength} ${CIRCUMFERENCE - goalsLength}`}
              />
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="var(--muted-foreground)"
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${assistsLength} ${CIRCUMFERENCE - assistsLength}`}
                strokeDashoffset={-goalsLength}
              />
            </>
          ) : null}
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
          {total}
        </text>
        <text x={CENTER} y="82" textAnchor="middle" fontSize={11} fill="var(--muted-foreground)" letterSpacing="0.1em">
          공격P
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span aria-hidden className="h-2.5 w-2.5 flex-none rounded-[3px] bg-united-red" />
          득점 {goals}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span aria-hidden className="h-2.5 w-2.5 flex-none rounded-[3px] bg-muted-foreground" />
          도움 {assists}
        </span>
      </div>
    </div>
  );
}
