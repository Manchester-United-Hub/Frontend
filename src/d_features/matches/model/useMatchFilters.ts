'use client';

import { useMemo, useState } from 'react';

import type { HaFilter, Match, MatchMonthGroup } from '@entities/matches/types';
import { filterMatches } from './filterMatches';

const DEFAULT_HA: HaFilter = 'all';

interface UseMatchFiltersResult {
  ha: HaFilter;
  setHa: (value: HaFilter) => void;
  groups: MatchMonthGroup[];
  isEmpty: boolean;
}

// matches는 이제 SchedulePanel(서버 컴포넌트)이 조회해 props로 흘려보낸다.
// 이 훅은 필터·월별 그룹핑만 책임진다 — 로딩·에러 상태는 소유하지 않는다.
const useMatchFilters = (matches: Match[]): UseMatchFiltersResult => {
  const [ha, setHa] = useState<HaFilter>(DEFAULT_HA);

  const groups = useMemo(() => filterMatches(matches, { ha }), [matches, ha]);
  const isEmpty = groups.length === 0;

  return { ha, setHa, groups, isEmpty };
};

export { useMatchFilters, type UseMatchFiltersResult };
