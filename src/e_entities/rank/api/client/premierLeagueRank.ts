import { PLRankParams, Standing } from '@entities/rank/types';
import { BFF_PATH, clientFetcher } from '@shared/api';
import { BffApiResponse } from '@shared/model';

const fetchPremierLeagueRankList = async (
  params?: PLRankParams
): Promise<BffApiResponse<Standing[]>> => {
  const response = await clientFetcher.get(
    BFF_PATH.premierLeagueRank(),
    params
  );
  return await response.json();
};

export { fetchPremierLeagueRankList };
