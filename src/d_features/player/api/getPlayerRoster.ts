// 서버 전용. 클라이언트 모듈에서 import 금지.
// A-6/S-7 — getStandings.ts·getSeasonInfo.ts와 동일한 3계층 캐시 경계 형태를 그대로 따른다.
import { cacheLife } from 'next/cache';
import { cache } from 'react';

import { fetchPlayerList } from '@entities/player/api/server';
import type { PlayerListQueryDTO, PlyaerListDTO } from '@entities/player/model';
import { RECOVERY_LOG_PREFIX, SEASON_CACHE_PROFILE } from '@entities/seasonInfo/configs';

type CacheOutcome<T> = { ok: true; data: T } | { ok: false };

/** 캐시 경계(1h, SEASON_CACHE_PROFILE 재사용). 실패도 값으로 반환한다 — 절대 throw하지 않는다(S-3a). */
const readPlayerRosterCached = async (
  query: PlayerListQueryDTO
): Promise<CacheOutcome<PlyaerListDTO>> => {
  'use cache';
  try {
    cacheLife(SEASON_CACHE_PROFILE); // S-3a: 디렉티브와 try 사이에 실행문 금지
    const result = await fetchPlayerList(query);
    return result.isSuccess ? { ok: true, data: result.data } : { ok: false };
  } catch {
    // serverFetcher(AbortController 타임아웃) 또는 cacheLife(프로파일 미설정)가
    // throw할 수 있다. 원인은 복구 경로 진입 시 아래 console.warn으로 관측된다(S-3c).
    return { ok: false };
  }
};

/** 캐시 밖 복구 조회. 캐시된 실패가 사용자에게 고착되지 않게 한다(S-3c). */
const readPlayerRosterFresh = async (
  query: PlayerListQueryDTO
): Promise<PlyaerListDTO | null> => {
  try {
    const result = await fetchPlayerList(query);
    return result.isSuccess ? result.data : null;
  } catch {
    return null;
  }
};

/**
 * 실패는 null로 반환한다(폴백 값을 만들지 않는다 — 선수 명단은 시즌 정보와 달리 대체할
 * 기본값이 없다). playerServerQueries가 null에서 throw해 prefetchQuery가 아무 값도 캐시하지
 * 않게 하고, 클라이언트가 마운트 후 기존 BFF 경로로 이어받는다(graceful degradation).
 */
const getPlayerRoster = cache(
  async (query: PlayerListQueryDTO): Promise<PlyaerListDTO | null> => {
    const cached = await readPlayerRosterCached(query);
    if (cached.ok) return cached.data;

    console.warn(`${RECOVERY_LOG_PREFIX} getPlayerRoster`);
    return await readPlayerRosterFresh(query);
  }
);

export { getPlayerRoster };
