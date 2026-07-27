import { queryOptions } from '@tanstack/react-query';

import { getMatchScheduleList } from '@entities/matches/api';
import { matchesKeys } from './matchesKeys';

const matchesQueries = {
  scheduleList: () =>
    queryOptions({
      queryKey: matchesKeys.schedules(),
      queryFn: getMatchScheduleList,
    }),
};

export { matchesQueries };
