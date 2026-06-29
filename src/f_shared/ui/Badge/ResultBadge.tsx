import { cn } from '@shared/utils';

type MatchResult = 'W' | 'D' | 'L';

const RESULT_COLOR: Record<MatchResult, string> = {
  W: 'bg-win',
  D: 'bg-draw',
  L: 'bg-loss',
};

const RESULT_LABEL: Record<MatchResult, string> = {
  W: '승',
  D: '무',
  L: '패',
};

interface ResultBadgeProps {
  result: MatchResult;
  className?: string;
}

const ResultBadge = ({ result, className }: ResultBadgeProps) => {
  return (
    <span
      role="img"
      aria-label={RESULT_LABEL[result]}
      className={cn(
        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
        RESULT_COLOR[result],
        className,
      )}
    >
      {result}
    </span>
  );
};

export { ResultBadge, type ResultBadgeProps, type MatchResult };
