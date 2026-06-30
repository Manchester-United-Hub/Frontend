import { cn } from '@shared/utils';
import { NavItem } from '../model';
import Link from 'next/link';

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
  if (item.href) {
    return (
      <Link href={item.href} className={cls}>
        {item.label}
        {sublabel}
      </Link>
    );
  }
  return (
    <span className={cls}>
      {item.label}
      {sublabel}
    </span>
  );
}

export { NavLinkItem, type NavLinkItemProps };
