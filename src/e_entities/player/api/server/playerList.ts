import { PlayerListQueryDTO, PlyaerListDTO } from '@entities/player/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult } from '@shared/model';

const fetchPlayerList = async (
  query: PlayerListQueryDTO
): Promise<ServerApiResult<PlyaerListDTO>> => {
  const response = await serverFetcher.get(API_PATH.playerList(), query);
  return {
    isSuccess: response.ok,
    status: response.status,
    data: await response.json(),
  } as ServerApiResult<PlyaerListDTO>;
};

export { fetchPlayerList };
