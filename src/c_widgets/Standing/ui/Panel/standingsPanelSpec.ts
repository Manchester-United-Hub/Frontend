import type { PanelHeadProps } from '@shared/ui';

/** 순위 탭 패널 헤더 스펙 — StandingsTab(콘텐츠)·StandingSkeleton(fallback) 단일 출처. */
export function standingsPanelHead(season: string): PanelHeadProps {
  return {
    eyebrow: 'League Table',
    title: '순위표',
    description: `${season} 시즌 프리미어리그 20개 클럽의 순위와 최근 5경기 폼을 확인하세요.`,
  };
}
