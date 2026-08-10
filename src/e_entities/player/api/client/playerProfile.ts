import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { PlayerListQueryDTO, PlyaerDTO } from '@entities/player/model';

const getPlayerProfile = async (
  playerId: number,
  query: PlayerListQueryDTO
): Promise<BffApiResponse<PlyaerDTO>> => {
  const response = await clientFetcher.get(BFF_PATH.playerProfile(playerId), query);
  return response.json();
};

export { getPlayerProfile };
