import { ReactNode } from 'react';
import Link from 'next/link';
import { Route } from 'next';

import { cn } from '@shared/utils';

interface CategoryCardProps {
  icon: ReactNode;
  name: string;
  nameEn: string;
  description: string;
  /** When provided the whole card becomes a link. */
  href?: Route;
  goLabel?: string;
  className?: string;
}

const ChevronRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const CategoryCard = ({
  icon,
  name,
  nameEn,
  description,
  href,
  goLabel = '바로가기',
  className,
}: CategoryCardProps) => {
  const cardClass = cn(
    'group relative flex min-h-[188px] cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-5 transition-[box-shadow,transform,border-color] hover:-translate-y-0.5 hover:shadow-md hover:border-[color-mix(in_srgb,var(--united-red)_36%,var(--border))]',
    className,
  );

  const content = (
    <>
      <span className="grid h-10 w-10 place-items-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-united-red group-hover:text-white">
        {icon}
      </span>
      <div>
        <div className="text-[17px] font-bold">{name}</div>
        <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {nameEn}
        </div>
        <p className="mt-1.5 text-[13px] leading-[1.45] text-muted-foreground">
          {description}
        </p>
      </div>
      <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors group-hover:text-united-red">
        {goLabel}
        <ChevronRight />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
};

export { CategoryCard, type CategoryCardProps };
