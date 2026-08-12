/**
 * HighlightsComingSoon — /highlights 라우트의 '준비중' 대체 화면 (HL-1, D-27/D-29).
 *
 * 하이라이트 도메인은 실 API가 없다(D-11 발견5). `b_pages/highlights/**`는 추후 API가
 * 생기면 되살릴 자산이라 절대 건드리지 않고(D-27), 이 화면은 app 라우트 로컬(`_components/`,
 * Next.js private-folder 컨벤션)에 완전히 자기 완결적으로 새로 그린다(D-29).
 * `@shared/ui`의 `Shell`+`StateBox`(기본 variant='empty')만 소비한다 — EmptyTab 선례
 * (`b_pages/clubInfo/ui/EmptyTab/EmptyTab.tsx`)와 동일 패턴(D-18).
 */

import { Clapperboard } from 'lucide-react';

import { Shell, StateBox } from '@shared/ui';

const HIGHLIGHTS_COMING_SOON_ICON_SIZE = 22;

function HighlightsComingSoon() {
  return (
    <main>
      <Shell className="pb-16 pt-10">
        <h1 className="text-[34px] leading-[1.1] font-extrabold tracking-[-0.025em]">하이라이트</h1>
        <StateBox
          className="min-h-[460px]"
          headingLevel={2}
          icon={<Clapperboard size={HIGHLIGHTS_COMING_SOON_ICON_SIZE} aria-hidden="true" />}
          title="하이라이트 준비 중이에요"
          description="더 나은 하이라이트를 준비하고 있어요. 곧 만나볼 수 있어요."
        />
      </Shell>
    </main>
  );
}

export { HighlightsComingSoon };
