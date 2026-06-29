import { createElement, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/utils';

const stateIconVariants = cva(
  'grid h-11 w-11 place-items-center rounded-full',
  {
    variants: {
      variant: {
        empty: 'bg-muted text-muted-foreground',
        error: 'bg-destructive/12 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'empty',
    },
  },
);

interface StateBoxProps extends VariantProps<typeof stateIconVariants> {
  icon: ReactNode;
  title: string;
  description?: string;
  /** Optional action, typically a <Button>. */
  action?: ReactNode;
  /** Heading level for the title (default 4). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const StateBox = ({
  variant,
  icon,
  title,
  description,
  action,
  headingLevel = 4,
  className,
}: StateBoxProps) => {
  return (
    <div
      role={variant === 'error' ? 'alert' : undefined}
      className={cn(
        'flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-10 text-center',
        className,
      )}
    >
      <span className={stateIconVariants({ variant })}>{icon}</span>
      {createElement(
        `h${headingLevel}`,
        { className: 'text-base font-semibold' },
        title,
      )}
      {description ? (
        <p className="max-w-[280px] text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action}
    </div>
  );
};

export { StateBox, stateIconVariants, type StateBoxProps };
