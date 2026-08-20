import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { Match } from '@entities/matches/types';

const getMatchScheduleList = async (): Promise<BffApiResponse<Match[]>> => {
  const response = await clientFetcher.get(BFF_PATH.matchSchedule());
  return response.json();
};

export { getMatchScheduleList };
