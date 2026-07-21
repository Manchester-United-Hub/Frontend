import {
  MatchDetailsQueryDTO,
  PastMatchDetailDTO,
} from '@entities/matches/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchPastMatchDetail = async ({
  matchId,
}: MatchDetailsQueryDTO): Promise<ServerApiResult<PastMatchDetailDTO>> => {
  const response = await serverFetcher.get(API_PATH.pastMatchDetail(matchId));
  const data = await response.json();
  if (response.ok) {
    return {
      isSuccess: true,
      status: response.status,
      data: data as PastMatchDetailDTO,
    };
  }
  return {
    isSuccess: false,
    status: response.status,
    data: data as ApiErrorResponse,
  };
};

export { fetchPastMatchDetail };
