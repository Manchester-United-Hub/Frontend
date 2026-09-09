import { useSuspenseQuery } from '@tanstack/react-query';

import type { PlayerListQueryDTO } from '@entities/player/model';

import { playerQueries } from './playerQueries';

/**
 * usePlayerList의 Suspense 판. 같은 queryKey를 쓰므로 서버 prefetch 캐시를 그대로 이어받는다.
 *
 * useSuspenseQuery는 로딩을 suspend로, 에러를 렌더 중 throw로 알린다 — 반드시 Suspense와
 * ErrorBoundary가 쌍으로 감싼 트리에서만 호출한다. 경계가 없는 소비자(RosterPanel)는
 * isLoading·isError 분기가 그대로 필요하므로 usePlayerList(useQuery)를 쓴다.
 */
const useSuspensePlayerList = (query: PlayerListQueryDTO) =>
  useSuspenseQuery(playerQueries.list(query));

export { useSuspensePlayerList };
