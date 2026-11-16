import type { HighlightListSort } from '@entities/highlight/model';

type HighlightSortKey = HighlightListSort;

interface HighlightItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  embedUrl: string;
  watchUrl: string;
  date: string;
  views: string | null;
}

interface UseHighlightsResult {
  sortKey: HighlightSortKey;
  page: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  featured: HighlightItem | undefined;
  pageItems: HighlightItem[];
  totalCount: number;
  totalPages: number;
  changeSort: (sortKey: HighlightSortKey) => void;
  goToPage: (page: number) => void;
}

export type { HighlightSortKey, HighlightItem, UseHighlightsResult };
