/**
 * 선수 목록 필터 조건 (ADR-6, D-8 — b_pages/playerList/model/types.ts에서 이관).
 *
 * filterPlayers(같은 세그먼트의 순수 파생 함수)가 소비하는 계약이다. 필터 UI(d_features/player)는
 * 이 타입을 그대로 import해 값을 채운다.
 */

/** Filter key shared by position/decade/squad selects — "선택 안 함" 상태. */
export const ALL_FILTER_KEY = 'all';

/** filterPlayers(순수함수)에 전달되는 필터 조건 (ADR-6). */
export interface PlayerFilterCriteria {
  position: string;
  decade: string;
  squad: string;
  query: string;
}
