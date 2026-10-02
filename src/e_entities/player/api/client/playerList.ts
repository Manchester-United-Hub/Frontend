import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { PlayerListQueryDTO, PlyaerListDTO } from '@entities/player/model';

const getPlayerList = async (
  query: PlayerListQueryDTO
): Promise<BffApiResponse<PlyaerListDTO>> => {
  const response = await clientFetcher.get(BFF_PATH.playerList(), query);
  return response.json();
};

export { getPlayerList };
