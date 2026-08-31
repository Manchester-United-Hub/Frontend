/**
 * RosterPager 단위 테스트.
 *
 * 검증 목적 — 시안 `.pager` 동작:
 * - 페이지가 하나면 아예 렌더하지 않는다
 * - 전체 페이지 수만큼 번호 버튼을 렌더하고 현재 페이지에 aria-current="page"를 준다
 * - 첫 페이지에서 "이전", 마지막 페이지에서 "다음"이 disabled다
 * - 이전/다음/번호 클릭이 onPageChange를 해당 페이지 번호로 호출한다
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { RosterPager } from '@features/player/ui/RosterPager';

afterEach(cleanup);

describe('RosterPager', () => {
  it('페이지가 하나뿐이면 렌더하지 않는다', () => {
    const { container } = render(
      <RosterPager page={1} totalPages={1} onPageChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('전체 페이지 수만큼 번호 버튼을 렌더한다', () => {
    render(<RosterPager page={1} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByRole('navigation', { name: '선수 목록 페이지' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1페이지' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2페이지' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3페이지' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '4페이지' })).not.toBeInTheDocument();
  });

  it('현재 페이지 버튼에만 aria-current="page"가 붙는다', () => {
    render(<RosterPager page={2} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: '2페이지' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '1페이지' })).not.toHaveAttribute('aria-current');
  });

  it('첫 페이지에서는 "이전 페이지"가 disabled다', () => {
    render(<RosterPager page={1} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeEnabled();
  });

  it('마지막 페이지에서는 "다음 페이지"가 disabled다', () => {
    render(<RosterPager page={3} totalPages={3} onPageChange={() => {}} />);

    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeEnabled();
  });

  it('이전/다음 클릭이 인접 페이지 번호로 onPageChange를 호출한다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<RosterPager page={2} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '이전 페이지' }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole('button', { name: '다음 페이지' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('번호 클릭이 해당 페이지로 onPageChange를 호출한다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<RosterPager page={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '3페이지' }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
