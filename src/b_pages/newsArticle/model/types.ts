/**
 * News article page — model-layer types (#36).
 *
 * 이 브랜치는 **UI + 목데이터**만 구현한다. 실 데이터 연결은 추후 다른 브랜치에서 하므로,
 * 목 계약을 실제 도메인 모델(`@entities/news`)에 맞춰 두어 이후 스왑이 쉽도록 한다.
 *
 * - 커서 입력은 실제 `NewsQuery`(cursorAt·cursorId·size)를 그대로 사용한다.
 * - `ArticleItem`은 실제 `NewsDTO`에 표시 전용 `imageUrl`(썸네일)을 더한 것이다.
 *   현재 `NewsDTO`에는 이미지 필드가 없으므로 UI에서만 쓰는 옵션 필드로 확장한다.
 * - 표현형 컴포넌트(ArticleCard)는 도메인 타입을 import하지 않고 자체 props로 소비한다(code-quality).
 */

import type { NewsDTO, NewsQuery } from '@entities/news/model';

export type { NewsQuery };

/** 목록 아이템 — 실제 NewsDTO + 표시 전용 썸네일. */
export interface ArticleItem extends NewsDTO {
  /** 썸네일 URL. 없으면 카드가 기본 이미지를 사용한다. */
  imageUrl?: string;
}

/** 커서 페이지 응답 — 실제 NewsListDTO 형태(newsList/nextCursor…)를 미러링. */
export interface NewsPage {
  newsList: ArticleItem[];
  nextCursorAt: string;
  nextCursorId: number;
}

/** 페이지 소스 — 목/실 데이터 교체 지점. 테스트는 여기에 fixture를 주입한다. */
export type NewsPageSource = (query: NewsQuery) => NewsPage;

/** useNewsArticles 반환 계약. */
export interface UseNewsArticlesResult {
  articles: ArticleItem[];
  /** 최초 로딩(스켈레톤 표시 구간). */
  isLoading: boolean;
  /** 다음 페이지 존재 여부. */
  hasNextPage: boolean;
  /** '더 보기' 진행 중. */
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}
