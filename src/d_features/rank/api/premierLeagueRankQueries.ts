import { queryOptions } from '@tanstack/react-query';

import { fetchPremierLeagueRankList } from '@entities/rank/api';
import { Standing } from '@entities/rank/model';

import { rankKeys } from './rankKeys';

const _fetchPremierLeagueRank = async (): Promise<Standing[]> => {
  const response = await fetchPremierLeagueRankList();

  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const premierLeagueRankQueries = {
  rank: () =>
    queryOptions({
      queryKey: rankKeys.pl(),
      queryFn: _fetchPremierLeagueRank,
      staleTime: 1000 * 60 * 5,
      gcTime: 200,
    }),
};

export { premierLeagueRankQueries };
