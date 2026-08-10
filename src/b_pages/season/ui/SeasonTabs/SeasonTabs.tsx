'use client';

import { useState, type ReactNode } from 'react';

import type { SubTabId } from '../../model';
import { subTabs } from '../../model';
import { MatchesTab } from '../MatchesTab';
import { StandingsTab } from '../StandingsTab';
import { SubTabNav } from '../SubTabNav';

const DEFAULT_TAB_ID: SubTabId = 'matches';

interface SeasonTabsPops {
  season: string;
}

export function SeasonTabs({ season }: SeasonTabsPops) {
  const [activeId, setActiveId] = useState<SubTabId>(DEFAULT_TAB_ID);

  const TAB_PANELS: Record<SubTabId, ReactNode> = {
    matches: <MatchesTab season={season} />,
    table: <StandingsTab season={season} />,
  };
  return (
    <>
      <SubTabNav tabs={subTabs} activeId={activeId} onChange={setActiveId} />
      <div
        id={`panel-${activeId}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeId}`}
        tabIndex={0}
      >
        {TAB_PANELS[activeId]}
      </div>
    </>
  );
}
