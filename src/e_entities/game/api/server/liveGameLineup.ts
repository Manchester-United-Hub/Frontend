import { GameDetailsQueryDTO, LiveGameLineupDTO } from '@entities/game/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchLiveGameLineup = async ({
  fixtureId,
}: GameDetailsQueryDTO): Promise<ServerApiResult<LiveGameLineupDTO>> => {
  const response = await serverFetcher.get(API_PATH.liveGameLineup(fixtureId));
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as LiveGameLineupDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchLiveGameLineup };
