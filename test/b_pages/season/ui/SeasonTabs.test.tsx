/**
 * SeasonTabs 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: 기본 활성 탭(fixtures), 탭 전환(일정↔순위표), 접근성 계약
 * (id="tab-{id}"/aria-controls ↔ id="panel-{id}"/aria-labelledby), 탭 전환 시
 * 항상 정확히 1개 tabpanel만 렌더.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { SeasonTabs } from '@pages/season/ui/SeasonTabs';

afterEach(cleanup);

describe('SeasonTabs', () => {
  it('기본 활성 탭은 fixtures — "일정 & 결과" 패널이 렌더된다', () => {
    render(<SeasonTabs />);
    expect(screen.getByRole('tab', { name: /일정/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: '일정 & 결과' })).toBeInTheDocument();
  });

  it('순위표 탭 클릭 시 StandingsTab(테이블) 패널로 전환된다', async () => {
    const user = userEvent.setup();
    render(<SeasonTabs />);
    await user.click(screen.getByRole('tab', { name: /순위표/ }));

    expect(screen.getByRole('tab', { name: /순위표/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: '순위표' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('탭의 id/aria-controls가 대응 tabpanel의 id/aria-labelledby와 짝을 이룬다', async () => {
    const user = userEvent.setup();
    render(<SeasonTabs />);

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
    render(<SeasonTabs />);

    await user.click(screen.getByRole('tab', { name: /순위표/ }));
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

    await user.click(screen.getByRole('tab', { name: /일정/ }));
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: '일정 & 결과' })).toBeInTheDocument();
  });
});
