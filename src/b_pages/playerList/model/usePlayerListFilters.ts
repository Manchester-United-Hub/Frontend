'use client';

/**
 * usePlayerListFilters — 선수 목록 필터/검색/뷰/새로고침 상태 훅 (ADR-6, ADR-8).
 *
 * interfaceContracts.usePlayerListFilters 반환 계약을 그대로 구현한다.
 * results는 filterPlayers(순수함수)를 useMemo로 감싸 렌더 중 파생 계산한다(effect 미사용).
 * refresh는 700ms 로딩 시뮬레이션(REFRESH_DELAY_MS) — 언마운트 시 clearTimeout 필수(ADR-8).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { filterPlayers } from './filterPlayers';
import { REFRESH_DELAY_MS } from './mockData';
import { ALL_FILTER_KEY } from './types';
import type { PlayerListItem, RosterView } from './types';

const DEFAULT_QUERY = '';
const DEFAULT_VIEW: RosterView = 'card';

interface UsePlayerListFiltersResult {
  position: string;
  decade: string;
  squad: string;
  query: string;
  view: RosterView;
  isLoading: boolean;
  results: PlayerListItem[];
  setPosition: (value: string) => void;
  setDecade: (value: string) => void;
  setSquad: (value: string) => void;
  setQuery: (value: string) => void;
  setView: (value: RosterView) => void;
  refresh: () => void;
  resetFilters: () => void;
}

const usePlayerListFilters = (players: PlayerListItem[]): UsePlayerListFiltersResult => {
  const [position, setPosition] = useState(ALL_FILTER_KEY);
  const [decade, setDecade] = useState(ALL_FILTER_KEY);
  const [squad, setSquad] = useState(ALL_FILTER_KEY);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [view, setView] = useState<RosterView>(DEFAULT_VIEW);
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

  const refresh = useCallback(() => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);

    setIsLoading(true);
    refreshTimeoutRef.current = setTimeout(() => setIsLoading(false), REFRESH_DELAY_MS);
  }, []);

  const resetFilters = useCallback(() => {
    setPosition(ALL_FILTER_KEY);
    setDecade(ALL_FILTER_KEY);
    setSquad(ALL_FILTER_KEY);
    setQuery(DEFAULT_QUERY);
  }, []);

  return {
    position,
    decade,
    squad,
    query,
    view,
    isLoading,
    results,
    setPosition,
    setDecade,
    setSquad,
    setQuery,
    setView,
    refresh,
    resetFilters,
  };
};

export { usePlayerListFilters, type UsePlayerListFiltersResult };
