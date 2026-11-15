import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getSeasonInfo } from '@entities/seasonInfo/api/server';
import { highlightServerQueries } from '@features/highlight/api/highlightServerQueries';
import { HighlightsPage } from '@pages/highlights';

export const revalidate = 300;

const FIRST_PAGE = 0;

export default async function Highlights() {
  const { startYear } = await getSeasonInfo();

  // 백엔드 장애 시 재시도로 응답을 늦추지 않는다. 실패한 쿼리는 클라이언트가 BFF로 이어서 조회한다.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  // 정렬 토글을 누르는 즉시 대표 영상이 바뀌어 보이도록 두 정렬의 1페이지를 함께 받아 둔다.
  await Promise.all([
    queryClient.prefetchQuery(
      highlightServerQueries.list({ season: startYear, sort: 'LATEST', page: FIRST_PAGE })
    ),
    queryClient.prefetchQuery(
      highlightServerQueries.list({ season: startYear, sort: 'VIEW_COUNT', page: FIRST_PAGE })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HighlightsPage season={startYear} />
    </HydrationBoundary>
  );
}
