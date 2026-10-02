import { ReactNode } from 'react';
import { MapPin } from 'lucide-react';

import { cn } from '@shared/utils';

import { ResultBadge, type MatchResult } from '../Badge';

interface MatchTeam {
  /** Short crest code, e.g. "MUN". */
  code: string;
  name: string;
  score?: number;
  /** United styling (red crest). */
  highlight?: boolean;
}

interface MatchCardProps {
  variant: 'next' | 'past';
  /** Tag label, e.g. "다음 경기" or "9월 14일". */
  tag: ReactNode;
  competition: string;
  home: MatchTeam;
  away: MatchTeam;
  /** Past matches: leading W/D/L badge in the tag row. */
  result?: MatchResult;
  venue: string;
  date: string;
  /** Footer-right slot, typically a <Badge>. */
  action?: ReactNode;
  className?: string;
}

const Crest = ({ team }: { team: MatchTeam }) => (
  <span
    className={cn(
      'grid h-11 w-11 place-items-center rounded-full border text-[15px] font-extrabold',
      team.highlight
        ? 'border-transparent bg-united-red text-white'
        : 'border-border bg-muted text-foreground'
    )}
  >
    {team.code}
  </span>
);

const MatchCard = ({
  variant,
  tag,
  competition,
  home,
  away,
  result,
  venue,
  date,
  action,
  className,
}: MatchCardProps) => {
  const hasScore = home.score !== undefined && away.score !== undefined;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border bg-card p-5.5 shadow-sm transition-[box-shadow,transform] motion-safe:hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            'inline-flex items-center gap-1.75 text-xs font-semibold uppercase tracking-[0.06em]',
            variant === 'next' ? 'text-united-red' : 'text-muted-foreground'
          )}
        >
          {result ? <ResultBadge result={result} /> : null}
          {tag}
        </span>
        <span className="text-xs text-muted-foreground">{competition}</span>
      </div>

      <div className="mt-5.5 mb-4.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <Crest team={home} />
          <span className="text-center text-xs font-medium">{home.name}</span>
        </div>
        <span
          className={cn(
            'min-w-16 text-center font-extrabold tracking-[-0.02em]',
            hasScore ? 'text-3xl' : 'text-xl text-muted-foreground'
          )}
        >
          {hasScore ? `${home.score}–${away.score}` : 'VS'}
        </span>
        <div className="flex flex-col items-center gap-2">
          <Crest team={away} />
          <span className="text-center text-xs font-medium">{away.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2.5 border-t border-border pt-4">
        <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <MapPin size={14} className="shrink-0" aria-hidden />
          {venue} · {date}
        </span>
        {action}
      </div>
    </div>
  );
};

export { MatchCard, type MatchCardProps, type MatchTeam };
