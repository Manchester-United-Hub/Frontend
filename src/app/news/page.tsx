import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { newsServerQueries } from '@features/news/api/newsServerQueries';
import { DEFAULT_NEWS_PAGE_SIZE } from '@features/news/api';
import { NewsPage } from '@pages/news';

// ISR — 5분마다 재생성한다(AD-5/D-14). `dynamic = 'force-dynamic'`은 쓰지 않는다.
export const revalidate = 300;

export default async function News() {
  // 프리페치 전용 QueryClient — retry: false(AD-4). 백엔드 장애 시 재시도로 TTFB를
  // 붙잡지 않고, 실패 쿼리는 dehydrate 대상에서 제외돼 클라이언트가 이어받는다.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  await queryClient.prefetchInfiniteQuery(newsServerQueries.infiniteList(DEFAULT_NEWS_PAGE_SIZE));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewsPage />
    </HydrationBoundary>
  );
}
