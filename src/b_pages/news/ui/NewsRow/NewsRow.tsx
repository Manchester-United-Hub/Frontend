import { ExternalLink } from 'lucide-react';

import { cn } from '@shared/utils';

/**
 * 로우 컨테이너 공통 레이아웃 — NewsRow와 NewsSkeleton(로딩 자리표시자)이 공유한다.
 * hover·포커스 등 인터랙션 전용 스타일은 NewsRow에서 별도로 이어붙인다.
 * border-bottom은 여기 두지 않는다 — NewsList의 divide-y가 담당한다.
 */
export const ROW_LAYOUT_CLASSNAME = 'grid gap-2 px-6 py-[22px]';

export interface NewsRowProps {
  title: string;
  /** 본문 일부 — 로우에서 두 줄로 clamp해 말줄임 노출한다. */
  description: string;
  /** 기사 원문 링크(외부). 로우 전체가 이 링크로 연결된다. */
  link: string;
  /** 표시용 발행일 문자열(예: "2025.05.18"). */
  date: string;
  /** 표시용 출처 라벨. 빈 문자열이면 출처와 구분점을 렌더하지 않는다. */
  source: string;
  className?: string;
}

/**
 * 뉴스 기사 로우 — 출처·발행일 메타 줄 + 제목 + 본문 발췌. 로우 전체가 외부 원문 링크.
 * 테두리 카드 안의 세로 스택 형태이며, 표현형 컴포넌트이므로 도메인 타입 대신
 * 자체 props로 데이터를 받는다.
 */
function NewsRow({ title, description, link, date, source, className }: NewsRowProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        ROW_LAYOUT_CLASSNAME,
        'group text-inherit motion-safe:transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        {source !== '' && (
          <>
            <span className="text-[12.5px] font-semibold text-foreground">{source}</span>
            <span aria-hidden="true" className="text-[12.5px] text-muted-foreground">
              ·
            </span>
          </>
        )}
        <time className="text-[12.5px] tracking-[0.02em] text-muted-foreground">{date}</time>
      </div>

      <h3 className="text-[19px] font-[750] leading-[1.35] tracking-[-0.015em] text-foreground text-pretty">
        {title}
        <ExternalLink
          size={14}
          aria-hidden="true"
          className="ml-1.5 inline-block align-[-1px] text-muted-foreground opacity-0 motion-safe:transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </h3>

      <p className="line-clamp-2 text-[14.5px] leading-[1.65] text-muted-foreground text-pretty">
        {description}
      </p>
    </a>
  );
}

export { NewsRow };
