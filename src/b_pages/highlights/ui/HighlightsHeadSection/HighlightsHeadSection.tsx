import { Eyebrow, Shell } from '@shared/ui';

/**
 * 하이라이트 페이지 헤더 — NewsHeadSection(#36) 스타일 미러(media-head 스펙).
 * 이 페이지 전용 정적 문구라 props 없이 자체 완결형으로 둔다.
 */
function HighlightsHeadSection() {
  return (
    <Shell className="pt-10 pb-1">
      <Eyebrow>Video Highlights</Eyebrow>
      <h1 className="mt-1.5 text-[34px] leading-[1.1] font-extrabold tracking-[-0.025em]">
        하이라이트
      </h1>
      <p className="mt-2 max-w-[560px] text-[15px] text-muted-foreground">
        골과 선방, 풀매치까지 — 레드 데빌스의 가장 빛난 순간을 다시 보세요.
      </p>
    </Shell>
  );
}

export { HighlightsHeadSection };
