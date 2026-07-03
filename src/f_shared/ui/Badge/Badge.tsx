import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md border font-semibold leading-none',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        soft: 'bg-muted text-muted-foreground border-transparent',
        position:
          'bg-united-red text-white border-transparent tracking-[0.04em]',
        live: 'bg-united-red text-white border-transparent',
      },
      /** 뱃지 크기. `xs`는 소프트 상태·인라인 마이크로 뱃지(예: "준비 중")용. */
      size: {
        default: 'h-[22px] px-[9px] text-xs',
        xs: 'h-auto px-[5px] py-px text-[9px]',
      },
      /** 완전한 캡슐형(rounded-full, 테두리 없음)으로 전환. */
      pill: {
        true: 'rounded-full border-0',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      pill: false,
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

const Badge = ({ variant, size, pill, children, className }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant, size, pill }), className)}>
      {variant === 'live' ? (
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse"
        />
      ) : null}
      {children}
    </span>
  );
};

export { Badge, badgeVariants, type BadgeProps };
