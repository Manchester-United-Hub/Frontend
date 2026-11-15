import { cn } from '@shared/utils';
import { NavItem } from '../model';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';

interface NavLinkItemProps {
  item: NavItem;
  isMatchLive?: boolean;
}

function NavLinkItem({ item, isMatchLive = false }: NavLinkItemProps) {
  const shouldShowLiveDot = Boolean(item.hasLiveIndicator) && isMatchLive;
  const cls = cn(
    'relative inline-flex flex-col items-center',
    'px-3 py-2 rounded-md text-sm font-medium text-foreground',
    'hover:bg-accent transition-colors'
  );
  const sublabel = (
    <span className="text-[9px] tracking-widest uppercase text-muted-foreground mt-0.5">
      {item.labelEn}
    </span>
  );
  if (item.isOuterLink) {
    return (
      <a href={item.href} className={cls} target="_blank" rel="noreferrer">
        <p className="flex items-center gap-1">
          <span>{item.label}</span>
          <SquareArrowOutUpRight width={8} height={8} />
        </p>
        {sublabel}
      </a>
    );
  }

  return (
    <Link href={item.href} className={cls}>
      <span className="inline-flex items-center gap-1.5">
        {shouldShowLiveDot ? (
          <span
            role="img"
            aria-label="경기 진행 중"
            className="h-1.5 w-1.5 rounded-full bg-united-red motion-safe:animate-pulse"
          />
        ) : null}
        {item.label}
      </span>
      {sublabel}
    </Link>
  );
}

export { NavLinkItem, type NavLinkItemProps };
