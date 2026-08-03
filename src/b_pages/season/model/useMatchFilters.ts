'use client';

import { useMemo, useState } from 'react';

import { filterMatches } from './filterMatches';
import type { HaFilter } from '@entities/matches/model';
import { MatchMonthGroup } from './types';
import { useMatchScheduleList } from '@features/matches/api';

const DEFAULT_HA: HaFilter = 'all';

interface UseMatchFiltersResult {
  ha: HaFilter;
  setHa: (value: HaFilter) => void;
  groups: MatchMonthGroup[];
  isEmpty: boolean;
  isLoading: boolean;
  error: Error | null;
}

const useMatchFilters = (): UseMatchFiltersResult => {
  const { data, isLoading, error } = useMatchScheduleList();
  const [ha, setHa] = useState<HaFilter>(DEFAULT_HA);

  const groups = useMemo(() => filterMatches(data ?? [], { ha }), [data, ha]);
  const isEmpty = groups.length === 0;

  return { ha, setHa, groups, isEmpty, isLoading, error };
};

export { useMatchFilters, type UseMatchFiltersResult };
