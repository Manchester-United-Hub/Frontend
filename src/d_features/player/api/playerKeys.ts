import type { PlayerListQueryDTO } from '@entities/player/model';

const playerKeys = {
  all: ['player'] as const,
  list: (query: PlayerListQueryDTO) => [...playerKeys.all, 'list', query] as const,
  profile: (playerId: number, season: number) =>
    [...playerKeys.all, 'profile', playerId, season] as const,
  statistics: (playerId: number, season: number) =>
    [...playerKeys.all, 'statistics', playerId, season] as const,
};

export { playerKeys };
