import { cn } from '@shared/utils';

import type { Manager } from '../../model/types';

const CAREER_HEADING_ID = 'manager-career-heading';
/** 시안(club.jsx)의 now 항목 상수 — 모델에 필드가 없어 매직 스트링을 상수화한다. */
const CURRENT_CLUB_NAME = '맨체스터 유나이티드';
const CURRENT_CLUB_PERIOD = '2026.01 – 현재';

interface CareerEntry {
  club: string;
  period?: string;
  now: boolean;
}

/** prevClubs를 최신순으로 뒤집고 now 항목을 append — 원본 배열은 변이하지 않는다(toReversed). */
const buildCareerEntries = (prevClubs: string[]): CareerEntry[] => [
  ...prevClubs.toReversed().map((club) => ({ club, now: false })),
  { club: CURRENT_CLUB_NAME, period: CURRENT_CLUB_PERIOD, now: true },
];

export interface ManagerCareerProps {
  manager: Manager;
}

/** 감독 경력 타임라인(mgr-career) — h3 제목 + ol(career-line) 연결선·dot. */
export function ManagerCareer({ manager }: ManagerCareerProps) {
  const entries = buildCareerEntries(manager.prevClubs);

  return (
    <div className="mt-6">
      <h3
        id={CAREER_HEADING_ID}
        className="m-0 mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
      >
        경력 · Career
      </h3>
      <ol aria-labelledby={CAREER_HEADING_ID} className="m-0 grid list-none gap-3 border-l border-border pl-3.5">
        {entries.map((entry) => (
          <li
            key={entry.club}
            className={cn(
              'relative flex flex-wrap items-baseline gap-2 text-sm text-muted-foreground',
              entry.now && 'font-semibold text-foreground'
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute -left-[18px] top-1.5 h-[7px] w-[7px] rounded-full bg-border',
                entry.now && 'bg-united-red'
              )}
            />
            <span>{entry.club}</span>
            {entry.period ? <span className="text-xs font-normal text-muted-foreground">{entry.period}</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
