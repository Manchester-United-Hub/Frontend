import { PlayerListQueryDTO, PlyaerListDTO } from '@entities/player/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchPlayerList = async (
  query: PlayerListQueryDTO
): Promise<ServerApiResult<PlyaerListDTO>> => {
  const response = await serverFetcher.get(API_PATH.playerList(), query);
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as PlyaerListDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchPlayerList };
