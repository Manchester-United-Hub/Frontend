import { formatPublishedAt } from '@shared/utils';

import type { NewsItem } from '../../model';
import { getNewsSourceLabel } from '../../utils';
import { NewsRow } from '../NewsRow';

/**
 * 기사 로우 리스트 컨테이너 — 테두리 카드 안에 divide-y로 구분되는 세로 스택.
 * NewsSkeleton이 로딩 상태에서 동일 레이아웃을 유지하도록 이 클래스를 재노출해 공유한다.
 */
export const NEWS_LIST_CLASSNAME =
  'mt-[18px] grid divide-y divide-border overflow-hidden rounded-[14px] border border-border bg-card';

interface NewsListProps {
  newsItems: NewsItem[];
}

/** 기사 목록 로우 리스트 — publishedAt·link를 여기서 표시용 date·source로 파생해 로우에 넘긴다. */
function NewsList({ newsItems }: NewsListProps) {
  return (
    <ul role="list" className={NEWS_LIST_CLASSNAME}>
      {newsItems.map((news) => (
        <li key={news.id}>
          <NewsRow
            title={news.title}
            description={news.description}
            link={news.link}
            date={formatPublishedAt(news.publishedAt)}
            source={getNewsSourceLabel(news.link)}
          />
        </li>
      ))}
    </ul>
  );
}

export { NewsList, type NewsListProps };
