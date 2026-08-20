import { describe, it, expect } from 'vitest';

import { filterMatches, type FilterMatchesCriteria } from '@features/matches/model';
import { Match } from '@entities/matches/types';
import { matches } from '@test/fixtures/matches';

const buildCriteria = (
  overrides: Partial<FilterMatchesCriteria> = {}
): FilterMatchesCriteria => ({
  ha: 'all',
  ...overrides,
});

describe('filterMatches', () => {
  it('전체(all/all) — 모든 일정을 월별로 그룹핑해 반환한다', () => {
    const groups = filterMatches(matches, buildCriteria());

    expect(groups.map((g) => g.month)).toEqual(['M1', 'M2', 'M3']);
    expect(groups.map((g) => g.matches.length)).toEqual([2, 2, 1]);
  });

  it('홈만(ha=home) — 홈 경기만 반환한다', () => {
    const groups = filterMatches(matches, buildCriteria({ ha: 'home' }));

    expect(groups.flatMap((g) => g.matches.map((f) => f.id))).toEqual([
      'f1',
      'f3',
    ]);
  });

  it('원정만(ha=away) — 원정 경기만 반환한다', () => {
    const groups = filterMatches(matches, buildCriteria({ ha: 'away' }));

    expect(groups.flatMap((g) => g.matches.map((f) => f.id))).toEqual([
      'f2',
      'f4',
    ]);
  });

  it('조건에 맞는 일정이 없으면 빈 배열을 반환한다', () => {
    const groups = filterMatches(
      matches.filter((match) => match.ha !== 'home'),
      buildCriteria({ ha: 'home' })
    );

    expect(groups).toEqual([]);
  });

  it('월그룹 순서·개수 — 입력 순서를 보존하며 그룹당 경기 수가 정확하다', () => {
    const groups = filterMatches(matches, buildCriteria());

    expect(groups).toHaveLength(3);
    expect(groups[0]).toEqual({
      month: 'M1',
      matches: [matches[0], matches[1]],
    });
    expect(groups[1]).toEqual({
      month: 'M2',
      matches: [matches[2], matches[3]],
    });
    expect(groups[2]).toEqual({ month: 'M3', matches: [matches[4]] });
  });

  it('비연속 동월 — 같은 month가 흩어진 비정렬 입력도 하나의 그룹으로 모은다', () => {
    // 실 API(getMatchScheduleList)가 정렬을 보장하지 않는 경우를 방어한다.
    const unsorted: Match[] = [matches[0], matches[2], matches[1]]; // M1, M2, M1

    const groups = filterMatches(unsorted, buildCriteria());

    expect(groups.map((g) => g.month)).toEqual(['M1', 'M2']);
    expect(groups[0]).toEqual({
      month: 'M1',
      matches: [matches[0], matches[1]],
    });
    expect(groups[1]).toEqual({ month: 'M2', matches: [matches[2]] });
  });
});
