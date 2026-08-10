import { RefreshCw } from 'lucide-react';

import { Button, FilterSelect } from '@shared/ui';
import type { FilterOption, PlayerFilterCriteria } from '../../model/types';
import { RosterSearchField } from './RosterSearchField';

interface FilterBarSectionProps {
  criteria: PlayerFilterCriteria;
  positionOptions: FilterOption[];
  /** 옵션이 없으면(undefined 또는 빈 배열) 이 셀렉트 자체를 렌더하지 않는다(리뷰 H-3). */
  decadeOptions?: FilterOption[];
  /** 옵션이 없으면(undefined 또는 빈 배열) 이 셀렉트 자체를 렌더하지 않는다(리뷰 H-3). */
  squadOptions?: FilterOption[];
  onPositionChange: (key: string) => void;
  onDecadeChange: (key: string) => void;
  onSquadChange: (key: string) => void;
  onQueryChange: (query: string) => void;
  onRefresh: () => void;
}

/**
 * 필터바 — 포지션 FilterSelect(항상 렌더) + 활약연도·스쿼드 FilterSelect(옵션이 있을 때만
 * 렌더, 리뷰 H-3 — 옵션 0개인 셀렉트는 빈 트리거·빈 팝오버로 "고장난 필터"처럼 보인다) +
 * RosterSearchField(ADR-1) + 새로고침 버튼. 제어형(값 + 핸들러) — 값·옵션·핸들러 전부
 * props로 주입받아 model 훅에 결합하지 않는다(usePlayerListFilters 소비는 PlayerListPage/ST-4 소관).
 * players.css `.filter-bar`: flex-wrap 행 + ≤620px에서 자식 2열(basis 50%-5px)로 축약.
 */
function FilterBarSection({
  criteria,
  positionOptions,
  decadeOptions,
  squadOptions,
  onPositionChange,
  onDecadeChange,
  onSquadChange,
  onQueryChange,
  onRefresh,
}: FilterBarSectionProps) {
  const hasDecadeOptions = Boolean(decadeOptions?.length);
  const hasSquadOptions = Boolean(squadOptions?.length);

  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-5.5 max-[620px]:*:flex-1 max-[620px]:*:basis-[calc(50%-5px)]">
      <FilterSelect
        label="포지션"
        value={criteria.position}
        options={positionOptions}
        onChange={onPositionChange}
      />
      {hasDecadeOptions ? (
        <FilterSelect
          label="활약연도"
          value={criteria.decade}
          options={decadeOptions ?? []}
          onChange={onDecadeChange}
        />
      ) : null}
      {hasSquadOptions ? (
        <FilterSelect
          label="스쿼드"
          value={criteria.squad}
          options={squadOptions ?? []}
          onChange={onSquadChange}
        />
      ) : null}
      <RosterSearchField
        value={criteria.query}
        onChange={onQueryChange}
        className="min-w-50 flex-1"
      />
      <Button variant="outline" onClick={onRefresh} className="self-end">
        <RefreshCw size={16} aria-hidden="true" />
        새로고침
      </Button>
    </div>
  );
}

export { FilterBarSection, type FilterBarSectionProps };
