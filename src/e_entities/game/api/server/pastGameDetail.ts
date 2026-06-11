import { GameDetailsQueryDTO, PastGameDetailDTO } from '@entities/game/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchPastGameDetail = async ({
  fixtureId,
}: GameDetailsQueryDTO): Promise<ServerApiResult<PastGameDetailDTO>> => {
  const response = await serverFetcher.get(API_PATH.pastGameDetail(fixtureId));
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as PastGameDetailDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchPastGameDetail };
