'use client';

import Image from 'next/image';
import { CalendarDays, Eye, Play, SquareArrowOutUpRight } from 'lucide-react';

import { Badge, Card } from '@shared/ui';
import { cn } from '@shared/utils';

const THUMBNAIL_SIZES = '(max-width: 1200px) 100vw, 1200px';
const EXTERNAL_LINK_LABEL = 'YouTube에서 보기 (새 탭)';

interface FeaturedHighlightProps {
  title: string;
  label: string;
  thumbnailUrl: string;
  date: string;
  views: string | null;
  watchUrl: string;
  className?: string;
}

function FeaturedHighlight({
  title,
  label,
  thumbnailUrl,
  date,
  views,
  watchUrl,
  className,
}: FeaturedHighlightProps) {
  return (
    <Card hover className={cn('overflow-hidden', className)}>
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-linear-to-br from-muted to-muted/60">
        <Image
          src={thumbnailUrl}
          alt=""
          fill
          priority
          sizes={THUMBNAIL_SIZES}
          className="object-cover"
        />

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} ${EXTERNAL_LINK_LABEL}`}
          className="relative z-[1] grid h-16 w-16 cursor-pointer place-items-center rounded-full bg-background/90 text-foreground shadow-md transition-transform motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Play size={26} fill="currentColor" aria-hidden="true" />
        </a>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="soft">{label}</Badge>
        </div>

        <h2 className="text-xl font-bold leading-[1.3] tracking-[-0.01em]">{title}</h2>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {views ? (
            <span className="inline-flex items-center gap-1">
              <Eye size={13} aria-hidden="true" />
              {views}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={13} aria-hidden="true" />
            {date}
          </span>
          <SquareArrowOutUpRight size={12} aria-hidden="true" className="ml-auto" />
        </div>
      </div>
    </Card>
  );
}

export { FeaturedHighlight };
export type { FeaturedHighlightProps };
