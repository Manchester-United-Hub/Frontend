'use client';

import type { ReactNode } from 'react';
import { CalendarX } from 'lucide-react';

import {
  useMatchFilters,
  FILTER_ROW_CLASS,
  matchesPanelHead,
} from '@features/matches/model';
import type { HaFilter, Match } from '@entities/matches/types';
import { MonthGroup } from '@entities/matches/ui';
import { Shell, StateBox, PanelHead, PANEL_SHELL_CLASS } from '@shared/ui';

import { FilterPills } from './MatchPills';

const HA_OPTIONS: { value: HaFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'home', label: '홈' },
  { value: 'away', label: '원정' },
];

const EMPTY_ICON = <CalendarX size={22} aria-hidden="true" />;

interface MatchesTabProps {
  season: string;
  matches: Match[];
}
export function MatchesTab({ season, matches }: MatchesTabProps) {
  const { ha, setHa, groups, isEmpty } = useMatchFilters(matches);

  let body: ReactNode;
  if (isEmpty) {
    body = (
      <StateBox
        className="min-h-80"
        icon={EMPTY_ICON}
        title="조건에 맞는 경기가 없어요"
        description="다른 필터를 선택해보세요."
      />
    );
  } else {
    body = groups.map((group) => (
      <MonthGroup key={group.month} group={group} />
    ));
  }

  return (
    <Shell className={PANEL_SHELL_CLASS}>
      <PanelHead {...matchesPanelHead(season)} />

      <div className={FILTER_ROW_CLASS}>
        <FilterPills
          label="홈/원정"
          options={HA_OPTIONS}
          value={ha}
          onChange={setHa}
        />
      </div>

      {body}
    </Shell>
  );
}
