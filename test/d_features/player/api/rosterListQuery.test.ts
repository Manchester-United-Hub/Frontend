/**
 * rosterListQuery 단위 테스트 — A-5/S-5 회귀 가드(급소 ②).
 *
 * 서버 prefetch(playerServerQueries)와 클라이언트 훅(usePlayerList → playerQueries)이 같은
 * startYear로 구조적으로 동일한 queryKey를 만드는지 단언한다. 다르면 하이드레이션이 조용히
 * 무시되고 클라이언트가 재조회한다 — 화면은 정상이라 이 테스트 없이는 아무도 모른다.
 *
 * playerServerQueries.ts는 getPlayerRoster.ts('use cache')를 모듈 최상단에서 import하므로
 * next/cache와 상류 fetcher를 mock한다(queryFn을 호출하지 않고 .queryKey/.staleTime만
 * 읽으므로 실제로 호출되지는 않지만, import 시점 안전을 위해 getStandings.test.ts와
 * 동일하게 mock한다).
 */

import { describe, it, expect, vi } from 'vitest';

import { rosterListQuery } from '@features/player/api/rosterListQuery';
import { playerQueries } from '@features/player/api/playerQueries';
import { playerServerQueries } from '@features/player/api/playerServerQueries';

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
}));

vi.mock('@entities/player/api/server', () => ({
  fetchPlayerList: vi.fn(),
}));

vi.mock('@entities/player/api/client', () => ({
  getPlayerList: vi.fn(),
}));

describe('rosterListQuery', () => {
  it('startYear로 { season, size: 100 } PlayerListQueryDTO를 만든다(MAX_PAGE_SIZE)', () => {
    expect(rosterListQuery(2026)).toEqual({ season: 2026, size: 100 });
  });

  it('startYear가 다르면 다른 season 값을 만든다', () => {
    expect(rosterListQuery(2026)).not.toEqual(rosterListQuery(2027));
  });

  it('서버(playerServerQueries)·클라이언트(playerQueries) 두 경로가 같은 startYear로 구조적으로 동일한 queryKey를 만든다', () => {
    const startYear = 2026;

    const clientKey = playerQueries.list(rosterListQuery(startYear)).queryKey;
    const serverKey = playerServerQueries.list(startYear).queryKey;

    expect(serverKey).toEqual(clientKey);
    expect(serverKey).toEqual(['player', 'list', { season: startYear, size: 100 }]);
  });

  it('startYear가 다르면 서버·클라이언트 두 경로 모두 다른 queryKey를 만든다(키 충돌 없음)', () => {
    const clientKeyA = playerQueries.list(rosterListQuery(2026)).queryKey;
    const clientKeyB = playerQueries.list(rosterListQuery(2027)).queryKey;
    const serverKeyA = playerServerQueries.list(2026).queryKey;
    const serverKeyB = playerServerQueries.list(2027).queryKey;

    expect(clientKeyA).not.toEqual(clientKeyB);
    expect(serverKeyA).not.toEqual(serverKeyB);
  });

  it('staleTime도 서버·클라이언트가 동일하다(S-8 — 3_600_000, 리터럴 단언)', () => {
    const clientOptions = playerQueries.list(rosterListQuery(2026));
    const serverOptions = playerServerQueries.list(2026);

    expect(clientOptions.staleTime).toBe(3_600_000);
    expect(serverOptions.staleTime).toBe(3_600_000);
  });
});
