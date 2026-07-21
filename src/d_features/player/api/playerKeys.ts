import type { PlayerListQueryDTO } from '@entities/player/model';

const playerKeys = {
  all: ['player'] as const,
  list: (query: PlayerListQueryDTO) => [...playerKeys.all, 'list', query] as const,
};

export { playerKeys };
