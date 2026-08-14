'use client';

/**
 * useNewsFeed — 뉴스 커서 피드 상태 훅 (#36 → NW-3/D-9, react-query 어댑터로 교체).
 *
 * 기존에는 setTimeout 기반 동기 mock 상태머신(newsFeed.ts, 현재 test/b_pages/news/model/로
 * 이관된 테스트 fixture)이었으나, 이제 d_features/news의
 * useNewsInfiniteList(react-query useInfiniteQuery)를 감싸는 얇은 어댑터다(AD-5).
 * 캐싱·재시도·중복요청 방지는 react-query에 위임하고, 훅 이름과 UseNewsFeedResult 반환
 * 계약(+isError)만 그대로 유지해 NewsPage.tsx·하위 UI 컴포넌트의 diff를 최소화한다.
 */

import { useCallback, useMemo } from 'react';

import { useNewsInfiniteList } from '@features/news/api';

import type { NewsItem, UseNewsFeedResult } from './types';

interface UseNewsFeedOptions {
  pageSize?: number;
}

const useNewsFeed = ({
  pageSize,
}: UseNewsFeedOptions = {}): UseNewsFeedResult => {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useNewsInfiniteList(pageSize);

  // M-2(review-NW.md): 렌더마다 새 배열·새 함수가 생기면 기존 useCallback 최적화가 소실된다.
  // data가 바뀔 때만 newsItems를 재계산하고, 핸들러는 안정된 identity로 노출한다.
  const newsItems: NewsItem[] = useMemo(
    () => data?.pages.flatMap((page) => page.newsList) ?? [],
    [data]
  );
  const handleFetchNextPage = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);
  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    newsItems,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: handleFetchNextPage,
    refetch: handleRefetch,
  };
};

export { useNewsFeed };
