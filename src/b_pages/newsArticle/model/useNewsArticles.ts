'use client';

/**
 * useNewsArticles — 뉴스 기사 커서 피드 상태 훅 (#36, UI 목 전용).
 *
 * 최초 로딩(isLoading) → 결과 그리드 → '더 보기'(isFetchingNextPage) 상태를 관리한다.
 * 데이터는 목 소스(getNewsPage)에서 오지만, 반환 계약·커서 흐름은 실제 API와 동일하므로
 * 추후 다른 브랜치에서 source만 실 데이터 훅으로 교체하면 된다.
 *
 * 로딩 지연(delayMs)은 스켈레톤·'더 보기' UI를 실제처럼 보이게 하는 시뮬레이션이다.
 * 언마운트 시 clearTimeout으로 setState 누수를 막는다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { getNewsPage, makeInitialNewsQuery, NEWS_PAGE_SIZE, NO_MORE_CURSOR_ID } from './mockNews';
import type { ArticleItem, NewsPageSource, NewsQuery, UseNewsArticlesResult } from './types';

/** 목 로딩 지연(ms). 테스트는 delayMs를 낮춰 결정적으로 만든다. */
export const NEWS_FETCH_DELAY_MS = 400;

interface UseNewsArticlesOptions {
  /** 페이지 소스. 기본은 목데이터. 테스트/실 데이터가 주입한다. */
  source?: NewsPageSource;
  pageSize?: number;
  delayMs?: number;
}

const useNewsArticles = ({
  source = getNewsPage,
  pageSize = NEWS_PAGE_SIZE,
  delayMs = NEWS_FETCH_DELAY_MS,
}: UseNewsArticlesOptions = {}): UseNewsArticlesResult => {
  const cursorRef = useRef<NewsQuery>(makeInitialNewsQuery(pageSize));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const runFetch = useCallback(
    (mode: 'initial' | 'next') => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (mode === 'initial') setIsLoading(true);
      else setIsFetchingNextPage(true);

      timeoutRef.current = setTimeout(() => {
        const page = source(cursorRef.current);
        cursorRef.current = {
          cursorAt: page.nextCursorAt,
          cursorId: page.nextCursorId,
          size: cursorRef.current.size,
        };
        setHasNextPage(page.nextCursorId !== NO_MORE_CURSOR_ID);
        setArticles((prev) => (mode === 'initial' ? page.newsList : [...prev, ...page.newsList]));
        if (mode === 'initial') setIsLoading(false);
        else setIsFetchingNextPage(false);
      }, delayMs);
    },
    [source, delayMs],
  );

  // runFetch를 ref로 보관해, 최초 로딩 effect가 재구독 없이 최신 함수를 참조하게 한다(code-conventions §3).
  const runFetchRef = useRef(runFetch);
  useEffect(() => {
    runFetchRef.current = runFetch;
  }, [runFetch]);

  // 최초 1회 로딩 — 마운트 시에만 실행한다.
  useEffect(() => {
    runFetchRef.current('initial');
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const fetchNextPage = useCallback(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;
    runFetch('next');
  }, [isLoading, isFetchingNextPage, hasNextPage, runFetch]);

  return { articles, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage };
};

export { useNewsArticles };
