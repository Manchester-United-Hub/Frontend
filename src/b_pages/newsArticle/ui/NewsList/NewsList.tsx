import { formatPublishedAt } from '../../model';
import type { ArticleItem } from '../../model';
import { ArticleRow } from '../ArticleRow';

/**
 * 기사 로우 리스트 폭 — media.css `.art-list` 스펙: flex column, margin-top 24px, border-top.
 * NewsSkeleton이 로딩 상태에서 동일 레이아웃을 유지하도록 이 클래스를 재노출해 공유한다.
 */
export const NEWS_LIST_CLASSNAME = 'mt-6 flex flex-col border-t border-border';

interface NewsListProps {
  articles: ArticleItem[];
}

/** 기사 목록 로우 리스트 — publishedAt은 여기서 표시용으로 포맷해 로우에 넘긴다. */
function NewsList({ articles }: NewsListProps) {
  return (
    <ul role="list" className={NEWS_LIST_CLASSNAME}>
      {articles.map((article) => (
        <li key={article.id}>
          <ArticleRow
            title={article.title}
            description={article.description}
            link={article.link}
            date={formatPublishedAt(article.publishedAt)}
          />
        </li>
      ))}
    </ul>
  );
}

export { NewsList, type NewsListProps };
