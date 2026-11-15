import type { HighlightItem } from '@pages/highlights/model';

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

/** 하이라이트 카드 그리드. 빈 목록 처리는 호출하는 쪽(HighlightsContent)이 맡는다. */
function HighlightsGrid({ items }: HighlightsGridProps) {
  return (
    <ul role="list" className={HIGHLIGHTS_GRID_CLASSNAME}>
      {items.map((item) => (
        <li key={item.id}>
          <HighlightCard
            title={item.title}
            thumbnailUrl={item.thumbnailUrl}
            date={item.date}
            views={item.views}
            watchUrl={item.watchUrl}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  );
}

export { HighlightsGrid };
