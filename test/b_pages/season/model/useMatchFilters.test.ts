/**
 * useMatchFilters 훅 단위 테스트.
 *
 * 검증 목적:
 * - useMatchScheduleList()의 data를 deriveMatchStatus → filterMatches로 파생해 groups를 만든다
 * - ha 필터를 바꾸면 groups가 재계산된다
 * - ha 필터 결과가 없으면 groups=[]이고 isEmpty=true가 된다
 * - data가 아직 없어도(로딩 중) groups=[]로 안전하게 동작한다
 * - isLoading/error를 useMatchScheduleList()에서 그대로 패스스루한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useMatchFilters } from '@pages/season/model';
import { useMatchScheduleList } from '@features/matches/api';
import { matches } from './mockData';

vi.mock('@features/matches/api', () => ({
  useMatchScheduleList: vi.fn(),
}));

type MockedQueryResult = Partial<ReturnType<typeof useMatchScheduleList>>;

const mockUseMatchScheduleList = (overrides: MockedQueryResult = {}) => {
  vi.mocked(useMatchScheduleList).mockReturnValue({
    data: matches,
    isLoading: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useMatchScheduleList>);
};

describe('useMatchFilters', () => {
  beforeEach(() => vi.clearAllMocks());

  it('초기값 — ha=all, groups는 전체 일정을 월별로 그룹핑, isEmpty=false', () => {
    mockUseMatchScheduleList();

    const { result } = renderHook(() => useMatchFilters());

    expect(result.current.ha).toBe('all');
    expect(
      result.current.groups.flatMap((g) => g.matches.map((f) => f.id))
    ).toEqual(['f1', 'f2', 'f3', 'f4', 'f5']);
    expect(result.current.isEmpty).toBe(false);
  });

  it('setHa — 필터를 바꾸면 groups가 재계산된다', () => {
    mockUseMatchScheduleList();

    const { result } = renderHook(() => useMatchFilters());
    act(() => result.current.setHa('home'));

    expect(result.current.ha).toBe('home');
    expect(
      result.current.groups.flatMap((g) => g.matches.map((f) => f.id))
    ).toEqual(['f1', 'f3']);
  });

  it('ha 필터 결과가 없으면 groups=[]이고 isEmpty=true가 된다', () => {
    mockUseMatchScheduleList({
      data: matches.filter((match) => match.ha !== 'home'),
    });

    const { result } = renderHook(() => useMatchFilters());
    act(() => result.current.setHa('home'));

    expect(result.current.groups).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });

  it('data가 아직 없으면(로딩 중) groups=[]로 안전하게 처리한다', () => {
    mockUseMatchScheduleList({ data: undefined, isLoading: true });

    const { result } = renderHook(() => useMatchFilters());

    expect(result.current.groups).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.isLoading).toBe(true);
  });

  it('isLoading/error를 useMatchScheduleList()에서 그대로 패스스루한다', () => {
    const error = new Error('경기 일정을 불러오지 못했어요');
    mockUseMatchScheduleList({ data: undefined, error });

    const { result } = renderHook(() => useMatchFilters());

    expect(result.current.error).toBe(error);
    expect(result.current.isLoading).toBe(false);
  });
});
