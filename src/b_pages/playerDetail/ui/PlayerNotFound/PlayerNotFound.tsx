import { ArrowLeft, TriangleAlert } from 'lucide-react';

import { Button, Shell, StateBox } from '@shared/ui';

const ICON_TRIANGLE_ALERT = <TriangleAlert size={22} aria-hidden="true" />;
const ICON_ARROW_LEFT = <ArrowLeft size={16} aria-hidden="true" />;

/**
 * .empty-roster 대응 — 존재하지 않는 playerId 상태. design_ref
 * player-detail.jsx `NotFound`를 f_shared StateBox + Button으로 치환
 * (신규 빈상태 컴포넌트 작성 금지 — implementation.md §1.5).
 * Nav/Footer는 전역 layout이 렌더하므로 여기서 렌더하지 않는다.
 */
export function PlayerNotFound() {
  return (
    <main>
      <Shell className="py-20">
        <StateBox
          variant="error"
          headingLevel={3}
          icon={ICON_TRIANGLE_ALERT}
          title="선수를 찾을 수 없어요"
          description="주소가 잘못되었거나 삭제된 선수입니다. 목록에서 다시 선택해 주세요."
          action={
            <Button mode="link" togo="/players" variant="red">
              {ICON_ARROW_LEFT}
              선수 목록으로
            </Button>
          }
        />
      </Shell>
    </main>
  );
}
