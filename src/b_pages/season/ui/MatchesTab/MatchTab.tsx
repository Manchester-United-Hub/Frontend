'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, CalendarX } from 'lucide-react';

import type { HaFilter } from '@entities/matches/model';
import { Shell, StateBox } from '@shared/ui';

import { useMatchFilters } from '../../model';
import { PanelHead } from '../PanelHead';
import { FilterPills } from './MatchPills';
import { MatchesSkeleton } from './MatchesSkeleton';
import { MonthGroup } from './MonthGroup';

// ── 필터 옵션 (모듈 스코프 — design-ref "필터 옵션") ──────────────────────

const HA_OPTIONS: { value: HaFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'home', label: '홈' },
  { value: 'away', label: '원정' },
];

const PANEL_DESCRIPTION =
  '2025/26 시즌 프리미어리그·FA컵·챔피언스리그 일정과 결과를 확인하세요.';
const EMPTY_ICON = <CalendarX size={22} aria-hidden="true" />;
const ERROR_ICON = <AlertTriangle size={22} aria-hidden="true" />;

export function MatchesTab() {
  const { ha, setHa, groups, isEmpty, isLoading, error } = useMatchFilters();

  // 4갈래 분기를 위→아래로 읽히게 if/else로 표현한다(중첩 삼항 대신 — T-4).
  let body: ReactNode;
  if (isLoading) {
    body = <MatchesSkeleton />;
  } else if (error) {
    body = (
      <StateBox
        className="min-h-80"
        variant="error"
        icon={ERROR_ICON}
        title="경기 일정을 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
      />
    );
  } else if (isEmpty) {
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
    <Shell className="pb-16 pt-10">
      <PanelHead
        eyebrow="Matches & Results"
        title="일정 & 결과"
        description={PANEL_DESCRIPTION}
      />

      <div className="mb-6 flex flex-wrap gap-6">
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
