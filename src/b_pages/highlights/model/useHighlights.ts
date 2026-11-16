'use client';

import { useCallback, useMemo, useState } from 'react';

import { useHighlightList } from '@features/highlight/api';

import { DEFAULT_SORT_KEY } from './configs';
import { toHighlightItem } from './toHighlightItem';
import type { HighlightItem, HighlightSortKey, UseHighlightsResult } from './types';

const FIRST_PAGE = 1;

interface UseHighlightsOptions {
  season: number;
  showFeatured?: boolean;
}

interface SplitFeaturedResult {
  featured: HighlightItem | undefined;
  gridItems: HighlightItem[];
}

// 대표 영상은 현재 정렬의 1페이지 첫 영상이다. 2페이지부터는 응답 전체가 그리드다.
const splitFeatured = (items: HighlightItem[], withFeatured: boolean): SplitFeaturedResult => {
  if (!withFeatured) return { featured: undefined, gridItems: items };

  const [featured, ...gridItems] = items;
  return { featured, gridItems };
};

// 화면 페이지는 1부터, API page는 0부터 센다.
const toApiPage = (page: number): number => page - FIRST_PAGE;

const useHighlights = ({ season, showFeatured = true }: UseHighlightsOptions): UseHighlightsResult => {
  const [sortKey, setSortKey] = useState<HighlightSortKey>(DEFAULT_SORT_KEY);
  const [page, setPage] = useState(FIRST_PAGE);
  const { data, isLoading, isError, refetch } = useHighlightList({
    season,
    sort: sortKey,
    page: toApiPage(page),
  });

  const items = useMemo(() => data?.highlights.map(toHighlightItem) ?? [], [data]);
  const { featured, gridItems } = useMemo(
    () => splitFeatured(items, showFeatured && page === FIRST_PAGE),
    [items, showFeatured, page]
  );

  const changeSort = useCallback((nextSortKey: HighlightSortKey) => {
    setSortKey(nextSortKey);
    setPage(FIRST_PAGE);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    sortKey,
    page,
    isLoading,
    isError,
    refetch: handleRefetch,
    featured,
    pageItems: gridItems,
    totalCount: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    changeSort,
    goToPage,
  };
};

export { useHighlights };
