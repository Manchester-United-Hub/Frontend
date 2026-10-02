/**
 * model/derive.ts 단위테스트 — 실 API 데이터 기반 재작성(PD-3).
 *
 * 이전 버전(mock PlayerDetail.career/years 기반 deriveSeasonRows/
 * deriveCurrentSeason)은 그 입력 필드 자체가 사라져 전량 교체했다(model/types.ts
 * 참조). 검증 대상:
 * - mapApiPositionToCode: 실측 4종 매핑 + null/미확인 값 → undefined(D-31)
 * - computeAge: 생일 경과 여부에 따른 만 나이 경계값
 * - mapProfileDtoToPlayerDetail: height/weight null 방어(PD-1 보고)
 * - selectSeasonRows/selectSeasonAggregate: 대회별 행 변환 + 합계(D-20/D-21)
 * - selectPrimaryStatistics: PL 우선, 없으면 최다출전(D-21)
 * - buildCurrentSeasonSnapshot: 대표 대회 없음(빈 배열) 시 0 폴백
 * - getAttrLevel: 80/65 경계값(변경 없음, AttributeBarList/HexRadar가 계속 참조)
 */

import { describe, expect, it } from 'vitest';

import {
  buildCurrentSeasonSnapshot,
  computeAge,
  getAttrLevel,
  mapApiPositionToCode,
  mapProfileDtoToPlayerDetail,
  selectPrimaryStatistics,
  selectSeasonAggregate,
  selectSeasonRows,
} from '@pages/playerDetail/model/derive';
import type { PlyaerDTO } from '@entities/player/model';

import { buildStatisticsFixture, FIXTURE_BRUNO_DTO, FIXTURE_NULL_BIO_DTO } from './playerFixtures';

describe('mapApiPositionToCode', () => {
  it.each([
    ['Goalkeeper', 'GK'],
    ['Defender', 'DF'],
    ['Midfielder', 'MF'],
    ['Attacker', 'FW'],
  ])('%s → %s', (apiValue, code) => {
    expect(mapApiPositionToCode(apiValue)).toBe(code);
  });

  it('null이면 undefined를 반환한다', () => {
    expect(mapApiPositionToCode(null)).toBeUndefined();
  });

  it('매핑표에 없는 값(대소문자 변형 포함)은 undefined를 반환한다 — 정규화하지 않는다', () => {
    expect(mapApiPositionToCode('goalkeeper')).toBeUndefined();
    expect(mapApiPositionToCode('Striker')).toBeUndefined();
  });
});

describe('computeAge', () => {
  it('생일이 지난 경우 올해 - 출생연도', () => {
    expect(computeAge('1994-09-08', new Date('2026-08-03'))).toBe(31);
  });

  it('생일이 아직 지나지 않은 경우 -1', () => {
    expect(computeAge('1994-09-08', new Date('2026-08-02'))).toBe(31);
    expect(computeAge('1994-12-25', new Date('2026-08-03'))).toBe(31);
  });

  it('생일 당일은 이미 지난 것으로 취급한다', () => {
    expect(computeAge('1994-08-03', new Date('2026-08-03'))).toBe(32);
  });

  it('birthDate가 null이면 null을 반환한다(ST-001 병합 nullable화, 0·임의값 금지)', () => {
    expect(computeAge(null, new Date('2026-08-03'))).toBeNull();
  });
});

describe('mapProfileDtoToPlayerDetail', () => {
  const baseDto: PlyaerDTO = FIXTURE_BRUNO_DTO;

  it('DTO 필드를 PlayerDetail로 매핑한다', () => {
    const player = mapProfileDtoToPlayerDetail(baseDto, new Date('2026-08-03'));
    expect(player).toEqual({
      id: 1485,
      num: 8,
      nm: 'Bruno Fernandes',
      pos: 'MF',
      nat: 'Portugal',
      dob: '1994-09-08',
      age: 31,
      height: '179',
      weight: '66',
      photo: 'https://example.com/1485.png',
    });
  });

  it('height/weight가 런타임에 null이어도(스키마는 non-null 문자열) 방어적으로 null을 유지한다', () => {
    const dtoWithNullMeasurements = { ...baseDto, height: null, weight: null } as unknown as PlyaerDTO;
    const player = mapProfileDtoToPlayerDetail(dtoWithNullMeasurements, new Date('2026-08-03'));
    expect(player.height).toBeNull();
    expect(player.weight).toBeNull();
  });

  it('number/position이 null이면 num은 null, pos는 undefined', () => {
    // position은 스키마상 non-null 문자열이지만 D-31 실측으로 null 가능성이
    // 확인됐다 — height/weight와 동일하게 방어 대상임을 검증한다.
    const dtoWithNulls = { ...baseDto, number: null, position: null } as unknown as PlyaerDTO;
    const player = mapProfileDtoToPlayerDetail(dtoWithNulls, new Date('2026-08-03'));
    expect(player.num).toBeNull();
    expect(player.pos).toBeUndefined();
  });

  it('birthDate/nationality가 null이면 nat/dob/age를 기본값 없이 null로 통과시킨다(ST-002 인계, 실측 id 570128)', () => {
    const player = mapProfileDtoToPlayerDetail(FIXTURE_NULL_BIO_DTO, new Date('2026-08-03'));
    expect(player.nat).toBeNull();
    expect(player.dob).toBeNull();
    expect(player.age).toBeNull();
  });
});

describe('selectSeasonRows / selectSeasonAggregate', () => {
  const stats = [
    buildStatisticsFixture({ leagueName: 'Premier League', appearances: 30, goals: 8, assists: 6 }),
    buildStatisticsFixture({ leagueId: 45, leagueName: 'FA Cup', appearances: 3, goals: 1, assists: 0 }),
  ];

  it('대회별 통계 배열을 시즌표 행으로 변환한다(대회 1건당 1행)', () => {
    expect(selectSeasonRows(stats)).toEqual([
      { season: 'Premier League', apps: 30, goals: 8, assists: 6 },
      { season: 'FA Cup', apps: 3, goals: 1, assists: 0 },
    ]);
  });

  it('행을 합산해 시즌 합계를 만든다', () => {
    const rows = selectSeasonRows(stats);
    expect(selectSeasonAggregate(rows)).toEqual({ apps: 33, goals: 9, assists: 6 });
  });

  it('빈 배열이면 0 합계를 반환한다', () => {
    expect(selectSeasonAggregate([])).toEqual({ apps: 0, goals: 0, assists: 0 });
  });

  it('H-1(code-review) — 소비하지 않는 필드가 null이어도(GK 162511 실측 패턴) 정상 동작한다', () => {
    // minutes/rating/dribblesAttempts/dribblesSuccess/passesTotal/passesKey/
    // passesAccuracy/duelsTotal/duelsWon/foulsDrawn은 44명 전수 조사에서 null로
    // 관측됐다(스키마 수정 전에는 non-null로 잘못 선언돼 있었음). selectSeasonRows/
    // selectSeasonAggregate는 leagueName/appearances/goals/assists만 읽으므로
    // 이 필드들이 null이어도 영향이 없어야 한다 — fixture가 이제 이 케이스를
    // 실제로 만들 수 있음을 고정한다(수정 전에는 non-null 타입이라 fixture가
    // 이 형태를 아예 표현할 수 없었다).
    const gkStat = buildStatisticsFixture({
      leagueName: 'Premier League',
      appearances: 4,
      goals: 0,
      assists: 0,
      minutes: null,
      rating: null,
      dribblesAttempts: null,
      dribblesSuccess: null,
      passesTotal: null,
      passesKey: null,
      passesAccuracy: null,
      duelsTotal: null,
      duelsWon: null,
      foulsDrawn: null,
      saves: 79,
    });
    const rows = selectSeasonRows([gkStat]);
    expect(rows).toEqual([{ season: 'Premier League', apps: 4, goals: 0, assists: 0 }]);
    expect(selectSeasonAggregate(rows)).toEqual({ apps: 4, goals: 0, assists: 0 });
  });
});

describe('selectPrimaryStatistics', () => {
  it('Premier League가 포함된 행을 우선 선택한다', () => {
    const stats = [
      buildStatisticsFixture({ leagueName: 'FA Cup', appearances: 10 }),
      buildStatisticsFixture({ leagueName: 'Premier League', appearances: 5 }),
    ];
    expect(selectPrimaryStatistics(stats)?.leagueName).toBe('Premier League');
  });

  it('Premier League가 없으면 출전이 가장 많은 행을 선택한다', () => {
    const stats = [
      buildStatisticsFixture({ leagueName: 'Europa League', appearances: 4 }),
      buildStatisticsFixture({ leagueName: 'FA Cup', appearances: 7 }),
    ];
    expect(selectPrimaryStatistics(stats)?.leagueName).toBe('FA Cup');
  });

  it('빈 배열이면 undefined를 반환한다', () => {
    expect(selectPrimaryStatistics([])).toBeUndefined();
  });
});

describe('buildCurrentSeasonSnapshot', () => {
  it('대표 대회 통계로 스냅샷을 만든다', () => {
    const primary = buildStatisticsFixture({ leagueName: 'Premier League', appearances: 30, goals: 8, assists: 6 });
    expect(buildCurrentSeasonSnapshot(primary, 2025)).toEqual({
      szn: '2025/26',
      title: '현재 시즌',
      apps: 30,
      goals: 8,
      assists: 6,
    });
  });

  it('대표 대회가 없으면(빈 통계) 0으로 채운다', () => {
    expect(buildCurrentSeasonSnapshot(undefined, 2025)).toEqual({
      szn: '2025/26',
      title: '현재 시즌',
      apps: 0,
      goals: 0,
      assists: 0,
    });
  });
});

describe('getAttrLevel', () => {
  it('80 이상이면 high', () => {
    expect(getAttrLevel(80)).toBe('high');
    expect(getAttrLevel(100)).toBe('high');
  });

  it('79는 high가 아니라 mid — 80 경계값 하한 확인', () => {
    expect(getAttrLevel(79)).toBe('mid');
  });

  it('65 이상 80 미만이면 mid', () => {
    expect(getAttrLevel(65)).toBe('mid');
    expect(getAttrLevel(79)).toBe('mid');
  });

  it('64는 mid가 아니라 low — 65 경계값 하한 확인', () => {
    expect(getAttrLevel(64)).toBe('low');
  });

  it('65 미만이면 low', () => {
    expect(getAttrLevel(0)).toBe('low');
    expect(getAttrLevel(64)).toBe('low');
  });
});
