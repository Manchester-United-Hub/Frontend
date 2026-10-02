import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { HighlightsPager } from '@pages/highlights/ui/HighlightsPager';

afterEach(cleanup);

describe('HighlightsPager', () => {
  it('페이지 숫자 버튼을 전부 렌더하고 현재 페이지에 aria-current를 표시한다', () => {
    render(<HighlightsPager currentPage={2} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    const current = screen.getByRole('button', { name: '2' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('첫 페이지에서는 이전 버튼이 비활성화된다', () => {
    render(<HighlightsPager currentPage={1} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeEnabled();
  });

  it('마지막 페이지에서는 다음 버튼이 비활성화된다', () => {
    render(<HighlightsPager currentPage={3} totalPages={3} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '다음 페이지' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeEnabled();
  });

  it('숫자 버튼 클릭 시 해당 페이지 번호로 onPageChange를 호출한다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<HighlightsPager currentPage={1} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '3' }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('다음/이전 버튼 클릭 시 현재 페이지 기준 +1/-1로 onPageChange를 호출한다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<HighlightsPager currentPage={2} totalPages={3} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '다음 페이지' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    await user.click(screen.getByRole('button', { name: '이전 페이지' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });
});
