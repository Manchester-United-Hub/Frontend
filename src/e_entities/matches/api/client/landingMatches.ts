import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { LandingMatches } from '@entities/matches/types/landingMatches';

const getLandingMatchesViaBff = async (): Promise<BffApiResponse<LandingMatches>> => {
  const response = await clientFetcher.get(BFF_PATH.landingMatches());
  return response.json();
};

export { getLandingMatchesViaBff };
