/**
 * Landing match card 상수.
 *
 * LANDING_MATCH_COMPETITION은 이 파일 한 곳에만 둔다 — 챔피언스리그가 이후
 * 추가될 때 이 상수가 유일한 분기 지점이 되도록 한다(D-6). 현재 외부 API가
 * 다루는 경기가 프리미어리그뿐이라 고정 라벨이 참이다. 라운드 번호(예: 32R)는
 * 외부 DTO에 없어 붙이지 않는다.
 */

const LANDING_MATCH_COMPETITION = '프리미어리그';

const RECENT_MATCH_TAG = '최근 경기';
const NEXT_MATCH_TAG = '다음 경기';

/**
 * MatchSide.code가 런타임에 undefined일 때의 표시용 폴백.
 * 레포의 UNKNOWN_VALUE 관례('-')를 따른다.
 */
const FALLBACK_TEAM_CODE = '-';

export {
  LANDING_MATCH_COMPETITION,
  RECENT_MATCH_TAG,
  NEXT_MATCH_TAG,
  FALLBACK_TEAM_CODE,
};
