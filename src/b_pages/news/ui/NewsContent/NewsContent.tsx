'use client';

import { Newspaper } from 'lucide-react';

import { DEFAULT_NEWS_PAGE_SIZE } from '@features/news/api';
import { Button, StateBox } from '@shared/ui';

import { useNewsFeed } from '../../model';
import { NewsErrorState } from '../NewsErrorState';
import { NewsList } from '../NewsList';
import { NewsSkeleton } from '../NewsSkeleton';

function NewsContent() {
  const {
    newsItems,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: onLoadMore,
    refetch: onRetry,
  } = useNewsFeed({ pageSize: DEFAULT_NEWS_PAGE_SIZE });

  if (isLoading) return <NewsSkeleton />;

  if (isError) return <NewsErrorState onRetry={onRetry} />;

  if (newsItems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border">
        <StateBox
          className="py-18"
          variant="empty"
          icon={<Newspaper size={24} aria-hidden="true" />}
          title="표시할 기사가 없어요"
          description="아직 등록된 기사가 없습니다. 잠시 후 다시 확인해 주세요."
        />
      </div>
    );
  }

  return (
    <>
      {hasNextPage ? null : (
        <p className="text-sm text-muted-foreground">
          <b className="text-foreground">{newsItems.length}</b>개의 기사
        </p>
      )}
      <NewsList newsItems={newsItems} />
      {hasNextPage ? (
        <div className="mt-7 flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? '불러오는 중…' : '기사 더 보기'}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export { NewsContent };
