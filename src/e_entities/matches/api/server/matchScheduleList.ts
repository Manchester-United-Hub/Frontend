import {
  MatchScheduleListDTO,
  MatchScheduleParams,
  scheduleSchema,
} from '@entities/matches/model';

import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult, toServerApiResult } from '@shared/model';

const fetchMatchScheduleList = async (
  query: MatchScheduleParams
): Promise<ServerApiResult<MatchScheduleListDTO>> => {
  const response = await serverFetcher.get(API_PATH.matchSchedule(), query);
  const data = await response.json();

  return toServerApiResult<MatchScheduleListDTO>(
    response,
    data,
    scheduleSchema.TotalMatchScheduleDTOSchema
  );
};

export { fetchMatchScheduleList };
