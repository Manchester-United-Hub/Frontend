import { Newspaper } from 'lucide-react';

import { cn } from '@shared/utils';

/** 발췌 최대 길이 — description을 이 길이로 잘라 로우 본문에 노출한다. */
const EXCERPT_MAX = 20;

/**
 * 로우 컨테이너 공통 레이아웃 — ArticleRow와 NewsSkeleton(로딩 자리표시자)이 공유한다.
 * hover·포커스 등 인터랙션 전용 스타일은 ArticleRow에서 별도로 이어붙인다.
 */
export const ROW_LAYOUT_CLASSNAME =
  'flex items-center gap-[18px] border-b border-border px-1.5 py-4';

/**
 * 썸네일 치수 — 148px(모바일 ≤640px: 108px). ArticleRow 본 썸네일과
 * NewsSkeleton 스켈레톤 박스가 동일 폭·브레이크포인트를 공유한다.
 */
export const THUMB_CLASSNAME = 'aspect-[4/3] w-[148px] flex-none max-[640px]:w-[108px]';

export interface ArticleRowProps {
  title: string;
  /** 본문 일부 — 로우에서 최대 EXCERPT_MAX자로 잘라 노출한다. */
  description: string;
  /** 기사 원문 링크(외부). 로우 전체가 이 링크로 연결된다. */
  link: string;
  /** 표시용 발행일 문자열(예: "2025.05.18"). */
  date: string;
  className?: string;
}

/**
 * 뉴스 기사 로우 — 중립 썸네일 블록 + 제목 + 본문 발췌 + 발행일. 로우 전체가 외부 원문 링크.
 * 카테고리 색상/아이콘을 쓰지 않고 Newspaper 아이콘 + 'MU' 워터마크로 통일한다.
 * 표현형 컴포넌트이므로 도메인 타입 대신 자체 props로 데이터를 받는다.
 */
function ArticleRow({ title, description, link, date, className }: ArticleRowProps) {
  const excerpt = description.slice(0, EXCERPT_MAX);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        ROW_LAYOUT_CLASSNAME,
        'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <div className={cn('relative overflow-hidden rounded-md bg-muted', THUMB_CLASSNAME)}>
        <Newspaper
          className="absolute inset-0 m-auto text-muted-foreground"
          size={28}
          aria-hidden="true"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[22px] -right-1.5 select-none text-[80px] font-black leading-none text-foreground/10"
        >
          MU
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[17px] font-bold leading-[1.35] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-[1.5] text-muted-foreground">{excerpt}</p>
      </div>

      <time className="flex-none whitespace-nowrap text-[13px] text-muted-foreground max-[640px]:hidden">
        {date}
      </time>
    </a>
  );
}

export { ArticleRow };
