import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@shared/utils';

interface CategoryCardProps {
  icon: ReactNode;
  name: string;
  nameEn: string;
  description: string;
  goLabel?: string;
  className?: string;
}

const CategoryCard = ({
  icon,
  name,
  nameEn,
  description,
  goLabel = '바로가기',
  className,
}: CategoryCardProps) => {
  const cardClass = cn(
    'group relative flex min-h-[188px] flex-col justify-between overflow-hidden rounded-lg border border-border bg-card p-5 transition-[box-shadow,transform,border-color] motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:border-[color-mix(in_srgb,var(--united-red)_36%,var(--border))] cursor-pointer',
    className
  );

  return (
    <div className={cardClass}>
      <span className="grid h-10 w-10 place-items-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-united-red group-hover:text-white">
        {icon}
      </span>
      <div className="mt-2 ml-2">
        <div className="text-[17px] font-bold">{name}</div>
        <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {nameEn}
        </div>
        <p className="mt-1.5 text-[13px] leading-[1.45] text-muted-foreground">
          {description}
        </p>
      </div>
      <span className="mt-3.5 ml-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors group-hover:text-united-red">
        {goLabel}
        <ChevronRight size={14} className="shrink-0" aria-hidden />
      </span>
    </div>
  );
};

export { CategoryCard, type CategoryCardProps };
