import { RefreshCw, Search } from 'lucide-react';

import { Button, StateBox } from '@shared/ui';

interface RosterEmptyProps {
  /** "필터 초기화" 버튼 클릭 시 호출 — model.resetFilters를 그대로 연결. */
  onReset: () => void;
}

/** 0건 빈 상태 — StateBox 재사용 + 점선 테두리 래퍼(디자인 .empty-roster). */
function RosterEmpty({ onReset }: RosterEmptyProps) {
  return (
    <div className="rounded-lg border border-dashed border-border">
      <StateBox
        className="py-[72px]"
        variant="empty"
        icon={<Search size={24} aria-hidden="true" />}
        title="조건에 맞는 선수가 없어요"
        description="필터나 검색어를 바꿔 다시 시도해 보세요."
        action={
          <Button variant="outline" onClick={onReset}>
            <RefreshCw size={16} aria-hidden="true" />
            필터 초기화
          </Button>
        }
      />
    </div>
  );
}

export { RosterEmpty, type RosterEmptyProps };
