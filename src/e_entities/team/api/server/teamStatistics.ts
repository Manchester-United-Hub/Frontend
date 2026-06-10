import { TeamStatisticsListDTO } from '@entities/team/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult } from '@shared/model';

const fetchTeamStatistics = async (): Promise<
  ServerApiResult<TeamStatisticsListDTO>
> => {
  const response = await serverFetcher.get(API_PATH.teamStatistics());
  return {
    isSuccess: response.ok,
    status: response.status,
    data: await response.json(),
  } as ServerApiResult<TeamStatisticsListDTO>;
};

export { fetchTeamStatistics };
