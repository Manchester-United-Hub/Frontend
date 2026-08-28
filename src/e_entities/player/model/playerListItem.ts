/**
 * Player list domain view-model (D-8 — b_pages/playerList/model/types.ts에서 이관).
 *
 * These are model-layer types, not component prop types.
 * Component props live in f_shared/ui — keep them separate (code-quality.md).
 *
 * PL-2(decision-1.md D-31): number/position/nationality/flagCode는 실 API 갭 때문에 옵셔널이다.
 * 이 파일 자체는 여전히 상위 계층을 import하지 않는다 — DTO→PlayerListItem 변환은
 * utils/mapPlayerDtoToListItem.ts(엔티티 로컬 컨버터)가 전담한다.
 */

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';
export type PlayerSquad = '1군' | '레전드';
export type PlayerStatus = 'active' | 'retired';

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
  /** 선수 사진 URL(D-9, ST-006b). 없거나 빈 문자열이면 소비처가 실루엣 폴백을 쓴다. */
  photo?: string;
}
