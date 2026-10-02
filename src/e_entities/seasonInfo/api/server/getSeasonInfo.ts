// 서버 전용. 클라이언트 모듈에서 import 금지.
// S-3(decision-1.md §1) 3계층 캐시 경계 — 참조 구현을 그대로 따른다.
// A-8: season 값의 단일 출처. 호출 지점은 SeasonPage 한 곳뿐이며(D-14 — 패널은
// props로 받는다) 그 1회성이 코드 구조로 보장된다. cache() 래핑은 유지한다 —
// 복구 경로(readCurrentSeasonFresh)가 있는 함수라 호출 지점이 다시 늘면 조용한
// 부하 증가가 되기 때문이다(S2-4).
import { cacheLife } from 'next/cache';
import { cache } from 'react';

import { getCurrentSeason } from './fetchCurrentSeason';
import type { CurrentSeasonDTO } from '@entities/seasonInfo/model';
import {
  formatSeasonLabel,
  resolveSeasonStatus,
  type SeasonStatus,
} from '@entities/seasonInfo/utils';
import {
  FALLBACK_SEASON_START_YEAR,
  FALLBACK_SEASON_STARTED,
  RECOVERY_LOG_PREFIX,
  SEASON_CACHE_PROFILE,
} from '@entities/seasonInfo/configs';

interface SeasonInfo {
  startYear: number;
  label: string;
  status: SeasonStatus;
}

type CacheOutcome<T> = { ok: true; data: T } | { ok: false };

/** 캐시 경계(1h). 실패도 값으로 반환한다 — 절대 throw하지 않는다(S-3a). */
const readCurrentSeasonCached = async (): Promise<
  CacheOutcome<CurrentSeasonDTO>
> => {
  'use cache';
  try {
    cacheLife(SEASON_CACHE_PROFILE); // S-3a: 디렉티브와 try 사이에 실행문 금지
    const result = await getCurrentSeason();
    return result.isSuccess ? { ok: true, data: result.data } : { ok: false };
  } catch {
    // serverFetcher(AbortController 타임아웃) 또는 cacheLife(프로파일 미설정)가
    // throw할 수 있다. 원인은 복구 경로 진입 시 아래 console.warn으로 관측된다(S-3c).
    return { ok: false };
  }
};

/** 캐시 밖 복구 조회. 캐시된 실패가 사용자에게 고착되지 않게 한다(S-3c). */
const readCurrentSeasonFresh = async (): Promise<CurrentSeasonDTO | null> => {
  try {
    const result = await getCurrentSeason();
    return result.isSuccess ? result.data : null;
  } catch {
    return null;
  }
};

const toSeasonInfo = (dto: CurrentSeasonDTO): SeasonInfo => ({
  startYear: dto.season,
  label: formatSeasonLabel(dto.season),
  status: resolveSeasonStatus(dto.started),
});

const FALLBACK_SEASON_INFO: SeasonInfo = {
  startYear: FALLBACK_SEASON_START_YEAR,
  label: formatSeasonLabel(FALLBACK_SEASON_START_YEAR),
  status: resolveSeasonStatus(FALLBACK_SEASON_STARTED),
};

const getSeasonInfo = cache(async (): Promise<SeasonInfo> => {
  const cached = await readCurrentSeasonCached();
  if (cached.ok) return toSeasonInfo(cached.data);

  console.warn(`${RECOVERY_LOG_PREFIX} getSeasonInfo`);
  const fresh = await readCurrentSeasonFresh();
  return fresh ? toSeasonInfo(fresh) : FALLBACK_SEASON_INFO;
});

export { getSeasonInfo, type SeasonInfo };
