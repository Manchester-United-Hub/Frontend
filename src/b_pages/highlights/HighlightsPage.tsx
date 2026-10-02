'use client';

/**
 * HighlightsPage — 하이라이트 페이지 조립 (ST-6).
 *
 * useHighlights의 상태를 헤드 섹션/콘텐츠 섹션에 흘려보내는 얇은 조립 컴포넌트.
 * 로직은 model, 마크업은 ui 섹션에 있으므로 이 파일은 배선만 담당한다(NewsArticlePage 미러).
 * Nav/Footer는 루트 레이아웃이 전역으로 공급하므로 여기서 렌더하지 않는다(AD-1).
 *
 * 이 브랜치는 목데이터 UI다. source/pageSize/fetchDelayMs/showFeatured props는 훅으로 전달되며,
 * 테스트는 match를 주입하고, 추후 실 데이터 브랜치는 source를 실 훅으로 교체한다(AD-2).
 */

import { Shell } from '@shared/ui';

import { useHighlights } from './model';
import type { HighlightsSource } from './model';
import { HighlightsContent, HighlightsHeadSection } from './ui';

interface HighlightsPageProps {
  source?: HighlightsSource;
  pageSize?: number;
  fetchDelayMs?: number;
  /** 대표 영상 노출 여부(AD-6). 기본 true. */
  showFeatured?: boolean;
}

function HighlightsPage({
  source,
  pageSize,
  fetchDelayMs,
  showFeatured = true,
}: HighlightsPageProps = {}) {
  const highlights = useHighlights({
    source,
    pageSize,
    delayMs: fetchDelayMs,
    showFeatured,
  });

  return (
    <main>
      <HighlightsHeadSection />
      <Shell className="pt-6 pb-12">
        <HighlightsContent {...highlights} showFeatured={showFeatured} />
      </Shell>
    </main>
  );
}

export { HighlightsPage, type HighlightsPageProps };
