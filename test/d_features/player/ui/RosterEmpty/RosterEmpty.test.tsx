/**
 * RosterEmpty 단위 테스트.
 *
 * 검증 목적:
 * - 빈 상태 title/description 렌더
 * - "필터 초기화" 버튼 클릭 시 onReset 호출
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { RosterEmpty } from '@features/player/ui/RosterEmpty';

afterEach(cleanup);

describe('RosterEmpty', () => {
  it('제목·설명을 렌더한다', () => {
    render(<RosterEmpty onReset={vi.fn()} />);
    expect(screen.getByText('조건에 맞는 선수가 없어요')).toBeInTheDocument();
    expect(
      screen.getByText('필터나 검색어를 바꿔 다시 시도해 보세요.'),
    ).toBeInTheDocument();
  });

  it('"필터 초기화" 버튼을 렌더한다', () => {
    render(<RosterEmpty onReset={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /필터 초기화/ }),
    ).toBeInTheDocument();
  });

  it('"필터 초기화" 버튼 클릭 시 onReset을 호출한다', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<RosterEmpty onReset={onReset} />);
    await user.click(screen.getByRole('button', { name: /필터 초기화/ }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
