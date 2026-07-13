'use client';

/**
 * useFixtureFilters — 일정 탭의 홈/원정·대회 필터 상태 훅 (ST-01, 이슈 #29).
 *
 * ha/comp를 useState로 소유하고, `filterFixtures`(순수함수)를 useMemo로 감싸
 * 렌더 중 파생 계산한다(effect 미사용 — code-conventions.md "effect 없이 렌더
 * 중 파생 상태 계산").
 */

import { useMemo, useState } from 'react';

import { filterFixtures } from './filterFixtures';
import type { CompFilter, Fixture, FixtureMonthGroup, HaFilter } from './types';

const DEFAULT_HA: HaFilter = 'all';
const DEFAULT_COMP: CompFilter = 'all';

interface UseFixtureFiltersResult {
  ha: HaFilter;
  comp: CompFilter;
  setHa: (value: HaFilter) => void;
  setComp: (value: CompFilter) => void;
  groups: FixtureMonthGroup[];
  isEmpty: boolean;
}

const useFixtureFilters = (fixtures: Fixture[]): UseFixtureFiltersResult => {
  const [ha, setHa] = useState<HaFilter>(DEFAULT_HA);
  const [comp, setComp] = useState<CompFilter>(DEFAULT_COMP);

  const groups = useMemo(() => filterFixtures(fixtures, { ha, comp }), [fixtures, ha, comp]);
  const isEmpty = groups.length === 0;

  return { ha, comp, setHa, setComp, groups, isEmpty };
};

export { useFixtureFilters, type UseFixtureFiltersResult };
