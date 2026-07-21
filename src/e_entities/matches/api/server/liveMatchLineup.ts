import {
  MatchDetailsQueryDTO,
  LiveMatchLineupDTO,
} from '@entities/matches/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchLiveMatchLineup = async ({
  matchId,
}: MatchDetailsQueryDTO): Promise<ServerApiResult<LiveMatchLineupDTO>> => {
  const response = await serverFetcher.get(API_PATH.liveMatchLineup(matchId));
  const data = await response.json();
  if (response.ok) {
    return {
      isSuccess: true,
      status: response.status,
      data: data as LiveMatchLineupDTO,
    };
  }
  return {
    isSuccess: false,
    status: response.status,
    data: data as ApiErrorResponse,
  };
};

export { fetchLiveMatchLineup };
