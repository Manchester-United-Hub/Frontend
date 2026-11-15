import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ClosedView } from '@pages/live/ui/ClosedView';

afterEach(cleanup);

describe('ClosedView', () => {
  it('<main> 안에 헤드라인을 h1 하나로 렌더한다', () => {
    const { container } = render(<ClosedView />);
    expect(container.querySelector('main')).not.toBeNull();
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('경기중에만 오픈됩니다.');
  });

  it('Match Centre 라벨과 안내 문구 2줄을 렌더한다', () => {
    render(<ClosedView />);
    expect(screen.getByText('Match Centre')).toBeInTheDocument();
    expect(
      screen.getByText('지금은 경기 중인 내용이 없습니다.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('경기 중에만 라이브 페이지가 열립니다.')
    ).toBeInTheDocument();
  });

  it('시즌 일정 보기 링크는 /season으로 이동한다', () => {
    render(<ClosedView />);
    expect(screen.getByRole('link', { name: '시즌 일정 보기' })).toHaveAttribute(
      'href',
      '/season'
    );
  });

  it('홈으로 링크는 /로 이동한다', () => {
    render(<ClosedView />);
    expect(screen.getByRole('link', { name: '홈으로' })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('링크는 두 개뿐이다', () => {
    render(<ClosedView />);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
