import { cn } from '@shared/utils';
import { NavItem } from '../model';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';

interface NavLinkItemProps {
  item: NavItem;
}

function NavLinkItem({ item }: NavLinkItemProps) {
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
      {item.label}
      {sublabel}
    </Link>
  );
}

export { NavLinkItem, type NavLinkItemProps };
