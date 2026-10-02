import { queryOptions } from '@tanstack/react-query';

import { getLandingMatchesViaBff } from '@entities/matches/api/client';
import type { LandingMatches } from '@entities/matches/types/landingMatches';

import { LANDING_MATCHES_STALE_TIME_MS } from './configs';
import { matchKeys } from './matchKeys';

/** BffApiResponse 언랩 — !success면 throw해 react-query가 isError로 전이시킨다(AD-1 표준). */
const fetchLandingMatchesViaBff = async (): Promise<LandingMatches> => {
  const response = await getLandingMatchesViaBff();
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const matchQueries = {
  landing: () =>
    queryOptions({
      queryKey: matchKeys.landing(),
      queryFn: fetchLandingMatchesViaBff,
      staleTime: LANDING_MATCHES_STALE_TIME_MS,
    }),
};

export { matchQueries };
