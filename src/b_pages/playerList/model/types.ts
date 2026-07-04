/**
 * Player list page domain types (ST-2).
 *
 * These are model-layer types, not component prop types.
 * Component props live in f_shared/ui — keep them separate (code-quality.md).
 *
 * PlayerListItem / FilterOption / usePlayerListFilters follow the
 * architecture.interfaceContracts in plan.json — ST-3A/ST-3B/ST-4 consume these.
 *
 * No e_entities import — this page is mock-data only (standards: e_entities 실 API 호출 금지).
 */

/** Filter key shared by position/decade/squad selects — "선택 안 함" 상태. */
export const ALL_FILTER_KEY = 'all';

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';
export type PlayerSquad = '1군' | '레전드';
export type PlayerStatus = 'active' | 'retired';

/** 카드뷰 / 리스트뷰 전환 상태 (ADR-7). */
export type RosterView = 'card' | 'list';

/** interfaceContracts.PlayerListItem 계약. */
export interface PlayerListItem {
  id: string;
  number: number;
  name: string;
  nameEn: string;
  position: PlayerPosition;
  nationality: string;
  flagCode: string;
  years: string;
  status: PlayerStatus;
  squad: PlayerSquad;
}

/** interfaceContracts.FilterOption 계약 — POSITIONS·DECADES·SQUADS 공통 타입. */
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
