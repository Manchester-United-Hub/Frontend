import { StandingsTable, ZoneLegend } from '@entities/rank/ui';
import type { Standing } from '@entities/rank/types';
import { PANEL_SHELL_CLASS, PanelHead, Shell } from '@shared/ui';

import { standingsPanelHead } from '../Panel';

interface StandingsTabProps {
  season: string;
  standings: Standing[];
}

// isLoading은 Suspense fallback으로, error는 StandingsPanel의 실패 분기로 이관됐다(S-6).
// 이 컴포넌트는 PanelHead + StandingsTable + ZoneLegend만 렌더한다.
export function StandingsTab({ season, standings }: StandingsTabProps) {
  return (
    <Shell className={PANEL_SHELL_CLASS}>
      <PanelHead {...standingsPanelHead(season)} />
      <StandingsTable season={season} standings={standings} />
      <div className="mt-5">
        <ZoneLegend />
      </div>
    </Shell>
  );
}
