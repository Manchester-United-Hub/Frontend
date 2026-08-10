import { AlertTriangle } from 'lucide-react';

import { Button, StateBox } from '@shared/ui';

export interface NewsErrorStateProps {
  /** 재시도 액션. 없으면 재시도 버튼을 렌더하지 않는다. */
  onRetry?: () => void;
}

/** 뉴스 목록 로딩 실패 상태 — StateBox(variant='error') 소비, 재시도 액션은 옵션(landing MatchStripSection ERROR_BOX 선례). */
function NewsErrorState({ onRetry }: NewsErrorStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border">
      <StateBox
        className="py-[72px]"
        variant="error"
        icon={<AlertTriangle size={24} aria-hidden="true" />}
        title="기사를 불러오지 못했어요"
        description="일시적인 연결 문제입니다. 잠시 후 다시 시도해 주세요."
        action={
          onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              다시 시도
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

export { NewsErrorState };
