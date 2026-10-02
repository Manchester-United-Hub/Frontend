import { CalendarDays, Eye, Play } from 'lucide-react';

import { Badge, Card } from '@shared/ui';
import { cn } from '@shared/utils';

export interface HighlightCardProps {
  title: string;
  category: string;
  competition: string;
  date: string;
  views: string;
  duration: string;
  className?: string;
}

/**
 * 하이라이트 카드 — 썸네일(카테고리 배지·워터마크 듀레이션·재생 아이콘·듀레이션) + 본문(제목·대회·메타).
 * 표현형 컴포넌트이므로 모델 타입 대신 자체 props로 데이터를 받는다.
 * 상세 라우트가 없는 목 단계라 카드 전체는 항상 href="#"로 연결한다.
 */
function HighlightCard({
  title,
  category,
  competition,
  date,
  views,
  duration,
  className,
}: HighlightCardProps) {
  return (
    <a
      href="#"
      className={cn(
        'group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <Card
        hover
        className="flex h-full flex-col overflow-hidden transition-transform motion-safe:group-hover:-translate-y-0.5 group-hover:shadow-md"
      >
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-linear-to-br from-muted to-muted/60">
          <Badge variant="soft" className="absolute left-2.5 top-2.5 z-[2]">
            {category}
          </Badge>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[64px] font-extrabold leading-none text-muted-foreground/10"
          >
            {duration}
          </span>

          <span
            aria-hidden="true"
            className="relative z-[1] grid h-11 w-11 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition-transform motion-safe:group-hover:scale-110"
          >
            <Play size={18} fill="currentColor" />
          </span>

          <span className="absolute bottom-2.5 right-2.5 z-[2] rounded-md bg-foreground/80 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-background">
            {duration}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-[1.3] tracking-[-0.01em]">
            {title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{competition}</p>
          <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
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
    </a>
  );
}

export { HighlightCard };
