/**
 * 선수 API DTO 픽스처 — swagger의 SeasonPlayerResponse / SeasonPlayerListResponse 계약 그대로.
 * 필드 기본값은 실측 응답(`/api/players`)에서 옮겼다.
 */

import type { PlyaerDTO, PlyaerListDTO } from '@entities/player/model';

const BASE_PLAYER_DTO: PlyaerDTO = {
  id: 1485,
  name: 'Bruno Fernandes',
  birthDate: '1994-09-08',
  nationality: 'Portugal',
  height: '179',
  weight: '69',
  number: 8,
  position: 'Midfielder',
  photo: 'https://example.com/players/1485.png',
  seasons: [2020, 2021, 2022, 2023, 2024, 2025],
};

const buildPlayerDTO = (overrides: Partial<PlyaerDTO> = {}): PlyaerDTO => ({
  ...BASE_PLAYER_DTO,
  ...overrides,
});

/** 페이지 봉투로 감싼다 — 목록 응답은 배열이 아니다. */
const buildPlayerListDTO = (players: PlyaerDTO[]): PlyaerListDTO => ({
  players,
  page: 0,
  size: 100,
  totalElements: players.length,
  totalPages: 1,
  hasNext: false,
});

export { BASE_PLAYER_DTO, buildPlayerDTO, buildPlayerListDTO };
