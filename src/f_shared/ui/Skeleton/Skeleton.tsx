import { HTMLAttributes } from 'react';

import { cn } from '@shared/utils';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className, ...rest }: SkeletonProps) => {
  return (
    <div
      aria-hidden
      className={cn('motion-safe:animate-pulse rounded-md bg-muted', className)}
      {...rest}
    />
  );
};

export { Skeleton, type SkeletonProps };
