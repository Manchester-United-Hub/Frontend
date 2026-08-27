/**
 * Player list page domain types (ST-2).
 *
 * These are model-layer types, not component prop types.
 * Component props live in f_shared/ui — keep them separate (code-quality.md).
 *
 * PlayerListItem / FilterOption / usePlayerListFilters follow the
 * architecture.interfaceContracts in plan.json — ST-3A/ST-3B/ST-4 consume these.
 *
 * PL-2(decision-1.md D-31): number/position/nationality/flagCode는 실 API 갭 때문에 옵셔널이다.
 * 이 파일 자체는 여전히 e_entities를 import하지 않는다 — DTO→PlayerListItem 변환은
 * mapPlayerDtoToListItem.ts(페이지 로컬 컨버터)가 전담한다.
 */

/** Filter key shared by position/decade/squad selects — "선택 안 함" 상태. */
export const ALL_FILTER_KEY = 'all';

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';
export type PlayerSquad = '1군' | '레전드';
export type PlayerStatus = 'active' | 'retired';

/** 카드뷰 / 리스트뷰 전환 상태 (ADR-7). */
export type RosterView = 'card' | 'list';

/**
 * interfaceContracts.PlayerListItem 계약.
 *
 * number/position/nationality/flagCode는 옵셔널 — 실 API(`/api/players`)가 채우지 못하는 선수가
 * 있다(SeasonPlayerResponse에서 해당 필드가 null로 내려온다. flagCode는 애초에 API에 대응 필드가
 * 없어 로컬 매핑을 신설하지 않음). 소비처(RosterGrid 등)는 `?? '-'` 폴백으로 방어한다.
 *
 * years는 DTO의 `seasons`(출전 시즌 시작연도 목록)를 압축한 활약연도다.
 */
export interface PlayerListItem {
  id: string;
  number?: number;
  name: string;
  nameEn: string;
  position?: PlayerPosition;
  nationality?: string;
  flagCode?: string;
  years: string;
  status: PlayerStatus;
  squad: PlayerSquad;
}

/** interfaceContracts.FilterOption 계약 — POSITIONS(model/positionOptions.ts)가 쓰는 공통 타입. DECADES/SQUADS는 실 데이터 근거 부재로 삭제됨(리뷰 H-3). */
export interface FilterOption {
  key: string;
  label: string;
}

/** filterPlayers(순수함수)에 전달되는 필터 조건 (ADR-6). */
export interface PlayerFilterCriteria {
  position: string;
  decade: string;
  squad: string;
  query: string;
}
