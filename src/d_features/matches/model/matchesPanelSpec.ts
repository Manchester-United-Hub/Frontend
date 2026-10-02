import type { PanelHeadProps } from '@shared/ui';

/** 일정 탭 패널 헤더 스펙 — MatchesTab(콘텐츠)·MatchesSkeleton(fallback) 단일 출처. */
export function matchesPanelHead(season: string): PanelHeadProps {
  return {
    eyebrow: 'Matches & Results',
    title: '일정 & 결과',
    description: `${season} 시즌 프리미어리그·FA컵·챔피언스리그 일정과 결과를 확인하세요.`,
  };
}

/** 필터 행 래퍼 클래스 — MatchTab·MatchesSkeleton 공용. */
export const FILTER_ROW_CLASS = 'mb-6 flex flex-wrap gap-6';
