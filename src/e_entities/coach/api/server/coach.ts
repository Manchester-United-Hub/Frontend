import { CoachDTO, CoachDTOSchema } from '@entities/coach/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult, toServerApiResult } from '@shared/model';

const fetchCoach = async (teamId: number): Promise<ServerApiResult<CoachDTO>> => {
  const response = await serverFetcher.get(API_PATH.coach(teamId));
  const data: unknown = await response.json();
  return toServerApiResult(response, data, CoachDTOSchema);
};

export { fetchCoach };
