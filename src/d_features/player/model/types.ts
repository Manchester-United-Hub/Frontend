/**
 * Player list page UI types (ST-2).
 *
 * 도메인 뷰모델(PlayerListItem)과 필터 조건(ALL_FILTER_KEY·PlayerFilterCriteria)은 D-8로
 * e_entities/player/model로 이관됐다 — 이 파일에는 페이지 로컬 UI 상태 타입만 남는다.
 */

/** 카드뷰 / 리스트뷰 전환 상태 (ADR-7). */
export type RosterView = 'card' | 'list';

/** interfaceContracts.FilterOption 계약 — POSITIONS(model/positionOptions.ts)가 쓰는 공통 타입. DECADES/SQUADS는 실 데이터 근거 부재로 삭제됨(리뷰 H-3). */
export interface FilterOption {
  key: string;
  label: string;
}
