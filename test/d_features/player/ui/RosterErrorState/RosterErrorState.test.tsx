/**
 * RosterErrorState 단위 테스트.
 *
 * 검증 목적:
 * - 에러 상태 title/description 렌더
 * - onRetry 미지정 시 "다시 시도" 버튼 미렌더
 * - onRetry 지정 시 버튼 렌더 + 클릭 시 호출
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { RosterErrorState } from '@features/player/ui/RosterErrorState';

afterEach(cleanup);

describe('RosterErrorState', () => {
  it('제목·설명을 렌더한다', () => {
    render(<RosterErrorState />);
    expect(screen.getByText('선수 목록을 불러오지 못했어요')).toBeInTheDocument();
    expect(screen.getByText('잠시 후 다시 시도해 주세요.')).toBeInTheDocument();
  });

  it('alert 역할을 렌더한다', () => {
    render(<RosterErrorState />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('onRetry 미지정 시 "다시 시도" 버튼을 렌더하지 않는다', () => {
    render(<RosterErrorState />);
    expect(screen.queryByRole('button', { name: /다시 시도/ })).not.toBeInTheDocument();
  });

  it('onRetry 지정 시 "다시 시도" 버튼을 렌더하고 클릭하면 호출한다', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<RosterErrorState onRetry={onRetry} />);
    const button = screen.getByRole('button', { name: /다시 시도/ });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
