import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';

import Highlights, * as highlightsRoute from '@app/highlights/page';
import { getSeasonInfo } from '@entities/seasonInfo/api/server';
import { fetchHighlightList } from '@entities/highlight/api/server';
import { getHighlightList } from '@entities/highlight/api/client';
import type { HighlightListQueryDTO } from '@entities/highlight/model';
import { buildHighlightDTO, buildHighlightListDTO } from '@test/fixtures/highlights';

vi.mock('@entities/seasonInfo/api/server', () => ({
  getSeasonInfo: vi.fn(),
}));
vi.mock('@entities/highlight/api/server', () => ({
  fetchHighlightList: vi.fn(),
}));
vi.mock('@entities/highlight/api/client', () => ({
  getHighlightList: vi.fn(),
}));

const SEASON_START_YEAR = 2026;

const LATEST_DTO = buildHighlightListDTO([
  buildHighlightDTO({ videoId: 'a', title: 'A | Highlights' }),
  buildHighlightDTO({ videoId: 'b', title: 'B | Highlights' }),
]);
const VIEW_COUNT_DTO = buildHighlightListDTO([
  buildHighlightDTO({ videoId: 'b', title: 'B | Highlights' }),
  buildHighlightDTO({ videoId: 'a', title: 'A | Highlights' }),
]);

const firstPageQuery = (sort: HighlightListQueryDTO['sort']) => ({
  season: SEASON_START_YEAR,
  sort,
  page: 0,
  size: 9,
});

// 앱 QueryClient처럼 기본 gcTime을 쓴다. gcTime 0이면 아직 구독자가 없는 조회순 prefetch 데이터가 hydrate 직후 사라진다.
const renderHighlights = async () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>{await Highlights()}</QueryClientProvider>,
  );
};

afterEach(cleanup);

describe('/highlights route page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSeasonInfo).mockResolvedValue({
      startYear: SEASON_START_YEAR,
      label: '2026/27',
      status: 'ongoing',
    });
  });

  it('revalidate는 300초다', () => {
    expect(highlightsRoute.revalidate).toBe(300);
  });

  it('최신순·조회순 1페이지를 모두 프리페치해 초기 렌더와 정렬 전환 모두 클라이언트 조회 없이 보인다', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchHighlightList).mockImplementation(async ({ sort }) => ({
      isSuccess: true,
      status: 200,
      data: sort === 'VIEW_COUNT' ? VIEW_COUNT_DTO : LATEST_DTO,
    }));

    const { container } = await renderHighlights();

    expect(fetchHighlightList).toHaveBeenCalledWith(firstPageQuery('LATEST'));
    expect(fetchHighlightList).toHaveBeenCalledWith(firstPageQuery('VIEW_COUNT'));
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'A | Highlights' })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /조회순/ }));

    expect(screen.getByRole('heading', { level: 2, name: 'B | Highlights' })).toBeInTheDocument();
    expect(getHighlightList).not.toHaveBeenCalled();
  });

  it('서버 프리페치가 실패해도 throw하지 않고 클라이언트가 BFF로 이어서 조회한다', async () => {
    vi.mocked(fetchHighlightList).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' },
    });
    vi.mocked(getHighlightList).mockResolvedValue({ success: true, data: LATEST_DTO, error: null });

    await renderHighlights();

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1));
    expect(getHighlightList).toHaveBeenCalledWith(firstPageQuery('LATEST'));
  });
});
