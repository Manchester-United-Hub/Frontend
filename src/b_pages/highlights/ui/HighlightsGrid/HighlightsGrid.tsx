import { Play } from 'lucide-react';

import type { HighlightItem } from '@pages/highlights/model';
import { StateBox } from '@shared/ui';

import { HighlightCard } from '../HighlightCard';

/**
 * 하이라이트 카드 그리드 폭 — 기본 3열 → (≤900px) 2열 → (≤600px) 1열.
 * HighlightsSkeleton이 로딩 상태에서 동일 폭을 유지하도록 이 클래스를 재노출해 공유한다(NewsGrid 미러).
 */
export const HIGHLIGHTS_GRID_CLASSNAME =
  'grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1';

export interface HighlightsGridProps {
  items: HighlightItem[];
}

/** 하이라이트 카드 그리드 — 빈 배열이면 StateBox 빈 상태를 렌더한다. */
function HighlightsGrid({ items }: HighlightsGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border">
        <StateBox
          className="py-[72px]"
          variant="empty"
          icon={<Play size={24} aria-hidden="true" />}
          title="해당 카테고리 영상이 없어요"
          description="다른 카테고리를 선택해 보세요."
        />
      </div>
    );
  }

  return (
    <ul role="list" className={HIGHLIGHTS_GRID_CLASSNAME}>
      {items.map((item) => (
        <li key={item.id}>
          <HighlightCard
            title={item.title}
            category={item.category}
            competition={item.competition}
            date={item.date}
            views={item.views}
            duration={item.duration}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  );
}

export { HighlightsGrid };
