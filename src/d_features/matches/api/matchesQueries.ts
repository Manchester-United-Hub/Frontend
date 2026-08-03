import { queryOptions } from '@tanstack/react-query';

import { getMatchScheduleList } from '@entities/matches/api';
import type { Match } from '@entities/matches/model';
import { matchesKeys } from './matchesKeys';

const fetchMatchSchedules = async (): Promise<Match[]> => {
  const response = await getMatchScheduleList();

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
};

const matchesQueries = {
  scheduleList: () =>
    queryOptions({
      queryKey: matchesKeys.schedules(),
      queryFn: fetchMatchSchedules,
    }),
};

export { matchesQueries };
