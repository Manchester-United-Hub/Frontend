import { MapPin } from 'lucide-react';

import type { Match } from '@entities/matches/types';

import { Crest, ResultBadge } from '@shared/ui';
import { cn } from '@shared/utils';

const UPCOMING_FALLBACK_LABEL = '예정';
const SCORE_SEPARATOR = '–';

export interface MatchRowProps {
  match: Match;
}

export function MatchRow({ match }: MatchRowProps) {
  const isPast = match.status === 'past';
  const hasScore = match.home.score != null && match.away.score != null;

  return (
    <div
      className={cn(
        'grid min-h-16.5 grid-cols-[86px_1fr_92px_1fr_132px] items-center gap-3.5 border-b border-border px-4.5 py-3 transition-colors hover:bg-accent',
        'max-[980px]:grid-cols-[72px_1fr_88px_1fr]'
      )}
    >
      <div className="flex flex-col justify-center items-center">
        <span className="text-sm font-bold text-foreground max-[620px]:text-[13px]">
          {match.date}
        </span>
        <span className="text-xs text-muted-foreground">{match.dow}</span>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2">
        <span
          className={cn(
            'truncate text-right text-sm max-[620px]:text-xs',
            match.home.utd ? 'font-bold' : 'font-medium'
          )}
        >
          {match.home.nm}
        </span>
        <Crest
          teamLogoUrl={match.home.teamLogoUrl}
          code={match.home.code}
          utd={match.home.utd}
        />
      </div>

      <div className="flex flex-col items-center gap-1">
        {isPast ? (
          <>
            <span className="text-[19px] font-extrabold tracking-[-0.02em] max-[620px]:text-base">
              {hasScore
                ? `${match.home.score}${SCORE_SEPARATOR}${match.away.score}`
                : SCORE_SEPARATOR}
            </span>
            {match.result ? <ResultBadge result={match.result} /> : null}
          </>
        ) : (
          <>
            <span className="text-[13px] font-semibold text-foreground">
              {match.time}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {match.countdown ?? UPCOMING_FALLBACK_LABEL}
            </span>
          </>
        )}
      </div>

      <div className="flex min-w-0 items-center justify-start gap-2">
        <Crest
          teamLogoUrl={match.away.teamLogoUrl}
          code={match.away.code}
          utd={match.away.utd}
        />
        <span
          className={cn(
            'truncate text-sm max-[620px]:text-xs',
            match.away.utd ? 'font-bold' : 'font-medium'
          )}
        >
          {match.away.nm}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground max-[980px]:hidden">
        <MapPin size={13} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{match.venue}</span>
      </div>
    </div>
  );
}
