/**
 * HighlightsPage 통합 테스트 (ST-6).
 *
 * - 최초 로딩 중에는 스켈레톤만 렌더된다(필터 바·그리드 없음).
 * - 로딩 후 헤더·필터 바·결과 개수·그리드가 렌더된다(대표 영상은 그리드에서 제외).
 * - 카테고리 필터 클릭 시 그리드가 갱신되고 페이지가 1로 리셋된다.
 * - 정렬 변경 시 그리드 순서가 바뀐다.
 * - 페이지네이션 클릭 시 다음 페이지 항목으로 교체된다.
 * - 결과가 없는 카테고리를 선택하면 빈 상태(StateBox)가 렌더된다.
 *
 * fetchDelayMs=0 + 소스 주입으로 결정적으로 만든다. Nav/Footer는 app/layout 소관이라 기대하지 않는다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { HighlightsPage } from '@pages/highlights';
import type { HighlightItem } from '@pages/highlights/model';

afterEach(cleanup);

/** id1만 featured, 카테고리·조회수·날짜를 의도적으로 분산한 결정적 목데이터. */
const makeItems = (): HighlightItem[] => [
  { id: '1', title: '골 A', category: '골', competition: 'PL', date: '2025.05.10', views: '1.0M', duration: '1:00', featured: true },
  { id: '2', title: '골 B', category: '골', competition: 'PL', date: '2025.05.01', views: '3.0M', duration: '1:00' },
  { id: '3', title: '세이브 A', category: '세이브', competition: 'PL', date: '2025.04.01', views: '2.0M', duration: '1:00' },
];

describe('HighlightsPage', () => {
  it('최초 로딩 중에는 스켈레톤만 렌더한다', () => {
    const { container } = render(
      <HighlightsPage source={makeItems} fetchDelayMs={1000} />,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
  });

  it('로딩 후 헤더·필터 바·결과 개수·그리드를 렌더한다(대표 영상은 그리드에서 제외)', async () => {
    render(<HighlightsPage source={makeItems} fetchDelayMs={0} />);

    expect(screen.getByRole('heading', { level: 1, name: '하이라이트' })).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('radiogroup', { name: '카테고리 필터' })).toBeInTheDocument(),
    );

    // rest = 골B, 세이브A (골A는 featured라 그리드에서 제외)
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '골 A' })).toBeInTheDocument();
  });

  it('카테고리 필터 클릭 시 그리드가 갱신되고 페이지가 1로 리셋된다', async () => {
    const user = userEvent.setup();
    render(<HighlightsPage source={makeItems} fetchDelayMs={0} pageSize={1} />);

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1));
    // 페이지 2로 이동(pageSize=1이면 rest 2건이라 페이저가 보임)
    await user.click(screen.getByRole('button', { name: '2' }));
    await waitFor(() => expect(screen.getByText('세이브 A')).toBeInTheDocument());

    await user.click(screen.getByRole('radio', { name: '세이브' }));

    await waitFor(() => {
      expect(screen.getByText('세이브 A')).toBeInTheDocument();
    });
    expect(screen.queryByText('골 B')).not.toBeInTheDocument();
    // 페이지가 1로 리셋되어 페이저가 사라진다(세이브 카테고리엔 1건뿐).
    expect(screen.queryByRole('navigation', { name: '페이지 네비게이션' })).not.toBeInTheDocument();
  });

  it('정렬 변경 시 그리드 순서가 바뀐다(조회순: 골B(3.0M) > 세이브A(2.0M))', async () => {
    const user = userEvent.setup();
    render(<HighlightsPage source={makeItems} fetchDelayMs={0} />);

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));

    await user.click(screen.getByRole('radio', { name: /조회순/ }));

    await waitFor(() => {
      const titles = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent);
      expect(titles).toEqual(['골 B', '세이브 A']);
    });
  });

  it('페이지네이션 클릭 시 다음 페이지 항목으로 교체된다', async () => {
    const user = userEvent.setup();
    render(<HighlightsPage source={makeItems} fetchDelayMs={0} pageSize={1} />);

    await waitFor(() => expect(screen.getByText('골 B')).toBeInTheDocument());
    expect(screen.queryByText('세이브 A')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() => expect(screen.getByText('세이브 A')).toBeInTheDocument());
    expect(screen.queryByText('골 B')).not.toBeInTheDocument();
  });

  it('결과가 없는 카테고리를 선택하면 빈 상태(StateBox)가 렌더된다', async () => {
    const user = userEvent.setup();
    render(<HighlightsPage source={makeItems} fetchDelayMs={0} />);

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));

    await user.click(screen.getByRole('radio', { name: '어시스트' }));

    await waitFor(() =>
      expect(screen.getByText('해당 카테고리 영상이 없어요')).toBeInTheDocument(),
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('showFeatured=false면 대표 영상 없이 전체 항목이 그리드에 노출된다', async () => {
    render(<HighlightsPage source={makeItems} fetchDelayMs={0} showFeatured={false} />);

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(3));
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });
});
