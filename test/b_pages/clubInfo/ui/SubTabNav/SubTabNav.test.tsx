/**
 * SubTabNav 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage), code-conventions §6
 * 컴포넌트 1:테스트 1 미러링 완성.
 *
 * 검증 목적: role=tablist/tab 렌더, aria-selected, "준비 중" 뱃지 2개(soon),
 * onChange 콜백 호출, id="tab-{id}"/aria-controls="panel-{id}" 접근성 계약.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { SubTabNav } from '@pages/clubInfo/ui/SubTabNav';
import { subTabs } from '@pages/clubInfo/model/mockData';

afterEach(cleanup);

describe('SubTabNav', () => {
  it('role=tablist와 6개의 role=tab을 렌더한다', () => {
    render(<SubTabNav tabs={subTabs} activeId="history" onChange={() => {}} />);
    expect(screen.getByRole('tablist', { name: '구단 정보 하위 탭' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(6);
  });

  it('activeId와 일치하는 탭만 aria-selected=true이다', () => {
    render(<SubTabNav tabs={subTabs} activeId="manager" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: /^감독/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /연혁/ })).toHaveAttribute('aria-selected', 'false');
  });

  it('soon 탭(하이라이트·팀통계)에만 "준비 중" 뱃지가 렌더된다(2개)', () => {
    render(<SubTabNav tabs={subTabs} activeId="history" onChange={() => {}} />);
    expect(screen.getAllByText('준비 중')).toHaveLength(2);
  });

  it('탭 클릭 시 onChange가 해당 탭 id로 호출된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SubTabNav tabs={subTabs} activeId="history" onChange={onChange} />);

    await user.click(screen.getByRole('tab', { name: /홈구장/ }));
    expect(onChange).toHaveBeenCalledWith('stadium');
  });

  it('각 탭은 id="tab-{id}"·aria-controls="panel-{id}" 접근성 계약을 만족한다', () => {
    render(<SubTabNav tabs={subTabs} activeId="history" onChange={() => {}} />);
    const squadTab = screen.getByRole('tab', { name: /선수정보/ });
    expect(squadTab).toHaveAttribute('id', 'tab-squad');
    expect(squadTab).toHaveAttribute('aria-controls', 'panel-squad');
  });
});
