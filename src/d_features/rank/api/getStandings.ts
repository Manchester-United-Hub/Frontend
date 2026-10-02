import { cacheLife } from 'next/cache';
import { cache } from 'react';

import { getPremierLeagueRank } from '@entities/rank/api/server';
import type { PLRankDTO, Standing } from '@entities/rank/types';
import { convertPLRankDTO2DAO } from '@entities/rank/utils';
import {
  CONVERT_LOG_PREFIX,
  RECOVERY_LOG_PREFIX,
  SEASON_CACHE_PROFILE,
} from '@entities/seasonInfo/configs';

type CacheFailureReason = 'read' | 'convert';
type CacheOutcome<T> =
  | { ok: true; data: T }
  | { ok: false; reason: CacheFailureReason };

const toStandingsOutcome = (dto: PLRankDTO): CacheOutcome<Standing[]> => {
  try {
    return { ok: true, data: convertPLRankDTO2DAO(dto) };
  } catch {
    // form에 W/D/L 외 문자가 있으면 throw. 조회는 정상이므로 'read'가 아니다.
    return { ok: false, reason: 'convert' };
  }
};

const readStandingsCached = async (
  seasonStartYear: number
): Promise<CacheOutcome<Standing[]>> => {
  'use cache';
  try {
    cacheLife(SEASON_CACHE_PROFILE); // S-3a: 디렉티브와 try 사이에 실행문 금지
    const result = await getPremierLeagueRank({ season: seasonStartYear });
    if (!result.isSuccess) return { ok: false, reason: 'read' };
    return toStandingsOutcome(result.data);
  } catch (e) {
    console.warn(e);
    return { ok: false, reason: 'read' };
  }
};

const readStandingsFresh = async (
  seasonStartYear: number
): Promise<Standing[] | null> => {
  try {
    const result = await getPremierLeagueRank({ season: seasonStartYear });
    if (!result.isSuccess) return null;
    const outcome = toStandingsOutcome(result.data);
    return outcome.ok ? outcome.data : null;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

const getStandings = cache(
  async (seasonStartYear: number): Promise<Standing[] | null> => {
    const cached = await readStandingsCached(seasonStartYear);
    if (cached.ok) return cached.data;

    // 사유별 접두사(M-5). [season-cache-recovery]는 "캐시 계층 고장" 신호로만 남긴다(R-3b).
    // 변환 실패에도 재조회는 수행한다 — 업스트림 응답이 고쳐지면 그것이 유일한 자가 복구 경로다.
    const prefix =
      cached.reason === 'convert' ? CONVERT_LOG_PREFIX : RECOVERY_LOG_PREFIX;
    console.warn(`${prefix} getStandings`);
    return await readStandingsFresh(seasonStartYear);
  }
);

export { getStandings };
