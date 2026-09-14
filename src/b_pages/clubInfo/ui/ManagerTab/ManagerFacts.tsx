import type { ReactNode } from 'react';
import { Cake, MapPin, CalendarDays, Newspaper, Globe } from 'lucide-react';

import type { Manager } from '../../model/types';
import { FlagSwatch } from './FlagSwatch';

/** dt 아이콘 크기(시안 club.jsx `<Icon size={14} />` 그대로) */
const FACT_ICON_SIZE = 14;

interface FactRow {
  label: string;
  icon: ReactNode;
  value: ReactNode;
}

/** 출생/출생지/부임/계약 기간/국적 — 감독 정보 5행. model.manager를 dl 행으로 변환. */
const buildFactRows = (manager: Manager): FactRow[] => [
  { label: '출생', icon: <Cake size={FACT_ICON_SIZE} aria-hidden="true" />, value: manager.born },
  { label: '출생지', icon: <MapPin size={FACT_ICON_SIZE} aria-hidden="true" />, value: manager.birthplace },
  { label: '부임', icon: <CalendarDays size={FACT_ICON_SIZE} aria-hidden="true" />, value: manager.appointed },
  { label: '계약 기간', icon: <Newspaper size={FACT_ICON_SIZE} aria-hidden="true" />, value: manager.contract },
  {
    label: '국적',
    icon: <Globe size={FACT_ICON_SIZE} aria-hidden="true" />,
    value: (
      <>
        <FlagSwatch code={manager.flag} />
        {manager.nat}
      </>
    ),
  },
];

export interface ManagerFactsProps {
  manager: Manager;
}

/** 감독 정보 그리드(mgr-facts) — dl > div(행) > dt(아이콘+라벨) + dd(값) 5행. */
export function ManagerFacts({ manager }: ManagerFactsProps) {
  const rows = buildFactRows(manager);

  return (
    <dl className="mt-7 border-t border-border">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[120px_1fr] items-baseline gap-4 border-b border-border px-0.5 py-3.5"
        >
          <dt className="m-0 flex items-center gap-[7px] text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            {row.icon}
            {row.label}
          </dt>
          <dd className="m-0 flex items-center gap-2 text-[15px] font-semibold">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
