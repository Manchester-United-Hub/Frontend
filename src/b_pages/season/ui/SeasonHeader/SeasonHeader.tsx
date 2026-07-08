import { Eyebrow, Shell } from '@shared/ui';

const SEASON_HEADER_HEADING_ID = 'season-header-heading';

/**
 * SeasonHeader — 시즌 페이지 히어로(단순형). clubInfo `ClubHeader`(사진 배경·CTA)와
 * 달리 design-ref `.season-head`는 배경 사진·액션 없이 eyebrow+h1+설명만 갖는 정적
 * 헤더라, ClubHeader의 사진/스크림/워터마크 마크업은 가져오지 않고 PanelHead와
 * 유사한 단순 텍스트 블록으로 구현했다(시안 그대로 — 임의 확장 없음).
 */
export function SeasonHeader() {
  return (
    <section aria-labelledby={SEASON_HEADER_HEADING_ID} className="border-b border-border">
      <Shell className="pb-8 pt-12">
        <Eyebrow>2025/26 Premier League</Eyebrow>
        <h1
          id={SEASON_HEADER_HEADING_ID}
          className="mt-2 text-[34px] font-extrabold leading-[1.1] tracking-[-0.025em] text-foreground max-[620px]:text-[28px]"
        >
          시즌
        </h1>
        <p className="mt-2 max-w-[620px] text-[15px] text-muted-foreground">
          일정과 결과, 프리미어리그 순위표를 한곳에서 확인하세요.
        </p>
      </Shell>
    </section>
  );
}
