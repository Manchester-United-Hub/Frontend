import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 h-[22px] px-[9px] rounded-md border text-xs font-semibold leading-none',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        soft: 'bg-muted text-muted-foreground border-transparent',
        position:
          'bg-united-red text-white border-transparent tracking-[0.04em]',
        live: 'bg-united-red text-white border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

const Badge = ({ variant, children, className }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {variant === 'live' ? (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      ) : null}
      {children}
    </span>
  );
};

export { Badge, badgeVariants, type BadgeProps };
