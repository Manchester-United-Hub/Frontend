import { TeamInfoDTO, TeamInfoParamsDTO } from '@entities/team/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult } from '@shared/model';

const fetchTeamInfo = async ({
  teamId,
}: TeamInfoParamsDTO): Promise<ServerApiResult<TeamInfoDTO>> => {
  const response = await serverFetcher.get(API_PATH.team(teamId));
  return {
    isSuccess: response.ok,
    status: response.status,
    data: await response.json(),
  } as ServerApiResult<TeamInfoDTO>;
};

export { fetchTeamInfo };
