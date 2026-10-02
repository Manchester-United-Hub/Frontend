import { ArrowRight } from 'lucide-react';

import { Eyebrow } from '@shared/ui';
import type { MatchItem, MatchStripStatus } from '../../model/types';
import { ERROR_BOX, MATCHES_EMPTY_BOX } from '../matchStates';
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
  /** 최근 경기 데이터. status가 'ready'가 아니거나 데이터가 없으면 undefined(ST-006). */
  recent?: MatchItem;
  /** 다음 경기 데이터. status가 'ready'가 아니거나 데이터가 없으면 undefined(ST-006). */
  next?: MatchItem;
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
        {status === 'empty' ? MATCHES_EMPTY_BOX : null}
        {status === 'error' ? ERROR_BOX : null}
        {status === 'ready' ? <MatchStripGrid recent={recent} next={next} /> : null}
      </div>
    </section>
  );
}
