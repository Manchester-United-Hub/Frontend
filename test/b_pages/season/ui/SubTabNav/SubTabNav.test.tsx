/**
 * SubTabNav 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: role=tablist/tab 렌더(2탭), aria-selected, onChange 콜백 호출,
 * id="tab-{id}"/aria-controls="panel-{id}" 접근성 계약.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { SubTabNav, subTabs } from '@pages/season/ui';

afterEach(cleanup);

describe('SubTabNav', () => {
  it('role=tablist와 2개의 role=tab을 렌더한다', () => {
    render(<SubTabNav tabs={subTabs} activeId="matches" onChange={() => {}} />);
    expect(
      screen.getByRole('tablist', { name: '시즌 하위 탭' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('activeId와 일치하는 탭만 aria-selected=true이다', () => {
    render(<SubTabNav tabs={subTabs} activeId="table" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: /순위표/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: /일정/ })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('탭 클릭 시 onChange가 해당 탭 id로 호출된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SubTabNav tabs={subTabs} activeId="matches" onChange={onChange} />);

    await user.click(screen.getByRole('tab', { name: /순위표/ }));
    expect(onChange).toHaveBeenCalledWith('table');
  });

  it('각 탭은 id="tab-{id}"·aria-controls="panel-{id}" 접근성 계약을 만족한다', () => {
    render(<SubTabNav tabs={subTabs} activeId="matches" onChange={() => {}} />);
    const tableTab = screen.getByRole('tab', { name: /순위표/ });
    expect(tableTab).toHaveAttribute('id', 'tab-table');
    expect(tableTab).toHaveAttribute('aria-controls', 'panel-table');
  });
});
