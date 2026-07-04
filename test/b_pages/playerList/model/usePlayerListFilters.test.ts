/**
 * usePlayerListFilters 훅 단위 테스트 (ST-2)
 *
 * 검증 목적:
 * - 초기값과 results가 전체 목록을 반영한다
 * - setter로 필터를 바꾸면 results가 재계산된다
 * - refresh는 즉시 isLoading=true가 되고 REFRESH_DELAY_MS 후 false로 돌아온다(ADR-8)
 * - resetFilters는 position/decade/squad/query를 모두 초기화한다
 * - 언마운트 시 pending 타이머가 clearTimeout된다(ADR-8)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { usePlayerListFilters } from '@pages/playerList/model/usePlayerListFilters';
import { REFRESH_DELAY_MS } from '@pages/playerList/model/mockData';
import { ALL_FILTER_KEY } from '@pages/playerList/model/types';
import type { PlayerListItem } from '@pages/playerList/model/types';

const players: PlayerListItem[] = [
  {
    id: 'bruno',
    number: 8,
    name: '브루누 페르난데스',
    nameEn: 'Bruno Fernandes',
    position: 'MF',
    nationality: '포르투갈',
    flagCode: 'pt',
    years: '2020–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'rooney',
    number: 10,
    name: '웨인 루니',
    nameEn: 'Wayne Rooney',
    position: 'FW',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '2004–2017',
    status: 'retired',
    squad: '레전드',
  },
];

describe('usePlayerListFilters', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('초기값 — 필터는 all, query는 빈 문자열, results는 전체 목록', () => {
    const { result } = renderHook(() => usePlayerListFilters(players));

    expect(result.current.position).toBe(ALL_FILTER_KEY);
    expect(result.current.decade).toBe(ALL_FILTER_KEY);
    expect(result.current.squad).toBe(ALL_FILTER_KEY);
    expect(result.current.query).toBe('');
    expect(result.current.view).toBe('card');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.results).toHaveLength(2);
  });

  it('setPosition으로 필터를 바꾸면 results가 재계산된다', () => {
    const { result } = renderHook(() => usePlayerListFilters(players));

    act(() => result.current.setPosition('FW'));

    expect(result.current.position).toBe('FW');
    expect(result.current.results.map((p) => p.id)).toEqual(['rooney']);
  });

  it('refresh — 즉시 isLoading=true, REFRESH_DELAY_MS 후 false로 복귀한다', () => {
    const { result } = renderHook(() => usePlayerListFilters(players));

    act(() => result.current.refresh());
    expect(result.current.isLoading).toBe(true);

    act(() => vi.advanceTimersByTime(REFRESH_DELAY_MS));
    expect(result.current.isLoading).toBe(false);
  });

  it('resetFilters — position/decade/squad/query를 모두 초기화한다', () => {
    const { result } = renderHook(() => usePlayerListFilters(players));

    act(() => {
      result.current.setPosition('FW');
      result.current.setDecade('2000');
      result.current.setSquad('레전드');
      result.current.setQuery('루니');
    });

    act(() => result.current.resetFilters());

    expect(result.current.position).toBe(ALL_FILTER_KEY);
    expect(result.current.decade).toBe(ALL_FILTER_KEY);
    expect(result.current.squad).toBe(ALL_FILTER_KEY);
    expect(result.current.query).toBe('');
  });

  it('언마운트 시 pending 새로고침 타이머를 clearTimeout한다', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { result, unmount } = renderHook(() => usePlayerListFilters(players));

    act(() => result.current.refresh());
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
