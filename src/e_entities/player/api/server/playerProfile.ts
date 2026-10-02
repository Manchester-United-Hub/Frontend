import { PlayerListQueryDTO, PlyaerDTO } from '@entities/player/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchPlayerProfile = async (
  playerId: number,
  query: PlayerListQueryDTO
): Promise<ServerApiResult<PlyaerDTO>> => {
  const response = await serverFetcher.get(API_PATH.playerDetail(playerId), query);
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as PlyaerDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchPlayerProfile };
