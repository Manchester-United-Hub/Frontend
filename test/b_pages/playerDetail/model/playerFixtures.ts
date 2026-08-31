/**
 * Manchester United Hub — player detail page test fixtures.
 *
 * 테스트 전용 데이터 — 사용자 지시로 `src/b_pages/playerDetail/model/mockData.ts`에서
 * 이 파일로 이관했다(테스트에서만 쓰는 목데이터는 `test/` 아래에서 관리, D-10 갱신).
 * production 코드는 이 파일을 참조하지 않는다(원래도 `PlayerDetailPage.tsx`는
 * import한 적이 없다 — `model/index.ts` 배럴 re-export만 있었고 실제 소비처는
 * 전부 테스트였다). 파일명을 `mockData`가 아니라 `playerFixtures`로 바꿔
 * 내용(전부 `FIXTURE_*`/fixture 빌더)이 fixture임을 드러낸다.
 *
 * `PlayerDetail`/`LeagueStatisticsDTO`는 production 타입이라 그대로 `src`
 * 쪽 별칭(`@pages`/`@entities`)에서 가져온다 — 타입 자체를 옮기지 않는다.
 *
 * `LeagueStatisticsDTO` fixture는 derive.ts의 selectSeasonRows/
 * selectSeasonAggregate/selectPrimaryStatistics 테스트용이다.
 */

import type { LeagueStatisticsDTO, PlyaerDTO } from '@entities/player/model';
import type { PlayerDetail } from '@pages/playerDetail/model';

// ───────── PlyaerDTO fixtures (API 응답 계약, ST-004) ─────────
// dev 병합(ST-001)으로 `seasons: number[]`가 필수화되고 birthDate·nationality
// 등 6필드가 nullable화됐다 — 아래 값은 GET /api/players(/{id})? 실측 그대로다.

/** 표준 필드 플레이어 DTO — GET /api/players/1485 실측(2026-08-31) 기반. */
export const FIXTURE_BRUNO_DTO: PlyaerDTO = {
  id: 1485,
  name: 'Bruno Fernandes',
  birthDate: '1994-09-08',
  nationality: 'Portugal',
  height: '179',
  weight: '66',
  number: 8,
  position: 'Midfielder',
  photo: 'https://example.com/1485.png',
  seasons: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
};

/**
 * GK DTO — CurrentSeasonCard Ring 분기 fixture. id 24309는 기존 테스트가 계속
 * 참조해온 값을 그대로 유지한다(실제 백엔드에는 이 id가 없음 — 404 확인됨).
 * `seasons`만은 실제 Onana(GET /api/players/526) 실측값을 대입했다.
 */
export const FIXTURE_ONANA_DTO: PlyaerDTO = {
  id: 24309,
  name: 'André Onana',
  birthDate: '1996-04-02',
  nationality: 'Cameroon',
  height: '190',
  weight: '92',
  number: 24,
  position: 'Goalkeeper',
  photo: 'https://example.com/24309.png',
  seasons: [2023, 2024, 2025],
};

/**
 * birthDate·nationality가 null인 경계 케이스 — GET /api/players?season=2025
 * 실측(id 570128, J. Thwaites) 그대로다. ST-002가 표현 계층에서 흡수하는
 * nullable 6필드 중 birthDate·nationality의 null 회귀 가드용.
 */
export const FIXTURE_NULL_BIO_DTO: PlyaerDTO = {
  id: 570128,
  name: 'J. Thwaites',
  birthDate: null,
  nationality: null,
  height: null,
  weight: null,
  number: 77,
  position: 'Midfielder',
  photo: 'https://example.com/570128.png',
  seasons: [2025],
};

// ───────── PlayerDetail fixtures ─────────

/** 표준 필드 플레이어 — bio 필드 전부 채워진 기본 케이스(GET /api/players/1485 실측 기반). */
export const FIXTURE_BRUNO: PlayerDetail = {
  id: 1485,
  num: 8,
  nm: 'Bruno Fernandes',
  pos: 'MF',
  nat: 'Portugal',
  dob: '1994-09-08',
  age: 31,
  height: '179',
  weight: '66',
  photo: 'https://media.api-sports.io/football/players/1485.png',
};

/** GK — CurrentSeasonCard의 Ring 분기(isGoalkeeper) 검증용. */
export const FIXTURE_ONANA: PlayerDetail = {
  id: 24309,
  num: 24,
  nm: 'André Onana',
  pos: 'GK',
  nat: 'Cameroon',
  dob: '1996-04-02',
  age: 30,
  height: '190',
  weight: '92',
  photo: 'https://media.api-sports.io/football/players/24309.png',
};

/** num/pos/height/weight 전부 null·미매핑 — D-31·PD-1이 보고한 결측 케이스. */
export const FIXTURE_UNKNOWN_FIELDS: PlayerDetail = {
  id: 284324,
  num: null,
  nm: 'A. Garnacho',
  pos: undefined,
  nat: 'Argentina',
  dob: '2004-07-01',
  age: 21,
  height: null,
  weight: null,
  photo: 'https://media.api-sports.io/football/players/284324.png',
};

/**
 * 국적·생년월일(nat/dob/age)이 null인 선수 — ST-002가 표현 계층에서 흡수하는
 * nullable 전파의 회귀 가드용. height/weight/pos/num은 의도적으로 채워
 * FIXTURE_UNKNOWN_FIELDS(그쪽이 이미 커버)와 검증 대상을 분리한다.
 */
export const FIXTURE_NULL_BIO: PlayerDetail = {
  id: 570128,
  num: 77,
  nm: 'J. Thwaites',
  pos: 'MF',
  nat: null,
  dob: null,
  age: null,
  height: '180',
  weight: '75',
  photo: 'https://example.com/570128.png',
};

// ───────── LeagueStatisticsDTO fixtures ─────────

const STAT_DEFAULTS: LeagueStatisticsDTO = {
  leagueId: 39,
  leagueName: 'Premier League',
  appearances: 0,
  lineups: 0,
  minutes: 0,
  rating: '0.0',
  captain: false,
  substitutesIn: 0,
  substitutesOut: 0,
  substitutesBench: 0,
  shotsTotal: null,
  shotsOn: null,
  goals: 0,
  assists: 0,
  dribblesAttempts: 0,
  dribblesSuccess: 0,
  dribblesPast: null,
  penaltiesWon: null,
  penaltiesScored: 0,
  penaltiesMissed: 0,
  passesTotal: 0,
  passesKey: 0,
  passesAccuracy: '0',
  tacklesTotal: null,
  tacklesBlocks: null,
  tacklesInterceptions: null,
  duelsTotal: 0,
  duelsWon: 0,
  foulsDrawn: 0,
  foulsCommitted: null,
  goalsConceded: 0,
  saves: null,
  penaltiesSaved: null,
  yellowCards: 0,
  yellowRedCards: 0,
  redCards: 0,
};

/** 기본값 위에 필요한 필드만 덮어써 통계 fixture를 만드는 테스트 헬퍼. */
export function buildStatisticsFixture(overrides: Partial<LeagueStatisticsDTO> = {}): LeagueStatisticsDTO {
  return { ...STAT_DEFAULTS, ...overrides };
}
