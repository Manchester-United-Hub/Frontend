/**
 * selectHighlights — 하이라이트 정렬·필터·조회수 파싱 순수 함수 (ST-1, AD-7).
 *
 * useHighlights(ST-2)는 이 함수들을 useMemo로 조합만 한다 — 순수 로직은 여기 응집.
 * 입력→출력만 있는 순수 함수 — 부수효과 없음. 단위 테스트 대상.
 */

import type { CategoryFilter, HighlightItem, HighlightSortKey } from './types';

/** "2.4M" | "940K" 단위 문자 → 배수. */
const VIEW_COUNT_UNIT_MULTIPLIERS: Record<string, number> = {
  K: 1_000,
  M: 1_000_000,
};

/** "2.4M"→2,400,000 / "940K"→940,000 로 조회수 문자열을 수치화한다. */
export const parseViewCount = (views: string): number => {
  const unit = views.slice(-1).toUpperCase();
  const multiplier = VIEW_COUNT_UNIT_MULTIPLIERS[unit];
  if (!multiplier) return Number(views) || 0;

  return Math.round(parseFloat(views) * multiplier);
};

/** 최신순 비교자 — date 내림차순(문자열 비교, "YYYY.MM.DD"는 사전식=시간순). */
const compareRecent = (a: HighlightItem, b: HighlightItem): number =>
  b.date.localeCompare(a.date);

/** 조회순 비교자 — parseViewCount 내림차순. */
const compareViews = (a: HighlightItem, b: HighlightItem): number =>
  parseViewCount(b.views) - parseViewCount(a.views);

/** sortKey에 따라 정렬한 새 배열을 반환한다(toSorted — 원본 불변). */
export const sortHighlights = (
  items: HighlightItem[],
  sortKey: HighlightSortKey,
): HighlightItem[] => items.toSorted(sortKey === 'recent' ? compareRecent : compareViews);

/** category가 '전체'면 전부, 아니면 일치하는 항목만 반환한다. */
export const filterByCategory = (
  items: HighlightItem[],
  category: CategoryFilter,
): HighlightItem[] =>
  category === '전체' ? items : items.filter((item) => item.category === category);

/** splitFeatured 반환 — 대표 영상(featured)과 그리드용 나머지(rest). */
export interface SplitFeaturedResult {
  featured: HighlightItem | undefined;
  rest: HighlightItem[];
}

/** featured:true 항목을 대표로, 없으면 첫 항목을 대표로 뽑고 그리드에서 제외한다(AD-6). */
export const splitFeatured = (items: HighlightItem[]): SplitFeaturedResult => {
  if (items.length === 0) return { featured: undefined, rest: [] };

  const featured = items.find((item) => item.featured) ?? items[0];
  return { featured, rest: items.filter((item) => item.id !== featured.id) };
};
