import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { MatchScheduleListDTO } from '@entities/matches/model';

const getMatchScheduleList = async (): Promise<
  BffApiResponse<MatchScheduleListDTO>
> => {
  const response = await clientFetcher.get(BFF_PATH.matchSchedule());
  return response.json();
};

export { getMatchScheduleList };
