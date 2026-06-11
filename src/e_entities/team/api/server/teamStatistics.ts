import { TeamStatisticsListDTO } from '@entities/team/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchTeamStatistics = async (): Promise<
  ServerApiResult<TeamStatisticsListDTO>
> => {
  const response = await serverFetcher.get(API_PATH.teamStatistics());
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as TeamStatisticsListDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchTeamStatistics };
