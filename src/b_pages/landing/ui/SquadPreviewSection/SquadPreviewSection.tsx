import { ArrowRight, Inbox } from 'lucide-react';

import { Eyebrow, PlayerCard, StateBox } from '@shared/ui';
import { RosterErrorState } from '@features/player/ui';
import type { PlayerListItem } from '@entities/player/model';
import { PlayerCardSkeleton } from './PlayerCardSkeleton';

// ── 상수 (모듈 스코프) ────────────────────────────────────────────────────

const SECTION_HEADING_ID = 'squad-heading';

// ── 상태별 정적 JSX (props·state 비의존 → 모듈 스코프 호이스팅) ──────────

const LOADING_GRID = (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
  </div>
);

const EMPTY_BOX = (
  <StateBox
    variant="empty"
    icon={<Inbox size={22} aria-hidden />}
    title="등록된 선수가 없어요"
    description="시즌 명단이 확정되면 여기에 표시됩니다."
  />
);

// ── 섹션 헤더 (정적 — 모듈 스코프 호이스팅) ─────────────────────────────

const SECTION_HEADER = (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div>
      <Eyebrow>First Team</Eyebrow>
      <h2
        id={SECTION_HEADING_ID}
        className="mt-1.5 text-[28px] font-bold leading-[1.1] tracking-[-0.02em]"
      >
        1군 스쿼드
      </h2>
    </div>
    {/* 유효 라우트 미존재 → 비링크(span) 처리 (ADR-7) */}
    <span className="inline-flex cursor-default items-center gap-1.5 text-sm font-medium text-muted-foreground">
      역대 선수 목록
      <ArrowRight size={16} aria-hidden />
    </span>
  </div>
);

// ── 컴포넌트 ─────────────────────────────────────────────────────────────

export type SquadPreviewStatus = 'ready' | 'loading' | 'error' | 'empty';

export interface SquadPreviewSectionProps {
  /**
   * 상태 분기 prop. 컨테이너에서 주입.
   * 기본값: 'ready'.
   */
  status?: SquadPreviewStatus;
  players: PlayerListItem[];
  /** 에러 상태에서 "다시 시도" 클릭 시 호출. */
  onRetry?: () => void;
}

/** 1군 스쿼드 프리뷰. status prop으로 상태를 분기한다. */
export function SquadPreviewSection({
  status = 'ready',
  players,
  onRetry,
}: SquadPreviewSectionProps) {
  return (
    <section
      aria-labelledby={SECTION_HEADING_ID}
      className="py-14 max-[620px]:py-11"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {SECTION_HEADER}
        {status === 'loading' ? LOADING_GRID : null}
        {status === 'empty' ? EMPTY_BOX : null}
        {status === 'error' ? <RosterErrorState onRetry={onRetry} /> : null}
        {status === 'ready' ? (
          <ul
            role="list"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {players.map((player) => (
              <li key={player.id}>
                <PlayerCard
                  name={player.name}
                  nameEn={player.nameEn}
                  position={player.position ?? '-'}
                  number={player.number}
                  status={player.status}
                  meta={player.years || undefined}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
