import { ReactNode } from 'react';

import { cn } from '@shared/utils';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

const Eyebrow = ({ children, className }: EyebrowProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground',
        className
      )}
    >
      <span className="h-0.5 w-4.5 rounded-sm bg-united-red" />
      {children}
    </span>
  );
};

export { Eyebrow, type EyebrowProps };
