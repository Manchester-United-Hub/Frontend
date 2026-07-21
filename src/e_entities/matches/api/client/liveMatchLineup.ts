import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type {
  MatchDetailsQueryDTO,
  LiveMatchLineupDTO,
} from '@entities/matches/model';

const getLiveMatchLineup = async ({
  matchId,
}: MatchDetailsQueryDTO): Promise<BffApiResponse<LiveMatchLineupDTO>> => {
  const response = await clientFetcher.get(BFF_PATH.liveMatchLineup(matchId));
  return response.json();
};

export { getLiveMatchLineup };
