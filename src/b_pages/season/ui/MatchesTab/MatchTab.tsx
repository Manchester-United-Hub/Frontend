'use client';

import { CalendarX } from 'lucide-react';

import { Shell, StateBox } from '@shared/ui';

import {
  matches,
  useMatchFilters,
  type CompFilter,
  type HaFilter,
} from '../../model';
import { PanelHead } from '../PanelHead';
import { FilterPills } from './MatchPills';
import { MonthGroup } from './MonthGroup';

// ── 필터 옵션 (모듈 스코프 — design-ref "필터 옵션") ──────────────────────

const HA_OPTIONS: { value: HaFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'home', label: '홈' },
  { value: 'away', label: '원정' },
];

const COMP_OPTIONS: { value: CompFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: '프리미어리그', label: '프리미어리그' },
  { value: 'FA컵', label: 'FA컵' },
  { value: '챔피언스리그', label: '챔피언스리그' },
];

const PANEL_DESCRIPTION =
  '2025/26 시즌 프리미어리그·FA컵·챔피언스리그 일정과 결과를 확인하세요.';
const EMPTY_ICON = <CalendarX size={22} aria-hidden="true" />;

/**
 * MatchesTab — 일정 & 결과 탭. `useMatchFilters`(ST-01)로 홈/원정·대회 필터
 * 상태와 월별 그룹을 얻어, 빈 결과면 `StateBox`(빈상태), 아니면 `MonthGroup` 목록을
 * 렌더한다. 필터 상태를 이 컴포넌트가 소유(hook 호출)하므로 'use client'.
 */
export function MatchesTab() {
  const { ha, comp, setHa, setComp, groups, isEmpty } =
    useMatchFilters(matches);

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
        <FilterPills
          label="대회"
          options={COMP_OPTIONS}
          value={comp}
          onChange={setComp}
        />
      </div>

      {isEmpty ? (
        <StateBox
          className="min-h-80"
          icon={EMPTY_ICON}
          title="조건에 맞는 경기가 없어요"
          description="다른 필터를 선택해보세요."
        />
      ) : (
        groups.map((group) => <MonthGroup key={group.month} group={group} />)
      )}
    </Shell>
  );
}
