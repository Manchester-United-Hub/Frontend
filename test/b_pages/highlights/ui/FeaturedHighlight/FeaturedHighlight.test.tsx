import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { FeaturedHighlight } from '@pages/highlights/ui/FeaturedHighlight';

afterEach(cleanup);

const baseProps = {
  title: 'Man Utd 0-3 Bournemouth | Highlights',
  label: '최신 영상',
  thumbnailUrl: 'https://pub-8dfe7ca8163c400aac6a83640c67edb4.r2.dev/highlights/wwFPqhC51oY.png',
  date: '2026.10.25',
  views: '809.1K',
  watchUrl: 'https://www.youtube.com/watch?v=wwFPqhC51oY',
};

describe('FeaturedHighlight', () => {
  it('h2 제목·정렬 라벨·조회수·날짜를 렌더한다', () => {
    render(<FeaturedHighlight {...baseProps} />);

    expect(screen.getByRole('heading', { level: 2, name: baseProps.title })).toBeInTheDocument();
    expect(screen.getByText(baseProps.label)).toBeInTheDocument();
    expect(screen.getByText(baseProps.views)).toBeInTheDocument();
    expect(screen.getByText(baseProps.date)).toBeInTheDocument();
  });

  it('썸네일은 장식 이미지(alt="")로 렌더한다', () => {
    const { container } = render(<FeaturedHighlight {...baseProps} />);

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('views가 null이면 조회수를 렌더하지 않는다', () => {
    render(<FeaturedHighlight {...baseProps} views={null} />);

    expect(screen.queryByText(baseProps.views)).not.toBeInTheDocument();
  });

  it('재생 링크는 영상 제목을 담은 이름을 갖고 YouTube 시청 페이지를 새 탭으로 연다', () => {
    render(<FeaturedHighlight {...baseProps} />);

    const link = screen.getByRole('link', { name: `${baseProps.title} YouTube에서 보기 (새 탭)` });
    expect(link).toHaveAttribute('href', baseProps.watchUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noreferrer');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
