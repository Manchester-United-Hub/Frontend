'use client';

import { useState, type ReactNode } from 'react';

import type { SubTabId } from '../../model/types';
import {
  emptyTabCopy,
  historyEvents,
  manager,
  stadium,
  subTabs,
} from '../../model/mockData';
import { EmptyTab } from '../EmptyTab';
import { HistoryTab } from '../HistoryTab';
import { ManagerTab } from '../ManagerTab';
import { SquadTab } from '../SquadTab';
import { StadiumTab } from '../StadiumTab';
import { SubTabNav } from '../SubTabNav';

// ── 상수 ────────────────────────────────────────────────────────────────

const DEFAULT_TAB_ID: SubTabId = 'history';

/** "준비 중" 탭 라벨 — subTabs(단일 소스)에서 파생, 하드코딩 중복 금지. */
const HIGHLIGHTS_LABEL =
  subTabs.find((tab) => tab.id === 'highlights')?.kr ?? '하이라이트';
const STATS_LABEL = subTabs.find((tab) => tab.id === 'stats')?.kr ?? '팀통계';

/**
 * 탭 id → 패널 콘텐츠 매핑(스위치 남발 금지, README §JS 패턴). 각 값은 정적
 * mockData만 소비하므로 컴포넌트 밖 모듈 스코프에서 한 번만 생성한다(§code-conventions 2).
 * SquadTab은 자체적으로 model을 import하는 기존 선례(내부 포메이션 상태 전용)를 유지하고,
 * 나머지 탭은 이 컨테이너가 데이터를 주입한다.
 */
const TAB_PANELS: Record<SubTabId, ReactNode> = {
  history: <HistoryTab historyEvents={historyEvents} />,
  highlights: (
    <EmptyTab label={HIGHLIGHTS_LABEL} copy={emptyTabCopy.highlights} />
  ),
  squad: <SquadTab />,
  manager: <ManagerTab manager={manager} />,
  stadium: <StadiumTab stadium={stadium} />,
  stats: <EmptyTab label={STATS_LABEL} copy={emptyTabCopy.stats} />,
};

// ── 컴포넌트 ─────────────────────────────────────────────────────────────

/**
 * ClubTabs — 구단 정보 페이지의 서브탭 컨테이너. 활성 탭 id를 소유하는 유일한
 * 클라이언트 상태 지점이다. SubTabNav에 activeId/onChange를 주입하고, 활성 탭에
 * 대응하는 패널을 role="tabpanel" 래퍼로 감싸 렌더링한다.
 *
 * 접근성 계약: SubTabNav의 각 탭 버튼은 `id="tab-{id}"`·`aria-controls="panel-{id}"`를
 * 갖는다(SubTabNav.tsx). 이 tabpanel은 그 짝으로 `id="panel-{id}"`·
 * `aria-labelledby="tab-{id}"`를 부여한다.
 */
export function ClubTabs() {
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
