import { Eyebrow, Shell } from '@shared/ui';

/**
 * 뉴스 기사 페이지 헤더 — media.css `.media-head` 스펙을 Tailwind 토큰 유틸로 재현.
 * 이 페이지 전용 정적 문구라 props 없이 자체 완결형으로 둔다.
 * 디자인 소스가 별도 `.mu-shell`로 감싼 헤더이므로 이 섹션이 Shell을 직접 소유한다.
 */
function NewsHeadSection() {
  return (
    <Shell className="pt-10 pb-1">
      <Eyebrow>News</Eyebrow>
      <h1 className="mt-1.5 text-[34px] leading-[1.1] font-extrabold tracking-tight">
        기사
      </h1>
      <p className="mt-2 max-w-140 text-[15px] text-muted-foreground">
        맨유의 최신 소식을 한번에 - 최신 맨유 뉴스.
      </p>
    </Shell>
  );
}

export { NewsHeadSection };
