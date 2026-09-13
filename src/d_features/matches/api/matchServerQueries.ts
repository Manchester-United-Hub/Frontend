import { queryOptions } from '@tanstack/react-query';

import { getLandingMatches } from '@entities/matches/api/server/getLandingMatches';
import type { LandingMatches } from '@entities/matches/types/landingMatches';

import { LANDING_MATCHES_STALE_TIME_MS } from './configs';
import { matchKeys } from './matchKeys';

/**
 * getLandingMatches가 null이면(상류 실패) throw한다. prefetchQuery는 이 throw를 재던지지
 * 않고 실패 쿼리를 dehydrate 대상에서 제외하므로, 클라이언트가 마운트 후 기존 BFF 경로로
 * 이어받는다(D-7, graceful degradation).
 *
 * ⚠️ 서버 전용 모듈이다 — 이 파일은 d_features/matches/api/index.ts 배럴에 재노출하지
 * 않는다(newsServerQueries·playerServerQueries와 동일한 경계, D-10).
 */
const fetchLandingMatchesOnServer = async (): Promise<LandingMatches> => {
  const data = await getLandingMatches();
  if (!data) {
    throw new Error('landing matches fetch failed');
  }
  return data;
};

const matchServerQueries = {
  landing: () =>
    queryOptions({
      queryKey: matchKeys.landing(),
      queryFn: fetchLandingMatchesOnServer,
      staleTime: LANDING_MATCHES_STALE_TIME_MS,
    }),
};

export { matchServerQueries };
