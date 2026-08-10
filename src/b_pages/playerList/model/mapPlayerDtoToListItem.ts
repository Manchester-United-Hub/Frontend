/**
 * PlyaerDTO → PlayerListItem 변환 (PL-2, decision-1.md D-31).
 *
 * 페이지 로컬 컨버터(AD-2) — player 도메인이 landing·playerList 두 페이지에서 쓰이므로
 * e_entities에 공유 컨버터를 두지 않는다. mapApiPositionToCode의 매핑표는 playerDetail(PD-3)이
 * 각자 페이지 로컬로 동일하게 미러링한다(두 워크트리가 격리돼 있어 decision-1.md로만 어휘를 맞춘다).
 */

import type { PlyaerDTO } from '@entities/player/model';

import type { PlayerListItem, PlayerPosition, PlayerSquad, PlayerStatus } from './types';

/** 실측 응답(result-PL-2.md) 기준 4종만 매핑 — 그 외(대소문자 변형 포함)는 전부 undefined. */
const API_POSITION_TO_CODE: Record<string, PlayerPosition> = {
  Goalkeeper: 'GK',
  Defender: 'DF',
  Midfielder: 'MF',
  Attacker: 'FW',
};

/** 실측 4종 외 값(null 포함)은 전부 undefined — 임의 코드 배정 금지(추측 금지 원칙, decision-1.md). */
const mapApiPositionToCode = (position: string | null): PlayerPosition | undefined =>
  position === null ? undefined : API_POSITION_TO_CODE[position];

/** `/api/players`는 현재 스쿼드만 반환하므로 항상 현역·1군으로 고정한다(D-6). */
const DEFAULT_STATUS: PlayerStatus = 'active';
const DEFAULT_SQUAD: PlayerSquad = '1군';
/** DTO에 대응 필드가 없어 빈 문자열 — RosterGrid의 meta 자리에 빈 텍스트로 노출된다(알려진 디그레이드). */
const DEFAULT_YEARS = '';

const mapPlayerDtoToListItem = (dto: PlyaerDTO): PlayerListItem => ({
  id: String(dto.id),
  number: dto.number ?? undefined,
  name: dto.name,
  nameEn: dto.name,
  position: mapApiPositionToCode(dto.position),
  nationality: dto.nationality,
  flagCode: undefined,
  years: DEFAULT_YEARS,
  status: DEFAULT_STATUS,
  squad: DEFAULT_SQUAD,
});

export { mapPlayerDtoToListItem, mapApiPositionToCode };
