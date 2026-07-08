/**
 * useFixtureFilters 훅 단위 테스트 (ST-01, 이슈 #29)
 *
 * 검증 목적:
 * - 초기값(ha/comp='all')에서 groups가 전체 일정을 반영하고 isEmpty=false다
 * - setHa/setComp로 필터를 바꾸면 groups가 재계산된다
 * - 필터 결합 결과가 없으면 groups=[]이고 isEmpty=true가 된다
 */

import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useFixtureFilters } from '@pages/season/model/useFixtureFilters';
import type { Fixture } from '@pages/season/model';

const fixtures: Fixture[] = [
  {
    id: 'f1',
    month: 'M1',
    date: '3/1',
    dow: '토',
    comp: '프리미어리그',
    round: '27R',
    ha: 'home',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', score: 3, utd: true },
    away: { code: 'EVE', nm: '에버턴', score: 0 },
    status: 'past',
    result: 'W',
    venue: '올드 트래포드',
  },
  {
    id: 'f2',
    month: 'M1',
    date: '3/8',
    dow: '토',
    comp: 'FA컵',
    round: '8강',
    ha: 'away',
    home: { code: 'BHA', nm: '브라이턴', score: 1 },
    away: { code: 'MUN', nm: '맨체스터 유나이티드', score: 2, utd: true },
    status: 'past',
    result: 'W',
    venue: '아멕스 스타디움',
  },
  {
    id: 'f3',
    month: 'M2',
    date: '3/29',
    dow: '토',
    comp: '챔피언스리그',
    round: '16강1차',
    ha: 'home',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', score: 1, utd: true },
    away: { code: 'RMA', nm: '레알 마드리드', score: 1 },
    status: 'past',
    result: 'D',
    venue: '올드 트래포드',
  },
];

describe('useFixtureFilters', () => {
  it('초기값 — ha/comp는 all, groups는 전체 일정을 월별로 그룹핑, isEmpty=false', () => {
    const { result } = renderHook(() => useFixtureFilters(fixtures));

    expect(result.current.ha).toBe('all');
    expect(result.current.comp).toBe('all');
    expect(result.current.groups.flatMap((g) => g.fixtures.map((f) => f.id))).toEqual([
      'f1',
      'f2',
      'f3',
    ]);
    expect(result.current.isEmpty).toBe(false);
  });

  it('setHa — 필터를 바꾸면 groups가 재계산된다', () => {
    const { result } = renderHook(() => useFixtureFilters(fixtures));

    act(() => result.current.setHa('home'));

    expect(result.current.ha).toBe('home');
    expect(result.current.groups.flatMap((g) => g.fixtures.map((f) => f.id))).toEqual([
      'f1',
      'f3',
    ]);
    expect(result.current.isEmpty).toBe(false);
  });

  it('setComp — 필터를 바꾸면 groups가 재계산된다', () => {
    const { result } = renderHook(() => useFixtureFilters(fixtures));

    act(() => result.current.setComp('FA컵'));

    expect(result.current.comp).toBe('FA컵');
    expect(result.current.groups.flatMap((g) => g.fixtures.map((f) => f.id))).toEqual(['f2']);
  });

  it('ha/comp 결합 결과가 없으면 groups=[]이고 isEmpty=true가 된다', () => {
    const { result } = renderHook(() => useFixtureFilters(fixtures));

    act(() => {
      result.current.setHa('home');
      result.current.setComp('FA컵');
    });

    expect(result.current.groups).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });
});
