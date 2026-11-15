'use client';

import { useId } from 'react';
import Image from 'next/image';
import { CalendarDays, Eye, Play, SquareArrowOutUpRight } from 'lucide-react';

import { Card } from '@shared/ui';
import { cn } from '@shared/utils';

const THUMBNAIL_SIZES = '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw';
const EXTERNAL_LINK_LABEL = 'YouTube에서 보기 (새 탭)';

interface HighlightCardProps {
  title: string;
  thumbnailUrl: string;
  date: string;
  views: string | null;
  watchUrl: string;
  className?: string;
}

function HighlightCard({
  title,
  thumbnailUrl,
  date,
  views,
  watchUrl,
  className,
}: HighlightCardProps) {
  const externalLinkLabelId = useId();

  return (
    <Card
      hover
      className={cn(
        'group relative flex h-full flex-col overflow-hidden transition-transform motion-safe:hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-linear-to-br from-muted to-muted/60">
        <Image src={thumbnailUrl} alt="" fill sizes={THUMBNAIL_SIZES} className="object-cover" />

        <span
          aria-hidden="true"
          className="relative z-[1] grid h-11 w-11 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition-transform motion-safe:group-hover:scale-110"
        >
          <Play size={18} fill="currentColor" />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-[1.3] tracking-[-0.01em]">
          {/* 카드 전체를 덮는 after 영역으로 썸네일까지 클릭되게 한다. */}
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby={externalLinkLabelId}
            className="cursor-pointer text-left after:absolute after:inset-0 after:z-[3] after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-2 focus-visible:after:ring-offset-background"
          >
            {title}
          </a>
        </h3>
        <span id={externalLinkLabelId} className="sr-only">
          {EXTERNAL_LINK_LABEL}
        </span>
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
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

export { HighlightCard };
export type { HighlightCardProps };
