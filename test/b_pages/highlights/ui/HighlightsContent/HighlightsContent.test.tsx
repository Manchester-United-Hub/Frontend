import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { HighlightsContent } from '@pages/highlights/ui/HighlightsContent';
import { buildHighlightItem } from '@test/fixtures/highlights';

afterEach(cleanup);

const featured = buildHighlightItem({
  id: 'f1',
  title: '대표 영상',
  watchUrl: 'https://www.youtube.com/watch?v=f1',
});

const gridItems = [
  buildHighlightItem({ id: 'g1', title: '그리드 A', watchUrl: 'https://www.youtube.com/watch?v=g1' }),
  buildHighlightItem({ id: 'g2', title: '그리드 B' }),
];

const noop = () => {};

const baseProps = {
  sortKey: 'LATEST' as const,
  page: 1,
  isLoading: false,
  isError: false,
  refetch: noop,
  changeSort: noop,
  goToPage: noop,
};

const loadedProps = {
  ...baseProps,
  featured,
  pageItems: gridItems,
  totalCount: gridItems.length,
  totalPages: 1,
};

describe('HighlightsContent', () => {
  it('로딩 중이면 스켈레톤만 렌더하고 필터 바·그리드는 렌더하지 않는다', () => {
    const { container } = render(
      <HighlightsContent
        {...baseProps}
        isLoading
        featured={undefined}
        pageItems={[]}
        totalCount={0}
        totalPages={0}
      />,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('조회에 실패하면 에러 상태를 렌더하고 다시 시도 시 refetch를 호출한다', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    render(
      <HighlightsContent
        {...baseProps}
        isError
        refetch={refetch}
        featured={undefined}
        pageItems={[]}
        totalCount={0}
        totalPages={0}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('하이라이트를 불러오지 못했어요');
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(refetch).toHaveBeenCalledOnce();
  });

  it('로딩이 끝나면 필터 바·결과 개수·그리드를 렌더한다', () => {
    render(<HighlightsContent {...loadedProps} featured={undefined} />);

    expect(screen.getByRole('radiogroup', { name: '정렬 방식' })).toBeInTheDocument();
    expect(screen.getByText(String(gridItems.length))).toBeInTheDocument();
    expect(screen.getByText(/개의 영상/)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('시즌 영상이 대표 1건뿐이면 대표 영상만 렌더하고 그리드는 렌더하지 않는다', () => {
    render(<HighlightsContent {...loadedProps} pageItems={[]} totalCount={1} totalPages={1} />);

    expect(screen.getByRole('heading', { level: 2, name: '대표 영상' })).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('시즌에 영상이 하나도 없으면 시즌 빈 상태만 렌더한다', () => {
    render(
      <HighlightsContent
        {...baseProps}
        featured={undefined}
        pageItems={[]}
        totalCount={0}
        totalPages={0}
      />,
    );

    expect(
      screen.getByRole('heading', { name: '아직 등록된 하이라이트가 없어요' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('showFeatured=true이고 featured가 있으면 정렬에 맞는 라벨과 함께 FeaturedHighlight를 렌더한다', () => {
    const { rerender } = render(<HighlightsContent {...loadedProps} showFeatured />);

    expect(screen.getByRole('heading', { level: 2, name: '대표 영상' })).toBeInTheDocument();
    expect(screen.getByText('최신 영상')).toBeInTheDocument();

    rerender(<HighlightsContent {...loadedProps} sortKey="VIEW_COUNT" showFeatured />);

    expect(screen.getByText('최다 조회')).toBeInTheDocument();
  });

  it('showFeatured=false면 featured가 있어도 FeaturedHighlight를 렌더하지 않는다', () => {
    render(<HighlightsContent {...loadedProps} showFeatured={false} />);

    expect(screen.queryByRole('heading', { level: 2, name: '대표 영상' })).not.toBeInTheDocument();
  });

  it('totalPages가 1 이하면 페이저를 렌더하지 않는다', () => {
    render(<HighlightsContent {...loadedProps} />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('totalPages가 2 이상이면 페이저를 렌더한다', () => {
    render(<HighlightsContent {...loadedProps} totalPages={2} />);

    expect(screen.getByRole('navigation', { name: '페이지 네비게이션' })).toBeInTheDocument();
  });

  it('페이지 버튼을 누르면 goToPage를 호출하고 페이지 맨 위로 스크롤한다', async () => {
    const user = userEvent.setup();
    const goToPage = vi.fn();
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<HighlightsContent {...loadedProps} totalPages={2} goToPage={goToPage} />);

    await user.click(screen.getByRole('button', { name: '2' }));

    expect(goToPage).toHaveBeenCalledWith(2);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('대표 영상과 그리드 카드는 각자의 YouTube 시청 링크를 갖고 재생 모달은 렌더하지 않는다', () => {
    render(<HighlightsContent {...loadedProps} />);

    expect(screen.getByRole('link', { name: '대표 영상 YouTube에서 보기 (새 탭)' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=f1',
    );
    expect(screen.getByRole('link', { name: '그리드 A' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=g1',
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
