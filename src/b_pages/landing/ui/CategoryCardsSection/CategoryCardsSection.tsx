import { CalendarDays, Users, Shield, Play, Newspaper } from 'lucide-react';

import { CategoryCard, Eyebrow } from '@shared/ui';
import type { CategoryItem } from '../../model/types';

// ── 아이콘 매핑 (모듈 스코프 — key → lucide ReactNode) ──────────────────

const ICON_SIZE = 20;

const ICON_MAP: Record<string, React.ReactNode> = {
  season: <CalendarDays size={ICON_SIZE} aria-hidden />,
  players: <Users size={ICON_SIZE} aria-hidden />,
  club: <Shield size={ICON_SIZE} aria-hidden />,
  highlights: <Play size={ICON_SIZE} aria-hidden />,
  articles: <Newspaper size={ICON_SIZE} aria-hidden />,
};

const SECTION_HEADING_ID = 'category-cards-heading';

// ── 컴포넌트 ─────────────────────────────────────────────────────────────

export interface CategoryCardsSectionProps {
  categories: CategoryItem[];
}

export function CategoryCardsSection({ categories }: CategoryCardsSectionProps) {
  return (
    <section
      aria-labelledby={SECTION_HEADING_ID}
      className="py-14 max-[620px]:py-11"
    >
      <div className="mx-auto max-w-300 px-6">
        {/* 섹션 헤더 */}
        <div className="mb-6">
          <Eyebrow>Explore the Hub</Eyebrow>
          <h2
            id={SECTION_HEADING_ID}
            className="mt-1.5 text-[28px] font-bold leading-[1.1] tracking-[-0.02em]"
          >
            무엇을 찾고 있나요?
          </h2>
        </div>
        <ul
          role="list"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {categories.map((cat: CategoryItem) => (
            <li key={cat.key}>
              <CategoryCard
                icon={ICON_MAP[cat.key]}
                name={cat.name}
                nameEn={cat.nameEn}
                description={cat.description}
                href={cat.href}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
