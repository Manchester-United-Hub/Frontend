import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type {
  MatchDetailsQueryDTO,
  PastMatchDetailDTO,
} from '@entities/matches/types';

const getPastMatchDetail = async ({
  matchId,
}: MatchDetailsQueryDTO): Promise<BffApiResponse<PastMatchDetailDTO>> => {
  const response = await clientFetcher.get(BFF_PATH.pastMatchLineup(matchId));
  return response.json();
};

export { getPastMatchDetail };
