/**
 * SeasonPage 통합 테스트 — QA 검증. clubInfo `ClubPage.test.tsx` 패턴을 미러링했다.
 *
 * 검증 목적:
 * - 런타임 에러 없이 마운트, 히어로·요약 카드 렌더
 * - 초기 탭 = fixtures(일정 & 결과)
 * - 탭 접근성 계약: role=tablist/tab/tabpanel, aria-selected/aria-controls/aria-labelledby 짝
 * - 순위표 탭 전환 시 테이블 렌더
 * - 필터 적용 시 일정 패널 내 행 수가 줄어든다
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { SeasonPage } from '@pages/season';

afterEach(cleanup);

describe('SeasonPage 스모크', () => {
  it('런타임 에러 없이 마운트되고 <main> 존재', () => {
    const { container } = render(<SeasonPage />);
    expect(container.querySelector('main')).not.toBeNull();
  });

  it('히어로(h1 "시즌")와 요약 카드 4개가 렌더된다', () => {
    render(<SeasonPage />);
    expect(screen.getByRole('heading', { level: 1, name: '시즌' })).toBeInTheDocument();
    const summaryList = screen.getByRole('list', { name: '시즌 요약 정보' });
    expect(within(summaryList).getAllByRole('listitem')).toHaveLength(4);
  });

  it('초기 탭은 fixtures — "일정 & 결과" 패널이 기본 렌더된다', () => {
    render(<SeasonPage />);
    expect(screen.getByRole('tab', { name: /일정/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: '일정 & 결과' })).toBeInTheDocument();
  });

  it('tablist/tab 개수 = 2, tabpanel 1개만 렌더', () => {
    render(<SeasonPage />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  });
});

describe('SeasonPage 서브탭 전환·필터', () => {
  it('순위표 탭 클릭 시 tab/tabpanel 접근성 계약이 짝을 이루고 테이블이 렌더된다', async () => {
    const user = userEvent.setup();
    render(<SeasonPage />);

    const tableTab = screen.getByRole('tab', { name: /순위표/ });
    expect(tableTab).toHaveAttribute('id', 'tab-table');
    expect(tableTab).toHaveAttribute('aria-controls', 'panel-table');

    await user.click(tableTab);

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-table');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-table');
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('홈 필터를 선택하면 일정 패널의 행 수가 줄어든다', async () => {
    const user = userEvent.setup();
    render(<SeasonPage />);

    const panel = screen.getByRole('tabpanel');
    const before = within(panel).getAllByRole('listitem').length;

    await user.click(screen.getByRole('button', { name: '홈' }));

    const after = within(panel).getAllByRole('listitem').length;
    expect(after).toBeLessThan(before);
    expect(after).toBeGreaterThan(0);
  });

  it('연속으로 탭을 오가도 매번 정확히 1개 tabpanel만 남는다(연속 동작 일관성)', async () => {
    const user = userEvent.setup();
    render(<SeasonPage />);

    const order = [/순위표/, /일정/, /순위표/, /일정/];
    for (const name of order) {
      await user.click(screen.getByRole('tab', { name }));
      expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    }
    expect(screen.getByRole('tab', { name: /일정/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: '일정 & 결과' })).toBeInTheDocument();
  });
});
