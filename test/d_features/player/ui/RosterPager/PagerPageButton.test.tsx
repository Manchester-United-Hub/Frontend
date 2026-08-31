/**
 * PagerPageButton 단위 테스트.
 *
 * 검증 목적:
 * - 페이지 번호를 텍스트로 렌더하고 접근명은 "N페이지"다
 * - isCurrent면 aria-current="page"가 붙는다
 * - 클릭 시 자기 페이지 번호로 onSelect가 호출된다
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { PagerPageButton } from '@features/player/ui/RosterPager/PagerPageButton';

afterEach(cleanup);

describe('PagerPageButton', () => {
  it('페이지 번호를 렌더하고 접근명을 "N페이지"로 준다', () => {
    render(<PagerPageButton pageNumber={4} isCurrent={false} onSelect={() => {}} />);

    const button = screen.getByRole('button', { name: '4페이지' });
    expect(button).toHaveTextContent('4');
    expect(button).not.toHaveAttribute('aria-current');
  });

  it('현재 페이지면 aria-current="page"가 붙는다', () => {
    render(<PagerPageButton pageNumber={4} isCurrent onSelect={() => {}} />);

    expect(screen.getByRole('button', { name: '4페이지' })).toHaveAttribute('aria-current', 'page');
  });

  it('클릭 시 자기 페이지 번호로 onSelect가 호출된다', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PagerPageButton pageNumber={4} isCurrent={false} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: '4페이지' }));

    expect(onSelect).toHaveBeenCalledWith(4);
  });
});
