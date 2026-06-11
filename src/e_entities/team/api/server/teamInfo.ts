import { TeamInfoDTO, TeamInfoParamsDTO } from '@entities/team/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchTeamInfo = async ({
  teamId,
}: TeamInfoParamsDTO): Promise<ServerApiResult<TeamInfoDTO>> => {
  const response = await serverFetcher.get(API_PATH.team(teamId));
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as TeamInfoDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchTeamInfo };
