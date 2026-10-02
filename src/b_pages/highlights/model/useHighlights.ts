'use client';

/**
 * useHighlights — 하이라이트 필터·정렬·페이지네이션 상태 훅 (ST-2, UI 목 전용).
 *
 * 뉴스 useNewsArticles(#36)의 source 주입·로딩 시뮬레이션·언마운트 정리 패턴을 미러한다.
 * 데이터는 source에서 전량 로드한 뒤 카테고리·정렬·페이지네이션을 클라이언트에서 useMemo로
 * 파생한다(AD-2). 최초 로딩은 delayMs 시뮬레이션 후 isLoading=false로 전환한다.
 *
 * showFeatured=true(기본)면 대표 영상 1건을 그리드에서 제외해 별도로 노출한다(AD-6).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getHighlights, HIGHLIGHTS_FETCH_DELAY_MS, PAGE_SIZE } from './mockHighlights';
import { filterByCategory, sortHighlights, splitFeatured } from './selectHighlights';
import type {
  CategoryFilter,
  HighlightItem,
  HighlightSortKey,
  HighlightsSource,
  UseHighlightsResult,
} from './types';

interface UseHighlightsOptions {
  /** 데이터 소스. 기본은 목데이터. 테스트/실 데이터가 주입한다(AD-2). */
  source?: HighlightsSource;
  pageSize?: number;
  /** 최초 로딩 지연(ms). 테스트는 낮춰 결정적으로 만든다. */
  delayMs?: number;
  /** 대표 영상을 그리드에서 제외하고 별도 노출할지(AD-6). 기본 true. */
  showFeatured?: boolean;
}

const useHighlights = ({
  source = getHighlights,
  pageSize = PAGE_SIZE,
  delayMs = HIGHLIGHTS_FETCH_DELAY_MS,
  showFeatured = true,
}: UseHighlightsOptions = {}): UseHighlightsResult => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<CategoryFilter>('전체');
  const [sortKey, setSortKey] = useState<HighlightSortKey>('recent');
  const [page, setPage] = useState(1);

  const runFetch = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setItems(source());
      setIsLoading(false);
    }, delayMs);
  }, [source, delayMs]);

  // runFetch를 ref로 보관해, 최초 로딩 effect가 재구독 없이 최신 함수를 참조하게 한다(code-conventions §3).
  const runFetchRef = useRef(runFetch);
  useEffect(() => {
    runFetchRef.current = runFetch;
  }, [runFetch]);

  // 최초 1회 로딩 — 마운트 시에만 실행한다.
  useEffect(() => {
    runFetchRef.current();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 대표 영상은 카테고리 필터 이전(전체 items 기준)에 한 번만 뽑는다 — 필터링 후에 뽑으면
  // 대표 영상이 현재 카테고리에 없을 때 엉뚱한 항목이 대표로 승격되는 문제가 생긴다.
  const split = useMemo(() => splitFeatured(items), [items]);
  const featured = showFeatured ? split.featured : undefined;
  const baseItems = showFeatured ? split.rest : items;

  const filtered = useMemo(() => filterByCategory(baseItems, category), [baseItems, category]);
  const sorted = useMemo(() => sortHighlights(filtered, sortKey), [filtered, sortKey]);

  const totalCount = sorted.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const pageItems = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize],
  );

  const changeCategory = useCallback((nextCategory: CategoryFilter) => {
    setCategory(nextCategory);
    setPage(1);
  }, []);

  const changeSort = useCallback((nextSortKey: HighlightSortKey) => {
    setSortKey(nextSortKey);
    setPage(1);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  return {
    category,
    sortKey,
    page,
    isLoading,
    featured,
    pageItems,
    totalCount,
    totalPages,
    changeCategory,
    changeSort,
    goToPage,
  };
};

export { useHighlights };
