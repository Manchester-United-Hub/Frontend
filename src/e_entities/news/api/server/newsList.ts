import { NewsListDTO, NewsListDTOSchema, NewsQuery } from '@entities/news/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const INVALID_RESPONSE_STATUS = 502;
const INVALID_RESPONSE_CODE = 'INVALID_RESPONSE_SCHEMA';

const fetchNewsList = async (
  params: NewsQuery
): Promise<ServerApiResult<NewsListDTO>> => {
  const response = await serverFetcher.get(API_PATH.newsList(), params);
  const data = await response.json();
  if (response.ok) {
    const parsed = NewsListDTOSchema.safeParse(data);
    if (parsed.success) {
      return {
        isSuccess: true,
        status: response.status,
        data: parsed.data,
      };
    }
    return {
      isSuccess: false,
      status: INVALID_RESPONSE_STATUS,
      data: { code: INVALID_RESPONSE_CODE, message: parsed.error.message },
    };
  }
  return {
    isSuccess: false,
    status: response.status,
    data: data as ApiErrorResponse,
  };
};

export { fetchNewsList };
