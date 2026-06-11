import { RecentNewsListDTO } from '@entities/news/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchRecentNews = async (): Promise<
  ServerApiResult<RecentNewsListDTO>
> => {
  const response = await serverFetcher.get(API_PATH.recentNews());
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as RecentNewsListDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchRecentNews };
