import { CalendarDays, Clock, Eye, Play } from 'lucide-react';

import { Badge, Card } from '@shared/ui';
import { cn } from '@shared/utils';

export interface FeaturedHighlightProps {
  title: string;
  category: string;
  competition: string;
  date: string;
  views: string;
  duration: string;
  description: string;
  className?: string;
}

/**
 * 대표 영상(하이라이트 목록 최상단) 카드 — 큰 썸네일(워터마크 듀레이션·Clock 듀레이션 배지·큰 재생 버튼)
 * + 본문(카테고리·대회 배지 2개·제목·설명·메타). 표현형 컴포넌트이므로 자체 props로 데이터를 받는다.
 * 재생 버튼은 상세 페이지로 연결되지 않는 목 단계 전용 버튼이라 클릭 동작 없이 접근 가능한 이름만 제공한다.
 */
function FeaturedHighlight({
  title,
  category,
  competition,
  date,
  views,
  duration,
  description,
  className,
}: FeaturedHighlightProps) {
  return (
    <Card hover className={cn('overflow-hidden', className)}>
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-linear-to-br from-muted to-muted/60">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-4 select-none text-[120px] font-extrabold leading-none text-muted-foreground/10"
        >
          {duration}
        </span>

        <Badge variant="soft" className="absolute bottom-3 right-3 z-[2]">
          <Clock size={12} aria-hidden="true" />
          {duration}
        </Badge>

        <button
          type="button"
          aria-label="대표 영상 재생"
          className="relative z-[1] grid h-16 w-16 place-items-center rounded-full bg-background/90 text-foreground shadow-md transition-transform motion-safe:hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Play size={26} fill="currentColor" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="soft">{category}</Badge>
          <Badge variant="default">{competition}</Badge>
        </div>

        <h2 className="text-xl font-bold leading-[1.3] tracking-[-0.01em]">{title}</h2>
        <p className="text-sm leading-[1.55] text-muted-foreground">{description}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye size={13} aria-hidden="true" />
            {views}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={13} aria-hidden="true" />
            {date}
          </span>
        </div>
      </div>
    </Card>
  );
}

export { FeaturedHighlight };
