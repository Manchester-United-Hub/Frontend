import { fetchCoach } from '@entities/coach/api/server';
import { MANCHESTER_UNITED_TEAM_ID } from '@entities/coach/configs';

import { mapCoachToManager } from '../model/mapCoachToManager';
import type { Manager } from '../model/types';

/** 감독 API 실패(비정상 응답·계약 불일치·타임아웃 throw)는 모두 null로 흡수한다(설계 D-2·D-8). */
const loadManager = async (): Promise<Manager | null> => {
  try {
    const result = await fetchCoach(MANCHESTER_UNITED_TEAM_ID);
    return result.isSuccess ? mapCoachToManager(result.data) : null;
  } catch {
    return null;
  }
};

export { loadManager };
