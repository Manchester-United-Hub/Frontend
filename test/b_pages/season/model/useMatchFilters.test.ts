/**
 * useMatchFilters 훅 단위 테스트 (ST-01, 이슈 #29)
 *
 * 검증 목적:
 * - 초기값(ha/comp='all')에서 groups가 전체 일정을 반영하고 isEmpty=false다
 * - setHa/setComp로 필터를 바꾸면 groups가 재계산된다
 * - 필터 결합 결과가 없으면 groups=[]이고 isEmpty=true가 된다
 */

import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useMatchFilters } from '@pages/season/model';
import { matches } from './mockData';

describe('useMatchFilters', () => {
  it('초기값 — ha/comp는 all, groups는 전체 일정을 월별로 그룹핑, isEmpty=false', () => {
    const { result } = renderHook(() => useMatchFilters(matches));

    expect(result.current.ha).toBe('all');
    expect(result.current.comp).toBe('all');
    expect(
      result.current.groups.flatMap((g) => g.matches.map((f) => f.id))
    ).toEqual(['f1', 'f2', 'f3']);
    expect(result.current.isEmpty).toBe(false);
  });

  it('setHa — 필터를 바꾸면 groups가 재계산된다', () => {
    const { result } = renderHook(() => useMatchFilters(matches));

    act(() => result.current.setHa('home'));

    expect(result.current.ha).toBe('home');
    expect(
      result.current.groups.flatMap((g) => g.matches.map((f) => f.id))
    ).toEqual(['f1', 'f3']);
    expect(result.current.isEmpty).toBe(false);
  });

  it('setComp — 필터를 바꾸면 groups가 재계산된다', () => {
    const { result } = renderHook(() => useMatchFilters(matches));

    act(() => result.current.setComp('FA컵'));

    expect(result.current.comp).toBe('FA컵');
    expect(
      result.current.groups.flatMap((g) => g.matches.map((f) => f.id))
    ).toEqual(['f2']);
  });

  it('ha/comp 결합 결과가 없으면 groups=[]이고 isEmpty=true가 된다', () => {
    const { result } = renderHook(() => useMatchFilters(matches));

    act(() => {
      result.current.setHa('home');
      result.current.setComp('FA컵');
    });

    expect(result.current.groups).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });
});
