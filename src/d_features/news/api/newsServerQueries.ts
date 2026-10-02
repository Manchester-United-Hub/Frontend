import { fetchNewsList } from '@entities/news/api/server';
import type { NewsListDTO, NewsQuery } from '@entities/news/model';

import { newsInfiniteQueryOptions } from './newsInfiniteQueryOptions';

/**
 * ServerApiResult 언랩 — !isSuccess면 throw한다. prefetchInfiniteQuery는 이 throw를
 * 재던지지 않고 실패 쿼리를 dehydrate 대상에서 제외하므로, 클라이언트가 마운트 후
 * 기존 BFF 경로로 이어받는다(AD-4, graceful degradation).
 *
 * ⚠️ 서버 전용 모듈이다 — 이 파일은 d_features/news/api/index.ts 배럴에 재노출하지 않는다(AD-1/S-6).
 */
const fetchNewsListOnServer = async (query: NewsQuery): Promise<NewsListDTO> => {
  const result = await fetchNewsList(query);
  if (!result.isSuccess) {
    throw new Error(result.data.message);
  }
  return result.data;
};

const newsServerQueries = {
  infiniteList: (pageSize?: number) => newsInfiniteQueryOptions(fetchNewsListOnServer, pageSize),
};

export { newsServerQueries };
