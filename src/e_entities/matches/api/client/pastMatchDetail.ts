import { clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type {
  MatchDetailsQueryDTO,
  PastMatchDetailDTO,
} from '@entities/matches/types';

const getPastMatchDetail = async ({
  matchId,
}: MatchDetailsQueryDTO): Promise<BffApiResponse<PastMatchDetailDTO>> => {
  const response = await clientFetcher.get(`/api/v1/match/${matchId}/detail`);
  return response.json();
};

export { getPastMatchDetail };
