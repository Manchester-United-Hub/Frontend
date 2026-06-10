import { GameDetailsQueryDTO, PastGameDetailDTO } from '@entities/game/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult } from '@shared/model';

const fetchPastGameDetail = async ({
  fixtureId,
}: GameDetailsQueryDTO): Promise<ServerApiResult<PastGameDetailDTO>> => {
  const response = await serverFetcher.get(API_PATH.pastGameDetail(fixtureId));
  return {
    isSuccess: response.ok,
    status: response.status,
    data: await response.json(),
  } as ServerApiResult<PastGameDetailDTO>;
};

export { fetchPastGameDetail };
