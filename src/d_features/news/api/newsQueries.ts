import { getNewsList } from '@entities/news/api/client';
import type { NewsListDTO, NewsQuery } from '@entities/news/model';

import { newsInfiniteQueryOptions } from './newsInfiniteQueryOptions';

/**
 * BffApiResponse 언랩 — !success면 throw해 react-query가 isError로 전이시킨다.
 * AD-1 표준 언랩 패턴(D-25) — news는 신규 도메인이라 player list의 언랩-없음 예외 대상이 아니다.
 */
const fetchNewsListViaBff = async (query: NewsQuery): Promise<NewsListDTO> => {
  const response = await getNewsList(query);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const newsQueries = {
  infiniteList: (pageSize?: number) => newsInfiniteQueryOptions(fetchNewsListViaBff, pageSize),
};

export { newsQueries };
