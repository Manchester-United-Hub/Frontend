import { Newspaper } from 'lucide-react';

import { Button, StateBox } from '@shared/ui';

import type { NewsItem } from '../../model';
import { NewsErrorState } from '../NewsErrorState';
import { NewsList } from '../NewsList';
import { NewsSkeleton } from '../NewsSkeleton';

export interface NewsContentProps {
  isLoading: boolean;
  /** 목록 조회 실패 여부. 로딩보다 후순위로 분기한다. */
  isError?: boolean;
  newsItems: NewsItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  /** 에러 상태 재시도 액션(M-1). 없으면 NewsErrorState가 재시도 버튼을 렌더하지 않는다. */
  onRetry?: () => void;
}

/** 로딩 → 에러 → 0건 → 리스트(+더 보기) 4단 분기 렌더 영역. */
function NewsContent({
  isLoading,
  isError = false,
  newsItems,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRetry,
}: NewsContentProps) {
  if (isLoading) return <NewsSkeleton />;

  if (isError) return <NewsErrorState onRetry={onRetry} />;

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
      {hasNextPage ? null : (
        <p className="text-sm text-muted-foreground">
          <b className="text-foreground">{newsItems.length}</b>개의 기사
        </p>
      )}
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
