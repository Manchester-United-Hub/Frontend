import { Shell } from '@shared/ui';

import type { HistoryEvent } from '../../model/types';
import { PanelHead } from '../PanelHead';
import { TimelineItem } from './TimelineItem';

// ── 상수 ────────────────────────────────────────────────────────────────

const HEADING_ID = 'club-history-heading';

const PANEL_DESCRIPTION =
  '1878년 철도 노동자들의 팀에서 시작해 잉글랜드와 유럽을 대표하는 구단이 되기까지 — 주요 변곡점을 따라가 봅니다.';

// ── 정적 JSX (props·state 비의존 — 모듈 스코프 호이스팅) ─────────────────

const PANEL_HEAD = (
  <PanelHead eyebrow="Club History" title="연혁" description={PANEL_DESCRIPTION} headingId={HEADING_ID} />
);

// ── 컴포넌트 ─────────────────────────────────────────────────────────────

export interface HistoryTabProps {
  /** 연혁 타임라인 이벤트 (10개). ClubPage가 model/mockData.ts에서 주입. */
  historyEvents: HistoryEvent[];
}

/**
 * 연혁 타임라인 탭 콘텐츠. 정적 데이터 렌더만 하는 서버 컴포넌트.
 * role="tabpanel" 등 탭 전환 관련 접근성 래핑은 ClubTabs(ST-009)가 담당한다.
 */
export function HistoryTab({ historyEvents }: HistoryTabProps) {
  return (
    <Shell className="pt-10 pb-16">
      {PANEL_HEAD}
      <ol className="relative max-w-[760px] pl-2" aria-labelledby={HEADING_ID}>
        {/* 세로 연결선 — 장식 요소 */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-[71px] w-0.5 bg-border"
        />
        {historyEvents.map((event) => (
          <TimelineItem key={event.year} event={event} />
        ))}
      </ol>
    </Shell>
  );
}
