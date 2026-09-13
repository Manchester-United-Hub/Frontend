import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

import { getSeasonInfo } from '@entities/seasonInfo/api/server';
import { matchServerQueries } from '@features/matches/api/matchServerQueries';
import { playerServerQueries } from '@features/player/api/playerServerQueries';
import { LandingPage } from '@pages/landing';

// ISR — 5분마다 재생성한다(A-3/S-8). `dynamic = 'force-dynamic'`은 쓰지 않는다.
// LANDING_MATCHES_STALE_TIME_MS(300_000)와 같은 창을 가리켜야 SSR prefetch와
// CSR hydrate가 서로를 무효화하지 않는다(D-7).
export const revalidate = 300;

export default async function Home() {
  const { startYear } = await getSeasonInfo();

  // 프리페치 전용 QueryClient — retry: false(S-8). 백엔드 장애 시 재시도로 TTFB를
  // 붙잡지 않고, 실패 쿼리는 dehydrate 대상에서 제외돼 클라이언트가 이어받는다.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  await Promise.all([
    queryClient.prefetchQuery(playerServerQueries.list(startYear)),
    queryClient.prefetchQuery(matchServerQueries.landing()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingPage season={startYear} />
    </HydrationBoundary>
  );
}
