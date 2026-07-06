import type { SyntheticEvent } from 'react';
import { ExternalLink } from 'lucide-react';

import { Card } from '@shared/ui';
import { cn } from '@shared/utils';

/** 썸네일이 없거나 로딩에 실패했을 때 사용하는 기본 이미지(public/images). */
export const NEWS_DEFAULT_IMAGE = '/images/news-default.svg';

/** 이미지 로딩 실패 시 기본 이미지로 폴백. 무한 루프 방지를 위해 1회만 교체한다. */
function handleImageError(event: SyntheticEvent<HTMLImageElement>): void {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = 'true';
  img.src = NEWS_DEFAULT_IMAGE;
}

export interface ArticleCardProps {
  title: string;
  /** 본문 일부 — 카드에서 최대 3줄로 잘라 노출한다. */
  description: string;
  /** 기사 원문 링크(외부). 카드 전체가 이 링크로 연결된다. */
  link: string;
  /** 표시용 발행일 문자열(예: "2025.05.18"). */
  date: string;
  /** 썸네일 URL. 없으면 기본 이미지를 사용한다. */
  imageUrl?: string;
  className?: string;
}

/**
 * 뉴스 기사 카드 — 썸네일 + 제목 + 본문 발췌 + 발행일. 카드 전체가 외부 원문 링크.
 * 표현형 컴포넌트이므로 도메인 타입 대신 자체 props로 데이터를 받는다.
 */
function ArticleCard({ title, description, link, date, imageUrl, className }: ArticleCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <Card
        hover
        className="flex h-full flex-col overflow-hidden transition-transform motion-safe:group-hover:-translate-y-0.5 group-hover:shadow-md"
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- 썸네일은 onError로 로컬 기본 이미지 폴백이 필요하고, 원격 이미지 도메인은 실 데이터 브랜치에서 확정되므로 next/image 최적화는 그 시점에 적용한다. */}
          <img
            src={imageUrl ?? NEWS_DEFAULT_IMAGE}
            onError={handleImageError}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 motion-safe:group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col px-[18px] pb-[18px] pt-4">
          <h3 className="line-clamp-2 text-[17px] font-bold leading-[1.3] tracking-[-0.01em]">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-[1.55] text-muted-foreground">
            {description}
          </p>
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-3.5 text-xs text-muted-foreground">
            <time>{date}</time>
            <span className="ml-auto inline-flex items-center gap-1">
              <ExternalLink size={12} aria-hidden="true" />
              원문
            </span>
          </div>
        </div>
      </Card>
    </a>
  );
}

export { ArticleCard };
