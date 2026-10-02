import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { NewsListDTO, NewsQuery } from '@entities/news/model';

const getNewsList = async (query: NewsQuery): Promise<BffApiResponse<NewsListDTO>> => {
  const response = await clientFetcher.get(BFF_PATH.newsList(), query);
  return response.json();
};

export { getNewsList };
