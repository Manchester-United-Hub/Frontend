import type { ReactNode } from 'react';
import { BarChart3, LayoutGrid, Star, Target, Trophy } from 'lucide-react';

import { Shell } from '@shared/ui';

import type { SeasonSummaryCard } from '../../model';
import { SummaryCard } from './SummaryCard';

// ── 아이콘 매핑 (모듈 스코프 — icon name → lucide ReactNode) ──────────────
// season-data.js SEASON_SUMMARY[].icon 문자열(BarChart3·Star·Target·Trophy)을
// lucide 아이콘으로 치환. clubInfo SummaryCards 선례를 따름.

const ICON_SIZE = 19;

const ICON_MAP: Record<string, ReactNode> = {
  BarChart3: <BarChart3 size={ICON_SIZE} aria-hidden />,
  Star: <Star size={ICON_SIZE} aria-hidden />,
  Target: <Target size={ICON_SIZE} aria-hidden />,
  Trophy: <Trophy size={ICON_SIZE} aria-hidden />,
};

/** 매핑에 없는 icon name에 대한 기본 아이콘 — 빈 슬롯 렌더 방지 */
const FALLBACK_ICON = <LayoutGrid size={ICON_SIZE} aria-hidden />;

export interface SummaryCardsProps {
  summaryCards: SeasonSummaryCard[];
}

/** 시즌 요약 카드 4종 그리드. 4열 → (≤620px) 1열, (620~1024px) 2열. 서버 컴포넌트. */
export function SummaryCards({ summaryCards }: SummaryCardsProps) {
  return (
    <Shell>
      <ul
        role="list"
        aria-label="시즌 요약 정보"
        className="grid grid-cols-1 gap-3.5 pb-2 pt-7 min-[620px]:grid-cols-2 lg:grid-cols-4"
      >
        {summaryCards.map((card) => (
          <li key={card.label}>
            <SummaryCard
              icon={ICON_MAP[card.icon] ?? FALLBACK_ICON}
              label={card.label}
              en={card.en}
              value={card.value}
              sub={card.sub}
            />
          </li>
        ))}
      </ul>
    </Shell>
  );
}
