import { GameScheduleListDTO } from '@entities/game/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

const fetchGameScheduleList = async (): Promise<
  ServerApiResult<GameScheduleListDTO>
> => {
  const response = await serverFetcher.get(API_PATH.gameSchedule());
  const data = await response.json();
  if (response.ok) {
    return { isSuccess: true, status: response.status, data: data as GameScheduleListDTO };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchGameScheduleList };
