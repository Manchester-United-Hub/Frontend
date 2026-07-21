'use client';

import { useState, type ReactNode } from 'react';

import type { SubTabId } from '../../model';
import { subTabs } from '../../model';
import { MatchesTab } from '../MatchesTab';
import { StandingsTab } from '../StandingsTab';
import { SubTabNav } from '../SubTabNav';

const DEFAULT_TAB_ID: SubTabId = 'matches';

/**
 * 탭 id → 패널 콘텐츠 매핑(스위치 남발 금지). MatchesTab/StandingsTab 둘 다
 * 정적 mockData만 소비하므로 컴포넌트 밖 모듈 스코프에서 한 번만 생성한다
 * (§code-conventions 2 — clubInfo ClubTabs의 TAB_PANELS 선례).
 */
const TAB_PANELS: Record<SubTabId, ReactNode> = {
  matches: <MatchesTab />,
  table: <StandingsTab />,
};

/**
 * SeasonTabs — 시즌 페이지의 서브탭 컨테이너(일정 & 결과 / 순위표). 활성 탭 id를
 * 소유하는 유일한 클라이언트 상태 지점이다. clubInfo `ui/ClubTabs`를 그대로
 * 미러링했다(plan.md). 접근성 계약: SubTabNav의 각 탭 버튼은 `id="tab-{id}"`·
 * `aria-controls="panel-{id}"`를 갖는다. 이 tabpanel은 그 짝으로
 * `id="panel-{id}"`·`aria-labelledby="tab-{id}"`를 부여한다.
 */
export function SeasonTabs() {
  const [activeId, setActiveId] = useState<SubTabId>(DEFAULT_TAB_ID);

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
