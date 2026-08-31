// 서버 전용. connection() 등 request-time API 호출 금지 — SchedulePanel 전용이다(S-4).
import { AlertTriangle } from 'lucide-react';

import { getStandings } from '@features/rank/api';
import { Shell, StateBox } from '@shared/ui';

import { StandingsTab } from '../StandingsTab';

const ERROR_ICON = <AlertTriangle size={22} aria-hidden="true" />;

export interface StandingsPanelProps {
  seasonLabel: string;
  seasonStartYear: number;
}

/**
 * StandingsPanel — 데이터 조회 + 실패 분기만 책임진다(S-5). 정상 마크업은 StandingsTab이
 * 그대로 갖는다. season은 SeasonPage에서 props로 받고(D-14), standings만 이
 * 패널이 조회한다. standings의 캐시는 getStandings 내부의 readStandingsCached
 * ('use cache')가 걸고, 요청 단위 중복 제거는 getStandings의 React cache()가
 * 담당한다 — 이 컴포넌트 자체는 캐시하지 않는다.
 */
export async function StandingsPanel({
  seasonLabel,
  seasonStartYear,
}: StandingsPanelProps) {
  const standings = await getStandings(seasonStartYear);

  if (standings === null) {
    return (
      <Shell className="pb-16 pt-10">
        <StateBox
          className="min-h-80"
          variant="error"
          icon={ERROR_ICON}
          title="시즌 순위표를 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
        />
      </Shell>
    );
  }

  return <StandingsTab season={seasonLabel} standings={standings} />;
}
