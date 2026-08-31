/**
 * Pure derivations from real API data (PD-1's `PlyaerDTO`/`LeagueStatisticsDTO`).
 *
 * Replaces the old mock-driven `deriveSeasonRows`/`deriveCurrentSeason`
 * (Math.random-free but still built on `PlayerDetail.career`/`years`, which
 * no longer exist — see model/types.ts header). `getAttrLevel` is the one
 * function carried over unchanged: `AttributeBarList`/`HexRadar` still
 * import it (D-26/D-30).
 */

import type { LeagueStatisticsDTO, PlyaerDTO } from '@entities/player/model';

import type {
  AttrLevel,
  CareerTotals,
  PlayerDetail,
  PlayerPosition,
  SeasonRow,
  SeasonSnapshot,
} from './types';

const ATTR_HIGH_THRESHOLD = 80;
const ATTR_MID_THRESHOLD = 65;
const PREMIER_LEAGUE_NAME_FRAGMENT = 'Premier League';
const CURRENT_SEASON_TITLE = '현재 시즌';

// 실측(D-13/D-31, GET /api/players?season=) 확인된 값 4종만 매핑한다.
const API_POSITION_TO_CODE: Record<string, PlayerPosition> = {
  Goalkeeper: 'GK',
  Defender: 'DF',
  Midfielder: 'MF',
  Attacker: 'FW',
};

/**
 * API 자유 텍스트 포지션 → 코드(D-31 — playerList와 동일 매핑표를 페이지
 * 로컬로 미러링). `null`이거나 매핑표에 없는 값(대소문자 변형·미래 추가값
 * 포함)은 전부 `undefined` — 정규화·추측 없이 "모름"을 그대로 전달한다.
 */
export function mapApiPositionToCode(position: string | null): PlayerPosition | undefined {
  if (position === null) return undefined;
  return API_POSITION_TO_CODE[position];
}

/**
 * `birthDate`(yyyy-MM-dd)와 기준 시각으로부터 만 나이를 계산하는 순수 함수.
 * `birthDate`가 `null`이면(origin/dev 병합으로 nullable화, ST-001) 나이를
 * 계산할 방법이 없으므로 `null`을 그대로 반환한다 — 0이나 임의값으로
 * 채우지 않는다.
 */
export function computeAge(birthDate: string | null, now: Date): number | null {
  if (birthDate === null) return null;

  const birth = new Date(birthDate);
  const hasHadBirthdayThisYear =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  return now.getFullYear() - birth.getFullYear() - (hasHadBirthdayThisYear ? 0 : 1);
}

/**
 * 선수 프로필 DTO → 화면용 `PlayerDetail`. `birthDate`/`nationality`는
 * 병합된 `PlayerDTOSchema`(ST-001)상 이미 nullable이라 그대로 통과시킨다
 * (빈 문자열·'미상' 같은 기본값 주입 금지 — 표현 계층에서 `'-'`로 흡수).
 * `height`/`weight`도 스키마상 이미 nullable이라 `?? null`은 방어 코드가
 * 아니라 타입을 명시적으로 좁히는 통과 대입이다.
 */
export function mapProfileDtoToPlayerDetail(dto: PlyaerDTO, now: Date): PlayerDetail {
  return {
    id: dto.id,
    num: dto.number,
    nm: dto.name,
    pos: mapApiPositionToCode(dto.position),
    nat: dto.nationality,
    dob: dto.birthDate,
    age: computeAge(dto.birthDate, now),
    height: dto.height ?? null,
    weight: dto.weight ?? null,
    photo: dto.photo,
  };
}

/** 대회별 통계 배열 → 시즌표 행(D-20, 대회 1건당 1행). */
export function selectSeasonRows(stats: LeagueStatisticsDTO[]): SeasonRow[] {
  return stats.map((stat) => ({
    season: stat.leagueName,
    apps: stat.appearances,
    goals: stat.goals,
    assists: stat.assists,
  }));
}

/** 대회별 행 합산 — "시즌 합계"(D-21, 진짜 통산 데이터 부재로 재정의). */
export function selectSeasonAggregate(rows: SeasonRow[]): CareerTotals {
  return rows.reduce(
    (totals, row) => ({
      apps: totals.apps + row.apps,
      goals: totals.goals + row.goals,
      assists: totals.assists + row.assists,
    }),
    { apps: 0, goals: 0, assists: 0 }
  );
}

/**
 * 대표 대회 선택(D-21) — leagueName에 "Premier League"가 포함된 행 우선,
 * 없으면 출전(appearances)이 가장 큰 행.
 */
export function selectPrimaryStatistics(stats: LeagueStatisticsDTO[]): LeagueStatisticsDTO | undefined {
  const premierLeagueStat = stats.find((stat) => stat.leagueName.includes(PREMIER_LEAGUE_NAME_FRAGMENT));
  if (premierLeagueStat) return premierLeagueStat;

  return stats.toSorted((a, b) => b.appearances - a.appearances)[0];
}

/**
 * 대표 대회 통계 → CurrentSeasonCard용 스냅샷. `primary`가 없으면(통계
 * 배열이 빈 경우) 0으로 채운다 — 카드 레이아웃은 유지하고 수치만 비운다
 * (D-21 alternatives_considered와 동일한 이유 — 카드를 통째로 숨기지 않음).
 */
export function buildCurrentSeasonSnapshot(primary: LeagueStatisticsDTO | undefined, season: number): SeasonSnapshot {
  return {
    szn: `${season}/${String(season + 1).slice(2)}`,
    title: CURRENT_SEASON_TITLE,
    apps: primary?.appearances ?? 0,
    goals: primary?.goals ?? 0,
    assists: primary?.assists ?? 0,
  };
}

/**
 * Attribute-value tier (v≥80 high / v≥65 mid / else low). 변경 없음 —
 * `AttributeBarList`/`HexRadar`가 여전히 이 함수를 import한다(D-26/D-30,
 * radar/ovr 데이터 흐름은 끊겼지만 함수 자체는 계속 필요).
 */
export function getAttrLevel(v: number): AttrLevel {
  if (v >= ATTR_HIGH_THRESHOLD) return 'high';
  if (v >= ATTR_MID_THRESHOLD) return 'mid';
  return 'low';
}
