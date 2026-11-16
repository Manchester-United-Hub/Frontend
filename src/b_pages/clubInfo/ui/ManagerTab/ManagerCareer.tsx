import { cn } from '@shared/utils';

import type { Manager } from '../../model/types';

const CAREER_HEADING_ID = 'manager-career-heading';

export interface ManagerCareerProps {
  manager: Manager;
}

/** 감독 경력 타임라인(mgr-career) — h3 제목 + ol(career-line) 연결선·dot. careers는 최신순. */
export function ManagerCareer({ manager }: ManagerCareerProps) {
  return (
    <div className="mt-6">
      <h3
        id={CAREER_HEADING_ID}
        className="m-0 mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
      >
        경력 · Career
      </h3>
      <ol aria-labelledby={CAREER_HEADING_ID} className="m-0 grid list-none gap-3 border-l border-border pl-3.5">
        {manager.careers.map((entry) => (
          <li
            key={`${entry.team}-${entry.period}`}
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
            <span>{entry.team}</span>
            <span className="text-xs font-normal text-muted-foreground">{entry.period}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
