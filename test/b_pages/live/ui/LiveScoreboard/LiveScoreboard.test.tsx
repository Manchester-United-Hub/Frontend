import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { LiveScoreboard } from '@pages/live/ui/LiveScoreboard';
import { LIVE_MATCH_FIXTURE } from '@test/fixtures/liveMatch';

afterEach(cleanup);

describe('LiveScoreboard', () => {
  it('스코어보드 영역을 이름 있는 section으로 렌더한다', () => {
    render(<LiveScoreboard match={LIVE_MATCH_FIXTURE} />);
    expect(
      screen.getByRole('region', { name: '스코어보드' })
    ).toBeInTheDocument();
  });

  it('LIVE 표시와 대회·경기장을 렌더한다', () => {
    render(<LiveScoreboard match={LIVE_MATCH_FIXTURE} />);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('프리미어리그 · 10라운드')).toBeInTheDocument();
    expect(screen.getByText('올드 트래퍼드')).toBeInTheDocument();
  });

  it('홈·원정 팀 이름, 코드, 구분 라벨을 렌더한다', () => {
    render(<LiveScoreboard match={LIVE_MATCH_FIXTURE} />);
    ['맨유', 'MUN', 'Home', '첼시', 'CHE', 'Away'].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('스코어를 홈 – 원정 순서로 렌더하고 그 영역에만 aria-live를 둔다', () => {
    const { container } = render(
      <LiveScoreboard match={LIVE_MATCH_FIXTURE} />
    );
    const liveRegions = container.querySelectorAll('[aria-live]');
    expect(liveRegions).toHaveLength(1);
    expect(liveRegions[0]).toHaveAttribute('aria-live', 'polite');
    expect(liveRegions[0]).toHaveTextContent('3 – 0');
  });

  it('진행 구간과 시계를 aria-live 밖에 렌더한다', () => {
    const { container } = render(
      <LiveScoreboard match={LIVE_MATCH_FIXTURE} />
    );
    const clock = screen.getByText("후반 72'");
    expect(clock).toBeInTheDocument();
    expect(container.querySelector('[aria-live]')).not.toContainElement(clock);
  });

  it('원정 팀 열은 오른쪽 정렬로 뒤집힌다', () => {
    render(<LiveScoreboard match={LIVE_MATCH_FIXTURE} />);
    const awayColumn = screen.getByText('첼시').closest('div');
    expect(awayColumn).toHaveClass('flex-row-reverse', 'text-right');
    const homeColumn = screen.getByText('맨유').closest('div');
    expect(homeColumn).not.toHaveClass('flex-row-reverse');
  });

  it('MU 워터마크는 접근성 트리에서 제외된다', () => {
    render(<LiveScoreboard match={LIVE_MATCH_FIXTURE} />);
    expect(screen.getByText('MU')).toHaveAttribute('aria-hidden', 'true');
  });
});
