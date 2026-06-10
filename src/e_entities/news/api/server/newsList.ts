import { NewsListDTO, NewsQuery } from '@entities/news/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult } from '@shared/model';

const fetchNewsList = async (
  params: NewsQuery
): Promise<ServerApiResult<NewsListDTO>> => {
  const response = await serverFetcher.get(API_PATH.newsList(), params);
  return {
    isSuccess: response.ok,
    status: response.status,
    data: await response.json(),
  } as ServerApiResult<NewsListDTO>;
};

export { fetchNewsList };
