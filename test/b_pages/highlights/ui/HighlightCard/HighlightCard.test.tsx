import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HighlightCard } from '@pages/highlights/ui/HighlightCard';

afterEach(cleanup);

const baseProps = {
  title: '회일룬 리버풀전 극장골',
  category: '골',
  competition: '프리미어리그',
  date: '2025.05.18',
  views: '2.4M',
  duration: '1:42',
};

describe('HighlightCard', () => {
  it('제목·카테고리·대회·조회수·날짜를 렌더하고 카드 전체가 링크로 연결된다', () => {
    render(<HighlightCard {...baseProps} />);

    expect(screen.getByRole('heading', { level: 3, name: baseProps.title })).toBeInTheDocument();
    expect(screen.getByText(baseProps.competition)).toBeInTheDocument();
    expect(screen.getByText(baseProps.views)).toBeInTheDocument();
    expect(screen.getByText(baseProps.date)).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#');
  });

  it('카테고리 배지 텍스트를 노출한다', () => {
    render(<HighlightCard {...baseProps} />);

    expect(screen.getAllByText(baseProps.category).length).toBeGreaterThan(0);
  });

  it('듀레이션을 워터마크·코너 배지 두 곳에 노출한다', () => {
    render(<HighlightCard {...baseProps} />);

    expect(screen.getAllByText(baseProps.duration)).toHaveLength(2);
  });

  it('재생 아이콘은 카드 자체가 링크이므로 별도 접근 가능 이름 없이 장식용(aria-hidden)으로 처리된다', () => {
    const { container } = render(<HighlightCard {...baseProps} />);

    const decorativeIcon = container.querySelector('[aria-hidden="true"]');
    expect(decorativeIcon).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
