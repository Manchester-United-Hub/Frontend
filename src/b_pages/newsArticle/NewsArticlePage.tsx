'use client';

/**
 * NewsArticlePage — 뉴스 기사 페이지 조립 (#36).
 *
 * useNewsArticles의 상태를 헤더/콘텐츠 섹션에 흘려보내는 얇은 조립 컴포넌트.
 * 로직은 model, 마크업은 ui 섹션에 있으므로 이 파일은 배선만 담당한다.
 * Nav/Footer는 루트 레이아웃이 전역으로 공급하므로 여기서 렌더하지 않는다.
 *
 * 이 브랜치는 목데이터 UI다. source/pageSize/fetchDelayMs props는 훅으로 전달되며,
 * 테스트는 fixture를 주입하고, 추후 실 데이터 브랜치는 source를 실 훅으로 교체한다.
 */

import { Shell } from '@shared/ui';

import { useNewsArticles } from './model';
import type { NewsPageSource } from './model';
import { NewsContent, NewsHeadSection } from './ui';

interface NewsArticlePageProps {
  source?: NewsPageSource;
  pageSize?: number;
  fetchDelayMs?: number;
}

function NewsArticlePage({ source, pageSize, fetchDelayMs }: NewsArticlePageProps = {}) {
  const { articles, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useNewsArticles({
    source,
    pageSize,
    delayMs: fetchDelayMs,
  });

  return (
    <main>
      <NewsHeadSection />
      <Shell className="pt-6 pb-12">
        <NewsContent
          isLoading={isLoading}
          articles={articles}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </Shell>
    </main>
  );
}

export { NewsArticlePage, type NewsArticlePageProps };
