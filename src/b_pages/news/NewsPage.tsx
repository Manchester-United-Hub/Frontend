'use client';

/**
 * NewsPage — 뉴스 페이지 조립 (#36 → NW-3, D-9 react-query 전환).
 *
 * useNewsFeed(react-query 어댑터, AD-5)의 상태를 헤더/콘텐츠 섹션에 흘려보내는 얇은 조립 컴포넌트.
 * 로직은 model, 마크업은 ui 섹션에 있으므로 이 파일은 배선만 담당한다.
 * Nav/Footer는 루트 레이아웃이 전역으로 공급하므로 여기서 렌더하지 않는다.
 *
 * source/pageSize/fetchDelayMs props(동기 mock 전용 테스트 주입 지점)는 제거됐다 — 실 데이터
 * 연결 후에는 e_entities 클라이언트 함수(getNewsList)를 vi.mock으로 대체해 테스트한다.
 */

import { Shell } from '@shared/ui';

import { useNewsFeed } from './model';
import { NewsContent, NewsHeadSection } from './ui';

function NewsPage() {
  const {
    newsItems,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useNewsFeed({ pageSize: 10 });

  return (
    <main>
      <NewsHeadSection />
      <Shell className="pt-6 pb-12">
        <NewsContent
          isLoading={isLoading}
          isError={isError}
          newsItems={newsItems}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          onRetry={refetch}
        />
      </Shell>
    </main>
  );
}

export { NewsPage };
