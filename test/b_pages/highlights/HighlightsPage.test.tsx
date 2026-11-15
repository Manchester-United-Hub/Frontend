import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';

import { getHighlightList } from '@entities/highlight/api/client';
import type { HighlightListQueryDTO } from '@entities/highlight/model';
import { HighlightsPage, type HighlightsPageProps } from '@pages/highlights';
import { buildHighlightDTO, buildHighlightListDTO } from '@test/fixtures/highlights';

vi.mock('@entities/highlight/api/client', () => ({
  getHighlightList: vi.fn(),
}));

const SEASON = 2026;
const LIST_META = { totalElements: 5, totalPages: 2 };

const toDTOs = (titles: string[]) =>
  titles.map((title) => buildHighlightDTO({ videoId: title.toLowerCase(), title }));

const RESPONSES: Record<string, ReturnType<typeof buildHighlightListDTO>> = {
  'LATEST-0': buildHighlightListDTO(toDTOs(['A', 'B', 'C']), LIST_META),
  'LATEST-1': buildHighlightListDTO(toDTOs(['D', 'E']), { ...LIST_META, page: 1 }),
  'VIEW_COUNT-0': buildHighlightListDTO(toDTOs(['C', 'A', 'B']), LIST_META),
};

const respondByQuery = async ({ sort, page }: HighlightListQueryDTO) => ({
  success: true as const,
  data: RESPONSES[`${sort}-${page}`],
  error: null,
});

const renderPage = (props: Partial<HighlightsPageProps> = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <HighlightsPage season={SEASON} {...props} />
    </QueryClientProvider>,
  );
};

const gridTitles = () => screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent);

const waitForGrid = (titles: string[]) => waitFor(() => expect(gridTitles()).toEqual(titles));

afterEach(cleanup);

describe('HighlightsPage', () => {
  beforeEach(() => {
    vi.mocked(getHighlightList).mockReset();
    vi.mocked(getHighlightList).mockImplementation(respondByQuery);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  it('최초 로딩 중에는 스켈레톤만 렌더한다', () => {
    const { container } = renderPage();

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('로딩 후 정렬 바·전체 개수·대표 영상·그리드를 렌더하고 카테고리 필터는 없다', async () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: '하이라이트' })).toBeInTheDocument();
    await waitForGrid(['B', 'C']);

    expect(screen.getByRole('radiogroup', { name: '정렬 방식' })).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: '카테고리 필터' })).not.toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'A' })).toBeInTheDocument();
    expect(screen.getByText('최신 영상')).toBeInTheDocument();
  });

  it('조회순을 누르면 대표 영상이 조회순 1위로 바뀌고 라벨이 최다 조회가 된다', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForGrid(['B', 'C']);

    await user.click(screen.getByRole('radio', { name: /조회순/ }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument(),
    );
    expect(screen.getByText('최다 조회')).toBeInTheDocument();
    expect(gridTitles()).toEqual(['A', 'B']);
  });

  it('2페이지로 이동하면 대표 영상 없이 그리드만 바뀌고 페이지 맨 위로 스크롤한다', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitForGrid(['B', 'C']);

    await user.click(screen.getByRole('button', { name: '2' }));

    await waitForGrid(['D', 'E']);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('showFeatured=false면 대표 영상 없이 1페이지 전체가 그리드에 노출된다', async () => {
    renderPage({ showFeatured: false });

    await waitForGrid(['A', 'B', 'C']);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('카드는 해당 영상의 YouTube 시청 페이지로 연결된다', async () => {
    renderPage();
    await waitForGrid(['B', 'C']);

    expect(screen.getByRole('link', { name: 'B' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=b',
    );
  });

  it('조회에 실패하면 에러 상태를 렌더한다', async () => {
    vi.mocked(getHighlightList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });
    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('하이라이트를 불러오지 못했어요');
  });
});
