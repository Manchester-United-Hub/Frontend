import { queryOptions } from '@tanstack/react-query';

import { fetchCurrentSeason } from '@entities/seasonInfo/api/client';
import type { CurrentSeasonDTO } from '@entities/seasonInfo/model';

import { seasonKeys } from './seasonKeys';

/** BffApiResponse 언랩 — !success면 throw해 react-query가 isError로 전이시킨다(AD-1 표준). */
const fetchCurrentSeasonViaBff = async (): Promise<CurrentSeasonDTO> => {
  const response = await fetchCurrentSeason();
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const seasonQueries = {
  current: () =>
    queryOptions({
      queryKey: seasonKeys.current(),
      queryFn: fetchCurrentSeasonViaBff,
    }),
};

export { seasonQueries };
