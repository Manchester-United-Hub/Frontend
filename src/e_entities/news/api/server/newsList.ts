import { NewsListDTO, NewsQuery } from '@entities/news/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchNewsList = async (
  params: NewsQuery
): Promise<ServerApiResult<NewsListDTO>> => {
  const response = await serverFetcher.get(API_PATH.newsList(), params);
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as NewsListDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchNewsList };
