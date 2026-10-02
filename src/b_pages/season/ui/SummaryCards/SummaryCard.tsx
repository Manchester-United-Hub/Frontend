import { ReactNode } from 'react';

import { BilingualLabel, Card } from '@shared/ui';

/**
 * Single stat card for the season summary grid (리그 순위·승점·득실차·전적).
 * clubInfo `ui/SummaryCards/SummaryCard`를 그대로 미러링했다(plan.md).
 */
export interface SummaryCardProps {
  /** Resolved lucide icon element — name→icon mapping happens in the parent (SummaryCards). */
  icon: ReactNode;
  label: string;
  en: string;
  value: string;
  sub: string;
}

export function SummaryCard({ icon, label, en, value, sub }: SummaryCardProps) {
  return (
    <Card padding="md" hover className="flex items-start gap-3">
      <span
        className="grid h-[38px] w-[38px] flex-none place-items-center rounded-md bg-muted text-foreground"
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <BilingualLabel
          kr={label}
          en={en}
          size="sm"
          align="start"
          className="flex-row items-baseline"
          krClassName="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground"
          enClassName="before:mx-1 before:content-['·']"
        />
        <div className="mt-[3px] text-lg font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
          {value}
        </div>
        <div className="mt-[3px] text-xs text-muted-foreground">{sub}</div>
      </div>
    </Card>
  );
}
