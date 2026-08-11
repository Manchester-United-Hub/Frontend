import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

import { usePLRankList } from '@features/rank/api';
import { Shell, StateBox } from '@shared/ui';

import { PanelHead } from '../PanelHead';
import { StandingsTable } from './StandingsTable';
import { ZoneLegend } from './ZoneLegend';
import { StandingSkeleton } from './StandingSkeleton';

const ERROR_ICON = <AlertTriangle size={22} aria-hidden="true" />;

interface StandingsTabProps {
  season: string;
}

export function StandingsTab({ season }: StandingsTabProps) {
  const PANEL_DESCRIPTION = `${season} 시즌 프리미어리그 20개 클럽의 순위와 최근 5경기 폼을 확인하세요.`;
  const { isLoading, data, error } = usePLRankList();

  let body: ReactNode;

  if (isLoading) {
    body = <StandingSkeleton />;
  } else if (error || !data) {
    body = (
      <StateBox
        className="min-h-80"
        variant="error"
        icon={ERROR_ICON}
        title="시즌 순위표를 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요."
      />
    );
  } else {
    body = (
      <>
        <StandingsTable season={season} standings={data} />
        <div className="mt-5">
          <ZoneLegend />
        </div>
      </>
    );
  }

  return (
    <Shell className="pb-16 pt-10">
      <PanelHead
        eyebrow="League Table"
        title="순위표"
        description={PANEL_DESCRIPTION}
      />
      {body}
    </Shell>
  );
}
