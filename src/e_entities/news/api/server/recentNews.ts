import { RecentNewsListDTO } from '@entities/news/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult } from '@shared/model';

const fetchRecentNews = async (): Promise<
  ServerApiResult<RecentNewsListDTO>
> => {
  const response = await serverFetcher.get(API_PATH.recentNews());
  return {
    isSuccess: response.ok,
    status: response.status,
    data: await response.json(),
  } as ServerApiResult<RecentNewsListDTO>;
};

export { fetchRecentNews };
