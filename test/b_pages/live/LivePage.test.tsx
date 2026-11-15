import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { LivePage } from '@pages/live';
import {
  CLOSED_MATCH_FIXTURE,
  LIVE_MATCH_FIXTURE,
} from '@test/fixtures/liveMatch';

afterEach(cleanup);

describe('LivePage', () => {
  it('경기 중이면 <main> 안에 스코어보드를 렌더한다', () => {
    const { container } = render(<LivePage match={LIVE_MATCH_FIXTURE} />);
    expect(container.querySelector('main')).not.toBeNull();
    expect(
      screen.getByRole('region', { name: '스코어보드' })
    ).toBeInTheDocument();
  });

  it('경기 중 화면에는 숨김 h1이 하나 있다', () => {
    render(<LivePage match={LIVE_MATCH_FIXTURE} />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('라이브 경기');
    expect(headings[0]).toHaveClass('sr-only');
  });

  it('경기 중이면 비경기 안내를 렌더하지 않는다', () => {
    render(<LivePage match={LIVE_MATCH_FIXTURE} />);
    expect(screen.queryByText('경기중에만 오픈됩니다.')).toBeNull();
  });

  it('비경기면 안내 화면만 렌더하고 스코어보드는 없다', () => {
    const { container } = render(<LivePage match={CLOSED_MATCH_FIXTURE} />);
    expect(screen.getByText('경기중에만 오픈됩니다.')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '스코어보드' })).toBeNull();
    expect(container.querySelectorAll('main')).toHaveLength(1);
  });
});
