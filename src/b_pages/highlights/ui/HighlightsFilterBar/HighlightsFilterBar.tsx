'use client';

import { Clock, Eye } from 'lucide-react';

import type { HighlightSortKey } from '@pages/highlights/model';
import { SegmentedControl, type SegmentedControlOption } from '@shared/ui';
import type { CategoryFilter } from '@pages/highlights/model';

import { CategoryPills } from './CategoryPills';

/**
 * 정렬 옵션 — 정적 JSX 상수라 컴포넌트 밖(모듈 스코프)에 호이스팅한다(code-conventions §2).
 * 아이콘은 UI 관심사라 model(SORT_OPTIONS 미제공)이 아닌 이 파일에 둔다(AD-3).
 */
const SORT_OPTIONS: readonly SegmentedControlOption<HighlightSortKey>[] = [
  { value: 'recent', label: '최신순', icon: <Clock className="h-3.5 w-3.5" aria-hidden="true" /> },
  { value: 'views', label: '조회순', icon: <Eye className="h-3.5 w-3.5" aria-hidden="true" /> },
];

export interface HighlightsFilterBarProps {
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  sortKey: HighlightSortKey;
  onSortChange: (sortKey: HighlightSortKey) => void;
}

/**
 * 필터 바 — 좌 카테고리 pills + 우 정렬 세그먼트(media-bar 스펙).
 * 표현 전용(상태 미소유) — category/sortKey 상태는 useHighlights(ST-6에서 배선)가 소유한다.
 */
function HighlightsFilterBar({
  category,
  onCategoryChange,
  sortKey,
  onSortChange,
}: HighlightsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <CategoryPills value={category} onChange={onCategoryChange} />
      <SegmentedControl
        options={SORT_OPTIONS}
        value={sortKey}
        onChange={onSortChange}
        aria-label="정렬 방식"
      />
    </div>
  );
}

export { HighlightsFilterBar };
