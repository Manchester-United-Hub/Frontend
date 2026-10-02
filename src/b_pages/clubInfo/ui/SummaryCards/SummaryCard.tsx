import { ReactNode } from 'react';

import { BilingualLabel, Card } from '@shared/ui';

/**
 * Single stat card for the club summary grid (창단연도·연고지·홈구장 등).
 * `Card`(padding=md·hover) + `BilingualLabel`(label·en 병기, inline) 조합으로
 * 구성한다 — f_shared 프리미티브 소비(design-system-eng 재사용 감사 반영).
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
