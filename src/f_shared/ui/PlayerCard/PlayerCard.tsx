import { ReactNode } from 'react';

import { cn } from '@shared/utils';

import { Badge } from '../Badge';

interface PlayerCardProps {
  name: string;
  nameEn: string;
  /** Position code, e.g. "MF". */
  position: string;
  status: 'active' | 'retired';
  /** Tenure or extra meta, e.g. "2020–현재". */
  meta?: string;
  /**
   * Photo slot. Pass a framework <Image> when available; falls back to a
   * silhouette when omitted. Kept as a slot so f_shared stays decoupled from
   * the app's image config.
   */
  photo?: ReactNode;
  className?: string;
}

const Silhouette = () => (
  <svg
    viewBox="0 0 64 64"
    fill="currentColor"
    aria-hidden="true"
    className="h-2/3 w-2/3 text-muted-foreground/40"
  >
    <circle cx="32" cy="22" r="13" />
    <path d="M8 60c0-14 11-22 24-22s24 8 24 22z" />
  </svg>
);

const PlayerCard = ({
  name,
  nameEn,
  position,
  status,
  meta,
  photo,
  className,
}: PlayerCardProps) => {
  return (
    <div
      className={cn(
        'relative cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
    >
      <div className="relative grid aspect-square place-items-center overflow-hidden bg-linear-to-b from-muted to-muted/60">
        <Badge variant="position" className="absolute left-2.5 top-2.5 z-[2]">
          {position}
        </Badge>
        {photo ?? <Silhouette />}
      </div>
      <div className="px-3.5 pb-4 pt-3.5">
        <div className="text-[15px] font-bold leading-[1.15]">{name}</div>
        <div className="mt-0.5 text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
          {nameEn}
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                status === 'active' ? 'bg-win' : 'bg-muted-foreground',
              )}
            />
            {status === 'active' ? '현역' : '은퇴'}
          </span>
          {meta ? <span>· {meta}</span> : null}
        </div>
      </div>
    </div>
  );
};

export { PlayerCard, type PlayerCardProps };
