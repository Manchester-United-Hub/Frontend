// 서버 전용. 클라이언트 모듈에서 import 금지.
// 'use cache' 없음 — 매 요청 신선(요구사항 3의 SSR 대상). connection()은 여기가 아니라
// SchedulePanel(ST-05)에서 호출한다 — 이 함수는 요청 컨텍스트 없이 단위 테스트 가능해야 한다(S-16).
// ST-01 V9 PASS: 'use cache' 없는 서버 fetch는 Next 16 기본값으로 매 요청 신선하다.
import { fetchMatchScheduleList } from '@entities/matches/api/server';
import type { Match } from '@entities/matches/types';
import { convertMatchesDTO2DAO } from '@entities/matches/utils';

const getSchedule = async (
  seasonStartYear: number
): Promise<Match[] | null> => {
  try {
    const result = await fetchMatchScheduleList({
      season: String(seasonStartYear),
    });
    return result.isSuccess ? convertMatchesDTO2DAO(result.data) : null;
  } catch {
    // serverFetcher(AbortController 타임아웃)가 throw할 수 있다. 'use cache' 경계가
    // 없는 평범한 함수라 일반 try/catch가 정상 동작한다(ST-01 V8 대조군 실측 확인).
    return null;
  }
};

export { getSchedule };
