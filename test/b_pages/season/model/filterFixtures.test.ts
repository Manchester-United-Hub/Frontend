/**
 * filterFixtures 단위 테스트 (ST-01, 이슈 #29)
 *
 * 검증 목적:
 * - 홈/원정(ha) 필터가 단독으로 정확히 동작한다
 * - 대회(comp) 필터가 단독으로 정확히 동작한다
 * - 두 필터가 AND로 결합된다
 * - 조건에 맞는 일정이 없으면 빈 배열을 반환한다
 * - 월별 그룹핑이 입력 순서를 보존하며, 그룹당 경기 수가 정확하다
 */

import { describe, it, expect } from 'vitest';

import { filterFixtures } from '@pages/season/model/filterFixtures';
import type { Fixture, FilterFixturesCriteria } from '@pages/season/model';

const buildCriteria = (
  overrides: Partial<FilterFixturesCriteria> = {},
): FilterFixturesCriteria => ({
  ha: 'all',
  comp: 'all',
  ...overrides,
});

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
  {
    id: 'f4',
    month: 'M2',
    date: '4/5',
    dow: '토',
    comp: '프리미어리그',
    round: '30R',
    ha: 'away',
    home: { code: 'NEW', nm: '뉴캐슬', score: 1 },
    away: { code: 'MUN', nm: '맨체스터 유나이티드', score: 2, utd: true },
    status: 'past',
    result: 'W',
    venue: '세인트 제임스 파크',
  },
  {
    id: 'f5',
    month: 'M3',
    date: '5/31',
    dow: '토',
    comp: 'FA컵',
    round: '결승',
    ha: 'neutral',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', utd: true },
    away: { code: 'MCI', nm: '맨체스터 시티' },
    status: 'upcoming',
    time: '01:00 KST',
    venue: '웸블리 스타디움',
  },
];

describe('filterFixtures', () => {
  it('전체(all/all) — 모든 일정을 월별로 그룹핑해 반환한다', () => {
    const groups = filterFixtures(fixtures, buildCriteria());

    expect(groups.map((g) => g.month)).toEqual(['M1', 'M2', 'M3']);
    expect(groups.map((g) => g.fixtures.length)).toEqual([2, 2, 1]);
  });

  it('홈만(ha=home) — 홈 경기만 반환한다', () => {
    const groups = filterFixtures(fixtures, buildCriteria({ ha: 'home' }));

    expect(groups.flatMap((g) => g.fixtures.map((f) => f.id))).toEqual(['f1', 'f3']);
  });

  it('원정만(ha=away) — 원정 경기만 반환한다', () => {
    const groups = filterFixtures(fixtures, buildCriteria({ ha: 'away' }));

    expect(groups.flatMap((g) => g.fixtures.map((f) => f.id))).toEqual(['f2', 'f4']);
  });

  it('대회별(comp=FA컵) — 지정한 대회만 반환한다', () => {
    const groups = filterFixtures(fixtures, buildCriteria({ comp: 'FA컵' }));

    expect(groups.flatMap((g) => g.fixtures.map((f) => f.id))).toEqual(['f2', 'f5']);
  });

  it('복합 필터(ha=home, comp=챔피언스리그) — AND로 결합된다', () => {
    const groups = filterFixtures(fixtures, buildCriteria({ ha: 'home', comp: '챔피언스리그' }));

    expect(groups.flatMap((g) => g.fixtures.map((f) => f.id))).toEqual(['f3']);
  });

  it('조건에 맞는 일정이 없으면 빈 배열을 반환한다', () => {
    const groups = filterFixtures(fixtures, buildCriteria({ ha: 'home', comp: 'FA컵' }));

    expect(groups).toEqual([]);
  });

  it('월그룹 순서·개수 — 입력 순서를 보존하며 그룹당 경기 수가 정확하다', () => {
    const groups = filterFixtures(fixtures, buildCriteria());

    expect(groups).toHaveLength(3);
    expect(groups[0]).toEqual({ month: 'M1', fixtures: [fixtures[0], fixtures[1]] });
    expect(groups[1]).toEqual({ month: 'M2', fixtures: [fixtures[2], fixtures[3]] });
    expect(groups[2]).toEqual({ month: 'M3', fixtures: [fixtures[4]] });
  });

  it('비연속 동월 — 같은 month가 흩어진 비정렬 입력도 하나의 그룹으로 모은다', () => {
    // 실 API(getGameScheduleList)가 정렬을 보장하지 않는 경우를 방어한다.
    const unsorted: Fixture[] = [fixtures[0], fixtures[2], fixtures[1]]; // M1, M2, M1

    const groups = filterFixtures(unsorted, buildCriteria());

    expect(groups.map((g) => g.month)).toEqual(['M1', 'M2']);
    expect(groups[0]).toEqual({ month: 'M1', fixtures: [fixtures[0], fixtures[1]] });
    expect(groups[1]).toEqual({ month: 'M2', fixtures: [fixtures[2]] });
  });
});
