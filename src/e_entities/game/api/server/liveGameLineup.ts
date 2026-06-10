import { GameDetailsQueryDTO, LiveGameLineupDTO } from '@entities/game/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult } from '@shared/model';

const fetchLiveGameLineup = async ({
  fixtureId,
}: GameDetailsQueryDTO): Promise<ServerApiResult<LiveGameLineupDTO>> => {
  const response = await serverFetcher.get(API_PATH.liveGameLineup(fixtureId));
  return {
    isSuccess: response.ok,
    status: response.status,
    data: await response.json(),
  } as ServerApiResult<LiveGameLineupDTO>;
};

export { fetchLiveGameLineup };
