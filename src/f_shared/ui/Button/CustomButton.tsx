import Link from 'next/link';
import { Route } from 'next';
import { ReactNode } from 'react';
import {
  Button as HLButton,
  ButtonProps as HBButtonProps,
} from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-medium leading-none whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        red: 'bg-united-red text-white hover:bg-united-red-ink',
        outline:
          'bg-background text-foreground border-border hover:bg-accent',
        ghost: 'bg-transparent text-foreground hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 text-sm',
        lg: 'h-11 px-[22px] text-[15px]',
        icon: 'h-10 w-10 px-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends Omit<HBButtonProps, 'children'>,
    VariantProps<typeof buttonVariants> {
  mode?: 'link' | 'default' | 'submit' | 'icon';
  togo?: Route;
  children?: ReactNode;
}

const Button = ({
  mode = 'default',
  variant,
  size,
  togo,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  const resolvedSize = size ?? (mode === 'icon' ? 'icon' : undefined);
  const classes = cn(buttonVariants({ variant, size: resolvedSize }), className);

  switch (mode) {
    case 'link':
      if (!togo) {
        throw new Error('link button must have togo props.');
      }
      if (disabled) {
        return (
          <span
            className={cn(classes, 'pointer-events-none opacity-50')}
            aria-disabled="true"
          >
            {children}
          </span>
        );
      }
      return (
        <Link href={togo} className={classes}>
          {children}
        </Link>
      );
    case 'icon':
      return (
        <HLButton
          type="button"
          disabled={disabled}
          className={classes}
          {...rest}
        >
          {children}
        </HLButton>
      );
    case 'submit':
      return (
        <HLButton
          type="submit"
          disabled={disabled}
          className={classes}
          {...rest}
        >
          {children}
        </HLButton>
      );
    default:
      return (
        <HLButton
          type="button"
          disabled={disabled}
          className={classes}
          {...rest}
        >
          {children}
        </HLButton>
      );
  }
};

export { Button, buttonVariants, type ButtonProps };
