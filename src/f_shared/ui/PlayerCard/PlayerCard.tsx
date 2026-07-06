import Link from 'next/link';
import type { Route } from 'next';
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
  /** Squad number. When present, appends to the position badge ("MF · 8") and renders a photo watermark. */
  number?: number;
  /** Nationality label. Rendered together with `flag` as a meta row. */
  nationality?: string;
  /** Flag glyph slot — keeps f_shared decoupled from any specific flag representation (emoji/SVG/lib). */
  flag?: ReactNode;
  /** Card-wide link destination. When set, the whole card renders as a Next Link. */
  href?: Route;
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

function PlayerCard({
  name,
  nameEn,
  position,
  status,
  meta,
  photo,
  number,
  nationality,
  flag,
  href,
  className,
}: PlayerCardProps) {
  const isRetired = status === 'retired';
  const positionLabel = number ? `${position} · ${number}` : position;
  const hasNationality = Boolean(nationality && flag);

  const cardClassName = cn(
    'relative overflow-hidden rounded-lg border border-border bg-card transition-[box-shadow,transform] motion-safe:hover:-translate-y-0.5 hover:shadow-md',
    className,
  );

  const cardContent = (
    <>
      <div className="relative grid aspect-square place-items-center overflow-hidden bg-linear-to-b from-muted to-muted/60">
        <Badge variant="position" className="absolute left-2.5 top-2.5 z-[2]">
          {positionLabel}
        </Badge>
        {isRetired ? (
          <Badge variant="soft" className="absolute right-2.5 top-2.5 z-[2]">
            은퇴
          </Badge>
        ) : null}
        {number ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 -right-3 select-none text-[120px] font-extrabold leading-none text-muted-foreground/10"
          >
            {number}
          </span>
        ) : null}
        {photo ?? <Silhouette />}
      </div>
      <div className="px-3.5 pb-4 pt-3.5">
        <div className="text-[15px] font-bold leading-[1.15]">{name}</div>
        <div className="mt-0.5 text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
          {nameEn}
        </div>
        {hasNationality ? (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            {flag}
            {nationality}
          </div>
        ) : null}
        <div
          className={cn(
            'flex items-center gap-2 text-xs text-muted-foreground',
            hasNationality ? 'mt-1' : 'mt-2.5',
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                status === 'active' ? 'bg-win' : 'bg-muted-foreground',
              )}
            />
            {/* retired는 우상단 Badge("은퇴")가 상태 표식을 전담 — 이 행은 dot + 재임 기간(meta)만 표시해
                Badge와 텍스트가 중복되지 않게 한다. */}
            {status === 'active' ? '현역' : meta}
          </span>
          {status === 'active' && meta ? <span>· {meta}</span> : null}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}

export { PlayerCard, type PlayerCardProps };
