import { GameScheduleListDTO } from '@entities/game/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult } from '@shared/model';

const fetchGameScheduleList = async (): Promise<
  ServerApiResult<GameScheduleListDTO>
> => {
  const response = await serverFetcher.get(API_PATH.gameSchedule());

  return {
    isSuccess: response.ok,
    status: response.status,
    data: await response.json(),
  } as ServerApiResult<GameScheduleListDTO>;
};

export { fetchGameScheduleList };
