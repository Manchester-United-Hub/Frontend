import type { SyntheticEvent } from 'react';

import { cn, handleImageError } from '@shared/utils';

/** 발췌 최대 길이 — description을 이 길이로 잘라 로우 본문에 노출한다. */
const EXCERPT_MAX = 20;

/** 썸네일 없거나 로딩 실패 시 사용할 기본 이미지(로컬 자산). */
const DEFAULT_NEWS_IMAGE = '/images/news-default.svg';

/** 썸네일 로딩 실패 시 기본 이미지로 폴백. */
function handleThumbnailError(event: SyntheticEvent<HTMLImageElement>): void {
  handleImageError(event, DEFAULT_NEWS_IMAGE);
}

/**
 * 로우 컨테이너 공통 레이아웃 — NewsRow와 NewsSkeleton(로딩 자리표시자)이 공유한다.
 * hover·포커스 등 인터랙션 전용 스타일은 NewsRow에서 별도로 이어붙인다.
 */
export const ROW_LAYOUT_CLASSNAME =
  'flex items-center gap-[18px] border-b border-border px-1.5 py-4';

/**
 * 썸네일 치수 — 148px(모바일 ≤640px: 108px). NewsRow 본 썸네일과
 * NewsSkeleton 스켈레톤 박스가 동일 폭·브레이크포인트를 공유한다.
 */
export const THUMB_CLASSNAME = 'aspect-[4/3] w-[148px] flex-none max-[640px]:w-[108px]';

export interface NewsRowProps {
  title: string;
  /** 본문 일부 — 로우에서 최대 EXCERPT_MAX자로 잘라 노출한다. */
  description: string;
  /** 기사 원문 링크(외부). 로우 전체가 이 링크로 연결된다. */
  link: string;
  /** 표시용 발행일 문자열(예: "2025.05.18"). */
  date: string;
  /** 썸네일 URL. 없거나 로딩 실패 시 기본 이미지로 폴백한다. */
  imageUrl?: string;
  className?: string;
}

/**
 * 뉴스 기사 로우 — 썸네일 + 제목 + 본문 발췌 + 발행일. 로우 전체가 외부 원문 링크.
 * 표현형 컴포넌트이므로 도메인 타입 대신 자체 props로 데이터를 받는다.
 *
 * 썸네일은 지금 plain <img>로 두고, next/image 최적화는 추후로 미룬다.
 *  - 실 피드 이미지 호스트 집합이 아직 미확정이다. next/image는 remotePatterns에
 *    등록된 도메인만 허용하므로, 호스트가 확정되면 그때 전환한다.
 *  - plain <img>는 어떤 로드 실패든 onError → handleImageError로 기본 이미지 폴백이
 *    성립한다(리뷰 #6). next/image로 전환하면 src를 직접 못 바꾸므로 state 기반 폴백으로
 *    핸들러를 다시 짜야 한다.
 *  - 지금도 lazy 로딩·비동기 디코딩·명시 치수(CLS 방지)로 최적화한다(리뷰 #7).
 * 제목이 인접 텍스트로 내용을 전달하므로 썸네일은 장식용(alt="")으로 둔다.
 */
function NewsRow({ title, description, link, date, imageUrl, className }: NewsRowProps) {
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
      {/* eslint-disable-next-line @next/next/no-img-element -- 외부 피드 임의 도메인 이미지: next/image 원격 최적화 부적합 */}
      <img
        src={imageUrl ?? DEFAULT_NEWS_IMAGE}
        alt=""
        width={148}
        height={111}
        loading="lazy"
        decoding="async"
        onError={handleThumbnailError}
        className={cn('rounded-md bg-muted object-cover', THUMB_CLASSNAME)}
      />

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

export { NewsRow };
