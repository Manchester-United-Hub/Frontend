import {
  CalendarDays,
  Users,
  Shield,
  Play,
  Newspaper,
  LayoutGrid,
  ShoppingBag,
} from 'lucide-react';

import { CategoryCard, Eyebrow } from '@shared/ui';
import Link from 'next/link';
import { NAV_ITEMS, NavItem } from '@widgets/Navbar/model';

const ICON_SIZE = 20;

const ICON_MAP: Record<string, React.ReactNode> = {
  season: <CalendarDays size={ICON_SIZE} aria-hidden />,
  players: <Users size={ICON_SIZE} aria-hidden />,
  club: <Shield size={ICON_SIZE} aria-hidden />,
  highlights: <Play size={ICON_SIZE} aria-hidden />,
  news: <Newspaper size={ICON_SIZE} aria-hidden />,
  store: <ShoppingBag size={ICON_SIZE} aria-hidden />,
};

const FALLBACK_ICON = <LayoutGrid size={ICON_SIZE} aria-hidden />;

const SECTION_HEADING_ID = 'category-cards-heading';

export function CategoryCardsSection() {
  return (
    <section
      aria-labelledby={SECTION_HEADING_ID}
      className="py-14 max-[620px]:py-11"
    >
      <div className="mx-auto max-w-[1200px] px-6">
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
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {NAV_ITEMS.map((nav: NavItem) => {
            const card = (
              <CategoryCard
                icon={ICON_MAP[nav.id] ?? FALLBACK_ICON}
                name={nav.label}
                nameEn={nav.labelEn}
                description={nav.description}
                className="h-full"
              />
            );

            return (
              <li key={nav.id}>
                {nav.isOuterLink ? (
                  <a href={nav.href} target="_blank" className="block h-full">
                    {card}
                  </a>
                ) : (
                  <Link href={nav.href ?? ''} className="block h-full">
                    {card}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
