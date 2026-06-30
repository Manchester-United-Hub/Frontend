import { ArrowRight } from 'lucide-react';

import { Eyebrow, PlayerCard } from '@shared/ui';
import type { PlayerItem } from '../../model/types';

// ── 상수 (모듈 스코프) ────────────────────────────────────────────────────

const SECTION_HEADING_ID = 'squad-heading';

// ── 컴포넌트 ─────────────────────────────────────────────────────────────

export interface SquadPreviewSectionProps {
  players: PlayerItem[];
}

export function SquadPreviewSection({ players }: SquadPreviewSectionProps) {
  return (
    <section
      aria-labelledby={SECTION_HEADING_ID}
      className="py-14 max-[620px]:py-11"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {/* 섹션 헤더 */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>First Team &amp; Legends</Eyebrow>
            <h2
              id={SECTION_HEADING_ID}
              className="mt-1.5 text-[28px] font-bold leading-[1.1] tracking-[-0.02em]"
            >
              스쿼드 &amp; 레전드
            </h2>
          </div>
          {/* 유효 라우트 미존재 → 비링크(span) 처리 (ADR-7) */}
          <span className="inline-flex cursor-default items-center gap-1.5 text-sm font-medium text-muted-foreground">
            역대 선수 목록
            <ArrowRight size={16} aria-hidden />
          </span>
        </div>

        {/* 선수 그리드
            데스크탑(lg 1024px+): 4열
            태블릿(sm 640px+):   3열  ← 디자인 기준 620px에 근접
            모바일(기본):         2열  ← 디자인 기준 620px 이하 */}
        <ul
          role="list"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {players.map((player: PlayerItem) => (
            <li key={player.nameEn}>
              <PlayerCard
                name={player.name}
                nameEn={player.nameEn}
                position={`${player.position} · ${player.number}`}
                status={player.status}
                meta={player.status === 'active' ? '현재 소속' : player.years}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
