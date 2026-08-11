import { CurrentSeasonDTO, CurrentSeasonDTOSchema } from '@entities/season/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult, toServerApiResult } from '@shared/model';

const getCurrentSeason = async (): Promise<
  ServerApiResult<CurrentSeasonDTO>
> => {
  const response = await serverFetcher.get(API_PATH.currentSeason());
  const data = await response.json();

  return toServerApiResult<CurrentSeasonDTO>(
    response,
    data,
    CurrentSeasonDTOSchema
  );
};

export { getCurrentSeason };
