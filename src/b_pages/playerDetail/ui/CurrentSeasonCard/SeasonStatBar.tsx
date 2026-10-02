import type { ReactNode } from 'react';

/**
 * 단일 스탯 바(`.cs-bar`) — 아이콘은 호출부(CurrentSeasonCard)가 lucide-react를
 * 직접 import해 resolved element로 주입한다(SummaryCard 선례와 동일 패턴).
 */
export interface SeasonStatBarProps {
  icon: ReactNode;
  label: string;
  value: number;
  max: number;
  sub?: string;
  color: string;
}

export function SeasonStatBar({ icon, label, value, max, sub, color }: SeasonStatBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className="text-base font-bold tracking-[-0.01em] text-foreground">
          {value}
          {sub ? <small className="ml-1 text-xs font-medium text-muted-foreground">{sub}</small> : null}
        </span>
      </div>
      <div className="h-[9px] overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-in-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
