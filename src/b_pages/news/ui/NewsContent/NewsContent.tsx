import { Newspaper } from 'lucide-react';

import { Button, StateBox } from '@shared/ui';

import type { NewsItem } from '../../model';
import { NewsList } from '../NewsList';
import { NewsSkeleton } from '../NewsSkeleton';

export interface NewsContentProps {
  isLoading: boolean;
  newsItems: NewsItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

/** 로딩 → 0건 → 리스트(+더 보기) 3단 분기 렌더 영역. */
function NewsContent({
  isLoading,
  newsItems,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: NewsContentProps) {
  if (isLoading) return <NewsSkeleton />;

  if (newsItems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border">
        <StateBox
          className="py-[72px]"
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
      <p className="text-sm text-muted-foreground">
        <b className="text-foreground">{newsItems.length}</b>개의 기사
      </p>
      <NewsList newsItems={newsItems} />
      {hasNextPage ? (
        <div className="mt-7 flex justify-center">
          <Button variant="outline" onClick={onLoadMore} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? '불러오는 중…' : '기사 더 보기'}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export { NewsContent };
