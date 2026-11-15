import { AlertTriangle } from 'lucide-react';

import { Button, StateBox } from '@shared/ui';

interface HighlightsErrorStateProps {
  onRetry: () => void;
}

function HighlightsErrorState({ onRetry }: HighlightsErrorStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border">
      <StateBox
        className="py-[72px]"
        variant="error"
        icon={<AlertTriangle size={24} aria-hidden="true" />}
        title="하이라이트를 불러오지 못했어요"
        description="일시적인 연결 문제입니다. 잠시 후 다시 시도해 주세요."
        action={
          <Button variant="outline" onClick={onRetry}>
            다시 시도
          </Button>
        }
      />
    </div>
  );
}

export { HighlightsErrorState };
export type { HighlightsErrorStateProps };
