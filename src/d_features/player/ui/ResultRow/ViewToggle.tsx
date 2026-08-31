import { LayoutGrid, List } from 'lucide-react';

import { SegmentedControl, type SegmentedControlOption } from '@shared/ui';
import type { RosterView } from '@features/player/model';

interface ViewToggleProps {
  value: RosterView;
  onChange: (value: RosterView) => void;
  className?: string;
}

/** 뷰 토글 전용 아이콘 (모듈 스코프 호이스팅 — code-conventions §2). */
const ICON_CARD = <LayoutGrid size={15} aria-hidden="true" />;
const ICON_LIST = <List size={15} aria-hidden="true" />;

const VIEW_OPTIONS: readonly SegmentedControlOption<RosterView>[] = [
  { value: 'card', label: '카드뷰', icon: ICON_CARD },
  { value: 'list', label: '리스트뷰', icon: ICON_LIST },
];

/**
 * 카드뷰/리스트뷰 전환 (ADR-7·9) — 공통 `SegmentedControl`(ST-1) 소비 어댑터.
 * 세그먼트 트랙 마크업은 신규 작성하지 않고 옵션 매핑만 담당한다.
 */
function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <SegmentedControl
      options={VIEW_OPTIONS}
      value={value}
      onChange={onChange}
      aria-label="보기 전환"
      className={className}
    />
  );
}

export { ViewToggle, type ViewToggleProps };
