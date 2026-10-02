/**
 * useMatchFilters 훅 단위 테스트 (ST-05 시그니처 변경 반영 — decision-1.md §5 명시).
 *
 * ST-05로 useMatchScheduleList 의존이 제거되고 훅이 matches: Match[]를 인자로 직접
 * 받는 순수 필터·그룹핑 훅이 됐다. vi.mock(@features/matches/api)는 더 이상 필요 없어
 * 제거했다.
 *
 * 삭제된 케이스: 'isLoading/error를 useMatchScheduleList()에서 그대로 패스스루한다'.
 * 훅 반환 타입에서 isLoading·error가 완전히 사라져(S-7) 이 훅은 더 이상 로딩·에러
 * 상태를 소유하지 않는다 — 검증 대상 자체가 무효화됐다. 로딩 상태는 이제 Suspense
 * fallback(MatchesSkeleton, ST-05)이, 에러 상태는 SchedulePanel의 null 분기(ST-05)가
 * 각각 담당하며 그쪽 검증 범위다.
 *
 * 검증 목적:
 * - matches 인자를 ha='all' 기준으로 월별 그룹핑한다
 * - ha 필터를 바꾸면 groups가 재계산된다
 * - 필터 결과가 없으면 groups=[]이고 isEmpty=true가 된다
 * - matches가 빈 배열이어도 groups=[]로 안전하게 동작한다
 */

import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useMatchFilters } from '@features/matches/model';
import { matches } from '@test/fixtures/matches';

describe('useMatchFilters', () => {
  it('초기값 — ha=all, groups는 전체 일정을 월별로 그룹핑, isEmpty=false', () => {
    const { result } = renderHook(() => useMatchFilters(matches));

    expect(result.current.ha).toBe('all');
    expect(
      result.current.groups.flatMap((g) => g.matches.map((m) => m.id))
    ).toEqual(['f1', 'f2', 'f3', 'f4', 'f5']);
    expect(result.current.isEmpty).toBe(false);
  });

  it('setHa — 필터를 바꾸면 groups가 재계산된다', () => {
    const { result } = renderHook(() => useMatchFilters(matches));
    act(() => result.current.setHa('home'));

    expect(result.current.ha).toBe('home');
    expect(
      result.current.groups.flatMap((g) => g.matches.map((m) => m.id))
    ).toEqual(['f1', 'f3']);
  });

  it('ha 필터 결과가 없으면 groups=[]이고 isEmpty=true가 된다', () => {
    const homeOnly = matches.filter((match) => match.ha !== 'home');
    const { result } = renderHook(() => useMatchFilters(homeOnly));
    act(() => result.current.setHa('home'));

    expect(result.current.groups).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });

  it('matches가 빈 배열이어도 groups=[]로 안전하게 처리한다', () => {
    const { result } = renderHook(() => useMatchFilters([]));

    expect(result.current.groups).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });
});
