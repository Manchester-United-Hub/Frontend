'use client';

import { History } from 'lucide-react';

import { Button } from '@shared/ui';

/* ── 뒤로가기 버튼 전용 아이콘 (모듈 스코프 호이스팅) ────────────────── */

const ICON_HISTORY = <History size={18} strokeWidth={1.75} aria-hidden="true" />;
const GO_BACK_LABEL = '이전 페이지';

/**
 * GoBackButton — 브라우저 히스토리를 한 단계 되돌리는 버튼.
 * history.back()은 브라우저 API라 클라이언트 경계가 필요하지만, 그 범위를
 * 이 버튼 하나로 최소화한다(AD-2). 부모 NotFoundPage는 서버 컴포넌트로 유지된다.
 */
export function GoBackButton() {
  function handleGoBack() {
    window.history.back();
  }

  return (
    <Button mode="default" variant="outline" size="lg" onClick={handleGoBack}>
      {ICON_HISTORY}
      {GO_BACK_LABEL}
    </Button>
  );
}
