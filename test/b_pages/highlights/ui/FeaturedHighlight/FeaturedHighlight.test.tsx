import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { FeaturedHighlight } from '@pages/highlights/ui/FeaturedHighlight';

afterEach(cleanup);

const baseProps = {
  title: '회일룬 리버풀전 극장골',
  category: '골',
  competition: '프리미어리그',
  date: '2025.05.18',
  views: '2.4M',
  duration: '1:42',
  description: '후반 추가시간 극적인 결승골로 올드 트래포드를 열광시켰다.',
};

describe('FeaturedHighlight', () => {
  it('h2 제목·설명·카테고리/대회 배지·조회수·날짜를 렌더한다', () => {
    render(<FeaturedHighlight {...baseProps} />);

    expect(screen.getByRole('heading', { level: 2, name: baseProps.title })).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
    expect(screen.getByText(baseProps.category)).toBeInTheDocument();
    expect(screen.getByText(baseProps.competition)).toBeInTheDocument();
    expect(screen.getByText(baseProps.views)).toBeInTheDocument();
    expect(screen.getByText(baseProps.date)).toBeInTheDocument();
  });

  it('듀레이션을 워터마크·Clock 배지 두 곳에 노출한다', () => {
    render(<FeaturedHighlight {...baseProps} />);

    expect(screen.getAllByText(baseProps.duration)).toHaveLength(2);
  });

  it('재생 버튼은 접근 가능한 이름을 갖는 실제 버튼 요소로 렌더된다', () => {
    render(<FeaturedHighlight {...baseProps} />);

    const playButton = screen.getByRole('button', { name: '대표 영상 재생' });
    expect(playButton).toHaveAttribute('type', 'button');
  });
});
