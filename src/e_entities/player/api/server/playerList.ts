import {
  PlayerListDTOSchema,
  PlayerListQueryDTO,
  PlyaerListDTO,
} from '@entities/player/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult, toServerApiResult } from '@shared/model';

const fetchPlayerList = async (
  query: PlayerListQueryDTO
): Promise<ServerApiResult<PlyaerListDTO>> => {
  const response = await serverFetcher.get(API_PATH.playerList(), query);
  const data = await response.json();

  return toServerApiResult<PlyaerListDTO>(response, data, PlayerListDTOSchema);
};

export { fetchPlayerList };
