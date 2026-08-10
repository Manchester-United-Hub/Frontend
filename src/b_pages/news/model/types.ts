/**
 * 뉴스 페이지 — model 계층 UI 타입 (#36).
 *
 * 이 브랜치는 **UI + 목데이터**만 구현한다. 실 데이터 연결은 추후 다른 브랜치에서 하므로,
 * 목 계약을 실제 도메인 모델(`@entities/news`)에 맞춰 두어 이후 스왑이 쉽도록 한다.
 *
 * - 커서 입력은 실제 `NewsQuery`(cursorAt·cursorId·size)를 그대로 사용한다.
 * - `NewsItem`은 실제 `NewsDTO`에 표시 전용 `imageUrl`(썸네일)을 더한 것이다.
 *   현재 `NewsDTO`에는 이미지 필드가 없으므로 UI에서만 쓰는 옵션 필드로 확장한다.
 * - 표현형 컴포넌트(NewsRow)는 도메인 타입을 import하지 않고 자체 props로 소비한다(code-quality).
 *
 * 목 데이터 전달(커서 페이지네이션)·전송 형태 계약은 `newsFeed.ts`(테스트 fixture로 이관,
 * 현재 test/b_pages/news/model/newsFeed.ts)가 소유했다(리뷰 #4·#5).
 */

import type { NewsDTO, NewsQuery } from '@entities/news/model';

export type { NewsQuery };

/** 목록 아이템 — 실제 NewsDTO + 표시 전용 썸네일. */
export interface NewsItem extends NewsDTO {
  /** 썸네일 URL. 없으면 로우가 기본 이미지를 사용한다. */
  imageUrl?: string;
}

/** useNewsFeed 반환 계약. */
export interface UseNewsFeedResult {
  newsItems: NewsItem[];
  /** 최초 로딩(스켈레톤 표시 구간). */
  isLoading: boolean;
  /** 목록 조회 실패 여부(react-query 전환, D-9). */
  isError: boolean;
  /** 다음 페이지 존재 여부. */
  hasNextPage: boolean;
  /** '더 보기' 진행 중. */
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  /** 재조회(에러 상태 재시도, M-1). react-query의 Promise 반환은 버리고 void로 노출한다. */
  refetch: () => void;
}
