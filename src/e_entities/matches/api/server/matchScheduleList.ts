import { MatchScheduleListDTO } from '@entities/matches/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchMatchScheduleList = async (): Promise<
  ServerApiResult<MatchScheduleListDTO>
> => {
  const response = await serverFetcher.get(API_PATH.matchSchedule());
  const data = await response.json();
  if (response.ok) {
    return {
      isSuccess: true,
      status: response.status,
      data: data as MatchScheduleListDTO,
    };
  }
  return {
    isSuccess: false,
    status: response.status,
    data: data as ApiErrorResponse,
  };
};

export { fetchMatchScheduleList };
