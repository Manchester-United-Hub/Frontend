/**
 * SeasonTabs 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * ST-08(A-2 slot 주입): SeasonTabs가 `season` prop 대신
 * `{ matchesPanel, standingsPanel }: ReactNode` slot을 받는 순수 배치
 * 컴포넌트로 바뀌었다(src/b_pages/season/ui/SeasonTabs/SeasonTabs.tsx).
 * React Query·`@entities/matches/api`·`@entities/rank/api` 의존이 전부
 * 사라져 기존의 vi.mock·QueryClientProvider 래퍼를 제거했다 — 실제 패널
 * 데이터 조회는 이제 서버 컴포넌트(SchedulePanel/StandingsPanel)의 몫이라
 * (S-16, jsdom에서 렌더 불가) 이 테스트는 더미 ReactNode를 slot에 주입해
 * "SeasonTabs가 활성 탭에 맞는 slot만 배치하는가"만 검증한다.
 *
 * 검증 목적: 기본 활성 탭(matches)일 때 matchesPanel slot만 렌더되고
 * standingsPanel은 DOM에 없음, 탭 전환 시 slot이 완전히 교체됨
 * (SeasonTabs.tsx가 `{TAB_PANELS[activeId]}`로 활성 탭 하나만 렌더하는
 * 구조라 비활성 탭의 콘텐츠는 언마운트된다), 접근성 계약
 * (id="tab-{id}"/aria-controls ↔ id="panel-{id}"/aria-labelledby), 탭 전환
 * 시 항상 정확히 1개 tabpanel만 렌더.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { SeasonTabs } from '@pages/season/ui/SeasonTabs';

const matchesPanel = <p>MATCHES_PANEL_MARKER</p>;
const standingsPanel = <p>STANDINGS_PANEL_MARKER</p>;

function renderSeasonTabs() {
  return render(
    <SeasonTabs matchesPanel={matchesPanel} standingsPanel={standingsPanel} />
  );
}

afterEach(cleanup);

describe('SeasonTabs', () => {
  it('기본 활성 탭은 matches — matchesPanel slot만 렌더되고 standingsPanel은 렌더되지 않는다', () => {
    renderSeasonTabs();

    expect(screen.getByRole('tab', { name: /일정/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText('MATCHES_PANEL_MARKER')).toBeInTheDocument();
    expect(
      screen.queryByText('STANDINGS_PANEL_MARKER')
    ).not.toBeInTheDocument();
  });

  it('순위표 탭 클릭 시 standingsPanel slot으로 전환되고 matchesPanel은 사라진다', async () => {
    const user = userEvent.setup();
    renderSeasonTabs();

    await user.click(screen.getByRole('tab', { name: /순위표/ }));

    expect(screen.getByRole('tab', { name: /순위표/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText('STANDINGS_PANEL_MARKER')).toBeInTheDocument();
    expect(
      screen.queryByText('MATCHES_PANEL_MARKER')
    ).not.toBeInTheDocument();
  });

  it('탭의 id/aria-controls가 대응 tabpanel의 id/aria-labelledby와 짝을 이룬다', async () => {
    const user = userEvent.setup();
    renderSeasonTabs();

    const tableTab = screen.getByRole('tab', { name: /순위표/ });
    expect(tableTab).toHaveAttribute('id', 'tab-table');
    expect(tableTab).toHaveAttribute('aria-controls', 'panel-table');

    await user.click(tableTab);

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-table');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-table');
  });

  it('탭을 오가도 항상 정확히 1개의 tabpanel만 렌더된다', async () => {
    const user = userEvent.setup();
    renderSeasonTabs();

    await user.click(screen.getByRole('tab', { name: /순위표/ }));
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

    await user.click(screen.getByRole('tab', { name: /일정/ }));
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByText('MATCHES_PANEL_MARKER')).toBeInTheDocument();
  });
});
