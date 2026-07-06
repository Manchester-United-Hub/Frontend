import { formatPublishedAt } from '../../model';
import type { ArticleItem } from '../../model';
import { ArticleCard } from '../ArticleCard';

/**
 * 기사 카드 그리드 폭 — media.css `.art-grid` 스펙: 3 → (≤980) 2 → (≤620) 1열.
 * NewsSkeleton이 로딩 상태에서 동일 폭을 유지하도록 이 클래스를 재노출해 공유한다.
 */
export const NEWS_GRID_CLASSNAME =
  'grid grid-cols-3 gap-[18px] max-[980px]:grid-cols-2 max-[620px]:grid-cols-1';

interface NewsGridProps {
  articles: ArticleItem[];
}

/** 기사 목록 카드 그리드 — publishedAt은 여기서 표시용으로 포맷해 카드에 넘긴다. */
function NewsGrid({ articles }: NewsGridProps) {
  return (
    <ul role="list" className={NEWS_GRID_CLASSNAME}>
      {articles.map((article) => (
        <li key={article.id}>
          <ArticleCard
            title={article.title}
            description={article.description}
            link={article.link}
            date={formatPublishedAt(article.publishedAt)}
            imageUrl={article.imageUrl}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  );
}

export { NewsGrid, type NewsGridProps };
