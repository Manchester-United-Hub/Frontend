import { Trophy } from 'lucide-react';

import { Badge, Card } from '@shared/ui';
import { cn } from '@shared/utils';
import type { HistoryEvent } from '../../model/types';

// ── 상수 ────────────────────────────────────────────────────────────────

const TROPHY_ICON_SIZE = 15;

// ── 컴포넌트 ─────────────────────────────────────────────────────────────

export interface TimelineItemProps {
  event: HistoryEvent;
}

/**
 * 연혁 타임라인의 단일 항목(연도 + 노드 dot + 카드).
 * 세로 연결선은 부모(HistoryTab)의 `<ol>`이 그린다 — 이 컴포넌트는 노드 dot만 담당.
 */
export function TimelineItem({ event }: TimelineItemProps) {
  const { year, title, desc, tag, trophy, now } = event;

  const dotClassName = now
    ? 'border-united-red bg-united-red shadow-[0_0_0_4px_color-mix(in_srgb,var(--united-red)_18%,transparent)]'
    : trophy
      ? 'border-draw bg-draw'
      : 'border-muted-foreground bg-background';

  const cardBorderClassName = now
    ? 'border-[color-mix(in_srgb,var(--united-red)_40%,var(--border))]'
    : 'border-border';

  return (
    <li className="relative grid grid-cols-[56px_1fr] gap-7 pb-[26px]">
      <div
        className={`pt-px text-right text-base font-extrabold tracking-[-0.01em] ${
          now ? 'text-united-red' : 'text-foreground'
        }`}
      >
        {year}
      </div>
      {/* 타임라인 노드 — 장식 요소, 콘텐츠 없음 */}
      <span
        aria-hidden
        className={`absolute left-16 top-1 z-[1] h-4 w-4 rounded-full border-2 ${dotClassName}`}
      />
      <Card
        padding="none"
        hover
        className={cn(
          'px-[18px] py-4 transition-[box-shadow,transform] duration-150 ease-out hover:translate-x-0.5',
          cardBorderClassName,
        )}
      >
        <div className="mb-1.5 flex items-center gap-2">
          {trophy ? <Trophy size={TROPHY_ICON_SIZE} className="text-draw" aria-hidden /> : null}
          {now ? <Badge variant="live">현재</Badge> : <Badge variant="soft">{tag}</Badge>}
        </div>
        <h3 className="m-0 text-base font-bold">{title}</h3>
        <p className="m-0 mt-0 text-sm leading-[1.5] text-muted-foreground">{desc}</p>
      </Card>
    </li>
  );
}
