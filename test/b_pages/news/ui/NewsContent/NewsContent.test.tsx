import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { NewsContent } from '@pages/news/ui/NewsContent';
import type { NewsItem } from '@pages/news/model';

afterEach(cleanup);

const newsItems: NewsItem[] = [
  { id: 1, title: 'A', description: 'a', link: 'la', originalLink: 'oa', publishedAt: '2025-01-04T00:00' },
];
const noop = () => {};

describe('NewsContent', () => {
  it('로딩 중이면 스켈레톤을 렌더한다', () => {
    const { container } = render(
      <NewsContent
        isLoading
        newsItems={[]}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={noop}
      />,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('기사가 없으면 빈 상태를 렌더한다', () => {
    render(
      <NewsContent
        isLoading={false}
        newsItems={[]}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={noop}
      />,
    );

    expect(screen.getByText('표시할 기사가 없어요')).toBeInTheDocument();
  });

  it('에러 상태이면 에러 컴포넌트를 렌더한다', () => {
    render(
      <NewsContent
        isLoading={false}
        isError
        newsItems={[]}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={noop}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('기사를 불러오지 못했어요')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('onRetry가 전달되면 에러 상태에 재시도 버튼을 패스스루한다(M-1)', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <NewsContent
        isLoading={false}
        isError
        newsItems={[]}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={noop}
        onRetry={onRetry}
      />,
    );

    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('로딩 중이면 에러 상태보다 스켈레톤을 우선 렌더한다', () => {
    render(
      <NewsContent
        isLoading
        isError
        newsItems={[]}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={noop}
      />,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('기사가 있으면 카운트와 리스트를 렌더하고, 다음 페이지가 없으면 버튼을 숨긴다', () => {
    render(
      <NewsContent
        isLoading={false}
        newsItems={newsItems}
        hasNextPage={false}
        isFetchingNextPage={false}
        onLoadMore={noop}
      />,
    );

    expect(screen.getByText('개의 기사', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(String(newsItems.length))).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('다음 페이지가 남아 있으면 카운트를 숨긴다(부분 개수를 총계로 오인 방지)', () => {
    render(
      <NewsContent
        isLoading={false}
        newsItems={newsItems}
        hasNextPage
        isFetchingNextPage={false}
        onLoadMore={noop}
      />,
    );

    expect(screen.queryByText('개의 기사', { exact: false })).not.toBeInTheDocument();
  });

  it('다음 페이지가 있으면 더 보기 버튼 클릭 시 콜백을 호출한다', async () => {
    const onLoadMore = vi.fn();
    const user = userEvent.setup();
    render(
      <NewsContent
        isLoading={false}
        newsItems={newsItems}
        hasNextPage
        isFetchingNextPage={false}
        onLoadMore={onLoadMore}
      />,
    );

    await user.click(screen.getByRole('button', { name: '기사 더 보기' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('불러오는 중이면 버튼이 비활성화되고 라벨이 바뀐다', () => {
    render(
      <NewsContent
        isLoading={false}
        newsItems={newsItems}
        hasNextPage
        isFetchingNextPage
        onLoadMore={noop}
      />,
    );

    expect(screen.getByRole('button', { name: '불러오는 중…' })).toBeDisabled();
  });
});
