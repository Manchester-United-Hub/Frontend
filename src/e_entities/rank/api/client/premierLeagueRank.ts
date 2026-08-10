import { Standing } from '@entities/rank/model';
import { BFF_PATH, clientFetcher } from '@shared/api';
import { BffApiResponse } from '@shared/model';

const fetchPremierLeagueRankList = async (): Promise<
  BffApiResponse<Standing[]>
> => {
  const response = await clientFetcher.get(BFF_PATH.premierLeagueRank());
  return await response.json();
};

export { fetchPremierLeagueRankList };
