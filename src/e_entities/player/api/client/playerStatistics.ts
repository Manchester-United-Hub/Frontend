import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { PlayerListQueryDTO, PlayerStatisticsListDTO } from '@entities/player/model';

const getPlayerStatistics = async (
  playerId: number,
  query: PlayerListQueryDTO
): Promise<BffApiResponse<PlayerStatisticsListDTO>> => {
  const response = await clientFetcher.get(BFF_PATH.playerStatistics(playerId), query);
  return response.json();
};

export { getPlayerStatistics };
