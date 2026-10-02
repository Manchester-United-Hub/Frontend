import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/utils';

/**
 * 범용 카드 셸 — `rounded-lg border border-border bg-card` 반복 인라인을 대체한다.
 * 특화형(MatchCard·PlayerCard·CategoryCard)과 달리 콘텐츠에 대해 무가정이며,
 * padding/hover만 variant로 제공하고 나머지는 `className`(호출자 우선)으로 흡수한다.
 */

const cardVariants = cva('rounded-lg border border-border bg-card', {
  variants: {
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
    },
    hover: {
      true: 'transition-shadow hover:shadow-sm',
      false: '',
    },
  },
  defaultVariants: {
    padding: 'none',
    hover: false,
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
}

const Card = ({ padding, hover, children, className }: CardProps) => {
  return (
    <div className={cn(cardVariants({ padding, hover }), className)}>
      {children}
    </div>
  );
};

export { Card, cardVariants, type CardProps };
