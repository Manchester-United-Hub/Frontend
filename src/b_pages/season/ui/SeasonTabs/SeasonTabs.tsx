'use client';

import { useState, type ReactNode } from 'react';

import { SubTabId, SubTabNav, subTabs } from '../SubTabNav';

const DEFAULT_TAB_ID: SubTabId = 'matches';

interface SeasonTabsProps {
  matchesPanel: ReactNode;
  standingsPanel: ReactNode;
}

export function SeasonTabs({ matchesPanel, standingsPanel }: SeasonTabsProps) {
  const [activeId, setActiveId] = useState<SubTabId>(DEFAULT_TAB_ID);

  const tabPanels: Record<SubTabId, ReactNode> = {
    matches: matchesPanel,
    table: standingsPanel,
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
        {tabPanels[activeId]}
      </div>
    </>
  );
}
