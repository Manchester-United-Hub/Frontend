/**
 * NewsContent 단위 테스트.
 *
 * NewsContent가 useNewsFeed를 직접 호출하도록 바뀌면서(페이지 → 콘텐츠로 데이터 페칭 이동),
 * 상태 주입 지점이 props에서 훅으로 옮겨졌다. 4단 분기(로딩 → 에러 → 0건 → 리스트) 검증은
 * 그대로 두고, 시나리오별 상태는 useNewsFeed를 vi.mock해 주입한다.
 * 실제 react-query 연동은 NewsPage.test.tsx가 getNewsList mock으로 커버한다.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { NewsContent } from '@pages/news/ui/NewsContent';
import { useNewsFeed } from '@pages/news/model';
import type { NewsItem, UseNewsFeedResult } from '@pages/news/model';

vi.mock('@pages/news/model', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@pages/news/model')>()),
  useNewsFeed: vi.fn(),
}));

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

const newsItems: NewsItem[] = [
  { id: 1, title: 'A', description: 'a', link: 'la', originalLink: 'oa', publishedAt: '2025-01-04T00:00' },
];
const noop = () => {};

const mockFeed = (overrides: Partial<UseNewsFeedResult> = {}) => {
  const feed: UseNewsFeedResult = {
    newsItems: [],
    isLoading: false,
    isError: false,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: noop,
    refetch: noop,
    ...overrides,
  };
  vi.mocked(useNewsFeed).mockReturnValue(feed);
  return feed;
};

describe('NewsContent', () => {
  it('로딩 중이면 스켈레톤을 렌더한다', () => {
    mockFeed({ isLoading: true });

    const { container } = render(<NewsContent />);

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('기사가 없으면 빈 상태를 렌더한다', () => {
    mockFeed();

    render(<NewsContent />);

    expect(screen.getByText('표시할 기사가 없어요')).toBeInTheDocument();
  });

  it('에러 상태이면 에러 컴포넌트를 렌더한다', () => {
    mockFeed({ isError: true });

    render(<NewsContent />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('기사를 불러오지 못했어요')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('에러 상태에서 다시 시도를 누르면 refetch를 호출한다(M-1)', async () => {
    const refetch = vi.fn();
    const user = userEvent.setup();
    mockFeed({ isError: true, refetch });

    render(<NewsContent />);

    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('로딩 중이면 에러 상태보다 스켈레톤을 우선 렌더한다', () => {
    mockFeed({ isLoading: true, isError: true });

    render(<NewsContent />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('기사가 있으면 카운트와 리스트를 렌더하고, 다음 페이지가 없으면 버튼을 숨긴다', () => {
    mockFeed({ newsItems });

    render(<NewsContent />);

    expect(screen.getByText('개의 기사', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(String(newsItems.length))).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('다음 페이지가 남아 있으면 카운트를 숨긴다(부분 개수를 총계로 오인 방지)', () => {
    mockFeed({ newsItems, hasNextPage: true });

    render(<NewsContent />);

    expect(screen.queryByText('개의 기사', { exact: false })).not.toBeInTheDocument();
  });

  it('다음 페이지가 있으면 더 보기 버튼 클릭 시 콜백을 호출한다', async () => {
    const fetchNextPage = vi.fn();
    const user = userEvent.setup();
    mockFeed({ newsItems, hasNextPage: true, fetchNextPage });

    render(<NewsContent />);

    await user.click(screen.getByRole('button', { name: '기사 더 보기' }));
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('불러오는 중이면 버튼이 비활성화되고 라벨이 바뀐다', () => {
    mockFeed({ newsItems, hasNextPage: true, isFetchingNextPage: true });

    render(<NewsContent />);

    expect(screen.getByRole('button', { name: '불러오는 중…' })).toBeDisabled();
  });
});
