import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { CurrentSeasonDTO } from '@entities/seasonInfo/model';

const fetchCurrentSeason = async (): Promise<
  BffApiResponse<CurrentSeasonDTO>
> => {
  const response = await clientFetcher.get(BFF_PATH.currentSeason());
  return response.json();
};

export { fetchCurrentSeason };
