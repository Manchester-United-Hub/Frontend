import { AlertTriangle, RefreshCw } from 'lucide-react';

import { Button, StateBox } from '@shared/ui';

interface RosterErrorStateProps {
  /** "다시 시도" 버튼 클릭 시 호출. 미지정 시 액션 버튼을 렌더하지 않는다. */
  onRetry?: () => void;
}

/** 목록 조회 실패 상태 — StateBox(variant='error') 재사용 + 점선 테두리 래퍼(RosterEmpty와 동일 패턴). */
function RosterErrorState({ onRetry }: RosterErrorStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border">
      <StateBox
        className="py-[72px]"
        variant="error"
        icon={<AlertTriangle size={24} aria-hidden="true" />}
        title="선수 목록을 불러오지 못했어요"
        description="잠시 후 다시 시도해 주세요."
        action={
          onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw size={16} aria-hidden="true" />
              다시 시도
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

export { RosterErrorState, type RosterErrorStateProps };
