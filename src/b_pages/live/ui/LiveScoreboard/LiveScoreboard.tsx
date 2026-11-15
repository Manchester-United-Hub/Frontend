import { Badge } from '@shared/ui';
import { cn } from '@shared/utils';

import type { LiveMatch, LiveTeam } from '../../model';

const WATERMARK_TEXT = 'MU';
const LIVE_BADGE_TEXT = 'LIVE';
const HOME_LABEL = 'Home';
const AWAY_LABEL = 'Away';
const SCORE_SEPARATOR = '–';

type TeamAlign = 'start' | 'end';

interface TeamColumnProps {
  team: LiveTeam;
  sideLabel: string;
  align: TeamAlign;
}

function TeamColumn({ team, sideLabel, align }: TeamColumnProps) {
  const isEnd = align === 'end';

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-3',
        isEnd && 'flex-row-reverse text-right'
      )}
    >
      <span className="grid h-12 w-12 flex-none place-items-center rounded-md bg-white/15 text-sm font-extrabold tracking-[0.04em] max-[620px]:h-10 max-[620px]:w-10 max-[620px]:text-xs">
        {team.code}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-[22px] font-bold leading-none max-[620px]:text-base">
          {team.name}
        </span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-white/70">
          {sideLabel}
        </span>
      </span>
    </div>
  );
}

interface LiveScoreboardProps {
  match: Pick<
    LiveMatch,
    'competition' | 'venue' | 'period' | 'clock' | 'home' | 'away'
  >;
}

function LiveScoreboard({ match }: LiveScoreboardProps) {
  const { competition, venue, period, clock, home, away } = match;

  return (
    <section
      aria-label="스코어보드"
      className="relative overflow-hidden rounded-xl bg-united-red px-8 py-7 text-white max-[620px]:px-5 max-[620px]:py-5"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -bottom-10 select-none text-[180px] font-extrabold leading-none tracking-[-0.06em] text-white/10"
      >
        {WATERMARK_TEXT}
      </span>
      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-white/85">
        <Badge
          variant="live"
          pill
          className="bg-white/20 tracking-[0.08em]"
        >
          {LIVE_BADGE_TEXT}
        </Badge>
        <span>{competition}</span>
        <span aria-hidden="true">·</span>
        <span>{venue}</span>
      </div>
      <div className="relative mt-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 max-[620px]:gap-3">
        <TeamColumn team={home} sideLabel={HOME_LABEL} align="start" />
        <div className="flex flex-col items-center gap-1.5">
          <p
            aria-live="polite"
            className="text-[48px] font-extrabold leading-none tracking-[-0.02em] tabular-nums max-[620px]:text-[34px]"
          >
            {home.score} {SCORE_SEPARATOR} {away.score}
          </p>
          <p className="text-sm font-semibold text-white/85">
            {period} {clock}
          </p>
        </div>
        <TeamColumn team={away} sideLabel={AWAY_LABEL} align="end" />
      </div>
    </section>
  );
}

export { LiveScoreboard, type LiveScoreboardProps };
