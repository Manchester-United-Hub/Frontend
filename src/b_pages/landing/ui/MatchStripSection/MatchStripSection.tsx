import { AlertTriangle, ArrowRight, Inbox } from 'lucide-react';

import { Eyebrow, StateBox } from '@shared/ui';
import type { MatchItem, MatchStripStatus } from '../../model/types';
import { MatchCardSkeleton } from './MatchCardSkeleton';
import { MatchStripGrid } from './MatchStripGrid';

// ── 상수 ────────────────────────────────────────────────────────────────

const HEADING_ID = 'match-strip-heading';

// ── 상태별 정적 JSX (props·state 비의존 → 모듈 스코프 호이스팅) ──────────

const LOADING_GRID = (
  <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
    <MatchCardSkeleton />
    <MatchCardSkeleton />
  </div>
);

const EMPTY_BOX = (
  <StateBox
    variant="empty"
    icon={<Inbox size={22} aria-hidden />}
    title="예정된 경기가 없어요"
    description="시즌 휴식기입니다. 일정이 확정되면 여기에 표시됩니다."
  />
);

const ERROR_BOX = (
  <StateBox
    variant="error"
    icon={<AlertTriangle size={22} aria-hidden />}
    title="경기 정보를 불러오지 못했어요"
    description="일시적인 연결 문제입니다. 사용자 탓이 아니에요 — 잠시 후 다시 시도해 주세요."
  />
);

// ── 섹션 헤더 (정적 — 모듈 스코프 호이스팅) ─────────────────────────────

const SECTION_HEADER = (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div>
      <Eyebrow>Matches &amp; Results</Eyebrow>
      <h2
        id={HEADING_ID}
        className="mt-1.5 text-[28px] font-bold leading-[1.1] tracking-[-0.02em]"
      >
        최근 경기 &amp; 다음 경기
      </h2>
    </div>
    {/* 유효 라우트 미존재 → 비링크(span) 처리 (ADR-7) */}
    <span className="inline-flex cursor-default items-center gap-1.5 text-sm font-medium text-muted-foreground">
      전체 일정
      <ArrowRight size={16} aria-hidden />
    </span>
  </div>
);

// ── 섹션 컴포넌트 ──────────────────────────────────────────────────────

export interface MatchStripSectionProps {
  /**
   * 상태 분기 prop. LandingPage에서 주입 (ADR-4/5).
   * 기본값: 'ready'.
   */
  status?: MatchStripStatus;
  /** 최근 경기 데이터 (LandingPage에서 주입) */
  recent: MatchItem;
  /** 다음 경기 데이터 (LandingPage에서 주입) */
  next: MatchItem;
}

/** 최근 경기 + 다음 경기 스트립. status prop으로 상태를 분기한다. */
export function MatchStripSection({
  status = 'ready',
  recent,
  next,
}: MatchStripSectionProps) {
  return (
    <section aria-labelledby={HEADING_ID} className="py-14 max-[620px]:py-11">
      <div className="mx-auto max-w-[1200px] px-6">
        {SECTION_HEADER}
        {status === 'loading' ? LOADING_GRID : null}
        {status === 'empty' ? EMPTY_BOX : null}
        {status === 'error' ? ERROR_BOX : null}
        {status === 'ready' ? (
          <MatchStripGrid recent={recent} next={next} />
        ) : null}
      </div>
    </section>
  );
}
