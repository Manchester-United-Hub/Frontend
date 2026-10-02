import { useInfiniteQuery } from '@tanstack/react-query';

import { newsQueries } from './newsQueries';

const useNewsInfiniteList = (pageSize?: number) => useInfiniteQuery(newsQueries.infiniteList(pageSize));

export { useNewsInfiniteList };
