'use client';

/**
 * useMatchFilters — 일정 탭의 홈/원정·대회 필터 상태 훅 (ST-01, 이슈 #29).
 *
 * ha/comp를 useState로 소유하고, `filterMatches`(순수함수)를 useMemo로 감싸
 * 렌더 중 파생 계산한다(effect 미사용 — code-conventions.md "effect 없이 렌더
 * 중 파생 상태 계산").
 */

import { useMemo, useState } from 'react';

import { filterMatches } from './filterMatches';
import type { CompFilter, Match, HaFilter } from '@entities/matches/model';
import { MatchMonthGroup } from './types';

const DEFAULT_HA: HaFilter = 'all';
const DEFAULT_COMP: CompFilter = 'all';

interface UseMatchFiltersResult {
  ha: HaFilter;
  comp: CompFilter;
  setHa: (value: HaFilter) => void;
  setComp: (value: CompFilter) => void;
  groups: MatchMonthGroup[];
  isEmpty: boolean;
}

const useMatchFilters = (matches: Match[]): UseMatchFiltersResult => {
  // const matches:Match = use()
  const [ha, setHa] = useState<HaFilter>(DEFAULT_HA);
  const [comp, setComp] = useState<CompFilter>(DEFAULT_COMP);

  const groups = useMemo(
    () => filterMatches(matches, { ha, comp }),
    [matches, ha, comp]
  );
  const isEmpty = groups.length === 0;

  return { ha, comp, setHa, setComp, groups, isEmpty };
};

export { useMatchFilters, type UseMatchFiltersResult };
