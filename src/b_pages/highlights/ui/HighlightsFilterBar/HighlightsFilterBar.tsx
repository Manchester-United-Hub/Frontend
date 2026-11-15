'use client';

import { Clock, Eye } from 'lucide-react';

import type { HighlightSortKey } from '@pages/highlights/model';
import { SegmentedControl, type SegmentedControlOption } from '@shared/ui';

/**
 * 정렬 옵션 — 정적 JSX 상수라 컴포넌트 밖(모듈 스코프)에 호이스팅한다(code-conventions §2).
 * 아이콘은 UI 관심사라 model(SORT_OPTIONS 미제공)이 아닌 이 파일에 둔다(AD-3).
 */
const SORT_OPTIONS: readonly SegmentedControlOption<HighlightSortKey>[] = [
  { value: 'LATEST', label: '최신순', icon: <Clock className="h-3.5 w-3.5" aria-hidden="true" /> },
  { value: 'VIEW_COUNT', label: '조회순', icon: <Eye className="h-3.5 w-3.5" aria-hidden="true" /> },
];

export interface HighlightsFilterBarProps {
  sortKey: HighlightSortKey;
  onSortChange: (sortKey: HighlightSortKey) => void;
}

/**
 * 정렬 바 — 우측 정렬 세그먼트(media-bar 스펙).
 * 표현 전용(상태 미소유) — sortKey 상태는 useHighlights가 소유한다.
 */
function HighlightsFilterBar({ sortKey, onSortChange }: HighlightsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 py-4">
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
