/**
 * GoBackButton 단위 테스트 (ST-4).
 *
 * 검증 목적:
 * - 클릭 시 window.history.back()이 정확히 1회 호출되는가
 * - 버튼 접근명이 '이전 페이지'인가
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

afterEach(cleanup);

import { GoBackButton } from '@pages/notFound/ui/GoBackButton';

describe('GoBackButton', () => {
  it("접근명 '이전 페이지'로 버튼이 렌더된다", () => {
    render(<GoBackButton />);
    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeInTheDocument();
  });

  it('클릭 시 window.history.back()이 1회 호출된다', async () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const user = userEvent.setup();

    render(<GoBackButton />);
    await user.click(screen.getByRole('button', { name: '이전 페이지' }));

    expect(backSpy).toHaveBeenCalledTimes(1);

    backSpy.mockRestore();
  });
});
