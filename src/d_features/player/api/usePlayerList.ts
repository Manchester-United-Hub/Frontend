import { useQuery } from '@tanstack/react-query';

import type { PlayerListQueryDTO } from '@entities/player/model';

import { playerQueries } from './playerQueries';

interface UsePlayerListOptions {
  /** false면 조회를 미룬다 — season이 확정되기 전에 전체 선수 조회로 새는 것을 막는다. */
  enabled?: boolean;
}

const usePlayerList = (query: PlayerListQueryDTO, options?: UsePlayerListOptions) =>
  useQuery({ ...playerQueries.list(query), ...options });

export { usePlayerList };
