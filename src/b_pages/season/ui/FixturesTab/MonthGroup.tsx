import type { FixtureMonthGroup } from '../../model';
import { FixtureRow } from './FixtureRow';

export interface MonthGroupProps {
  group: FixtureMonthGroup;
}

/**
 * MonthGroup — 월별 경기 목록 섹션. design-ref `.fx-month`(13px bold muted 라벨 +
 * flex-1 1px 구분선, margin 26px 0 10px)와 그 아래 경기 목록(`ul role=list`)을 렌더한다.
 */
export function MonthGroup({ group }: MonthGroupProps) {
  return (
    <div>
      <div className="mb-2.5 mt-[26px] flex items-center gap-2.5 text-[13px] font-bold text-muted-foreground first:mt-0">
        {group.month}
        <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
      </div>
      <ul role="list" aria-label={`${group.month} 경기 일정`}>
        {group.fixtures.map((fixture) => (
          <li key={fixture.id}>
            <FixtureRow fixture={fixture} />
          </li>
        ))}
      </ul>
    </div>
  );
}
