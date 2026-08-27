'use client';

/**
 * usePlayerListFilters — 선수 목록 필터/검색/뷰/페이지/새로고침 상태 훅 (ADR-6, ADR-8).
 *
 * interfaceContracts.usePlayerListFilters 반환 계약을 그대로 구현한다.
 * results는 filterPlayers(순수함수)를 useMemo로 감싸 렌더 중 파생 계산한다(effect 미사용).
 * pageResults는 results를 ROSTER_PAGE_SIZE로 자른 현재 페이지 조각이다 — 페이지네이션은
 * 서버가 아니라 여기서 한다(필터·검색이 클라이언트에서 전체 스쿼드를 대상으로 돌기 때문에,
 * 서버 페이징과 섞으면 페이지 밖 선수가 검색·필터에서 누락된다).
 * refresh는 700ms 로딩 시뮬레이션(REFRESH_DELAY_MS) — 언마운트 시 clearTimeout 필수(ADR-8).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { filterPlayers } from './filterPlayers';
import { ALL_FILTER_KEY } from './types';
import type { PlayerListItem, RosterView } from './types';

const DEFAULT_QUERY = '';
const DEFAULT_VIEW: RosterView = 'card';
const FIRST_PAGE = 1;

/** 한 페이지에 노출하는 선수 수 — 시안 `.roster-grid`가 페이지당 12명이다. */
export const ROSTER_PAGE_SIZE = 12;

/**
 * 새로고침 로딩 시뮬레이션 지연(ms) — ADR-8. 이 훅의 유일한 소비처라 여기 co-locate한다
 * (목데이터 이관 작업으로 위치만 옮김, 동작 무변경). 가짜 지연을 react-query `isFetching`
 * 기반으로 대체하는 리팩터링은 후속 과제(issues-draft.md Issue 3, code-review M-2).
 */
export const REFRESH_DELAY_MS = 700;

interface UsePlayerListFiltersResult {
  position: string;
  decade: string;
  squad: string;
  query: string;
  view: RosterView;
  page: number;
  totalPages: number;
  isLoading: boolean;
  /** 필터·검색을 통과한 전체 목록 — 결과 카운트("총 N명")가 소비한다. */
  results: PlayerListItem[];
  /** results 중 현재 페이지 조각 — 그리드·리스트가 소비한다. */
  pageResults: PlayerListItem[];
  setPosition: (value: string) => void;
  setDecade: (value: string) => void;
  setSquad: (value: string) => void;
  setQuery: (value: string) => void;
  setView: (value: RosterView) => void;
  setPage: (value: number) => void;
  refresh: () => void;
  resetFilters: () => void;
}

const usePlayerListFilters = (players: PlayerListItem[]): UsePlayerListFiltersResult => {
  const [position, setPositionState] = useState(ALL_FILTER_KEY);
  const [decade, setDecadeState] = useState(ALL_FILTER_KEY);
  const [squad, setSquadState] = useState(ALL_FILTER_KEY);
  const [query, setQueryState] = useState(DEFAULT_QUERY);
  const [view, setView] = useState<RosterView>(DEFAULT_VIEW);
  const [requestedPage, setPage] = useState(FIRST_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, []);

  const results = useMemo(
    () => filterPlayers(players, { position, decade, squad, query }),
    [players, position, decade, squad, query],
  );

  const totalPages = Math.max(FIRST_PAGE, Math.ceil(results.length / ROSTER_PAGE_SIZE));
  // 재조회로 목록이 줄어 현재 페이지가 사라지면 마지막 페이지로 당긴다 — effect 없이 렌더 중 보정.
  const page = Math.min(requestedPage, totalPages);

  const pageResults = useMemo(
    () => results.slice((page - FIRST_PAGE) * ROSTER_PAGE_SIZE, page * ROSTER_PAGE_SIZE),
    [results, page],
  );

  // 필터·검색이 바뀌면 항상 첫 페이지로 되돌린다(시안 동작) — 3페이지에서 조건을 좁혔을 때
  // 결과 중간부터 보이는 것을 막는다.
  const setPosition = useCallback((value: string) => {
    setPositionState(value);
    setPage(FIRST_PAGE);
  }, []);

  const setDecade = useCallback((value: string) => {
    setDecadeState(value);
    setPage(FIRST_PAGE);
  }, []);

  const setSquad = useCallback((value: string) => {
    setSquadState(value);
    setPage(FIRST_PAGE);
  }, []);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setPage(FIRST_PAGE);
  }, []);

  const refresh = useCallback(() => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);

    setIsLoading(true);
    refreshTimeoutRef.current = setTimeout(() => setIsLoading(false), REFRESH_DELAY_MS);
  }, []);

  const resetFilters = useCallback(() => {
    setPositionState(ALL_FILTER_KEY);
    setDecadeState(ALL_FILTER_KEY);
    setSquadState(ALL_FILTER_KEY);
    setQueryState(DEFAULT_QUERY);
    setPage(FIRST_PAGE);
  }, []);

  return {
    position,
    decade,
    squad,
    query,
    view,
    page,
    totalPages,
    isLoading,
    results,
    pageResults,
    setPosition,
    setDecade,
    setSquad,
    setQuery,
    setView,
    setPage,
    refresh,
    resetFilters,
  };
};

export { usePlayerListFilters, type UsePlayerListFiltersResult };
