/**
 * ErrorBoundary 단위 테스트.
 *
 * 검증 목적:
 * - 정상 렌더에서는 children을 그대로 통과시킨다
 * - children이 throw하면 fallback으로 대체한다
 * - fallback이 받은 reset을 호출하면 onReset을 거쳐 children 렌더를 다시 시도한다
 *
 * 에러 경계 테스트는 React가 콘솔로 에러를 다시 보고하므로 console.error를 침묵시킨다.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { ErrorBoundary } from '@shared/ui';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const renderRetry = (reset: () => void) => (
  <button type="button" onClick={reset}>
    다시 시도
  </button>
);

function Boom(): null {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('에러가 없으면 children을 렌더한다', () => {
    render(<ErrorBoundary fallback={renderRetry}>정상 콘텐츠</ErrorBoundary>);

    expect(screen.getByText('정상 콘텐츠')).toBeInTheDocument();
  });

  it('children이 throw하면 fallback을 렌더한다', () => {
    render(
      <ErrorBoundary fallback={renderRetry}>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });

  it('reset을 호출하면 onReset을 거쳐 children 렌더를 다시 시도한다', async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    let shouldThrow = true;

    function MaybeBoom() {
      if (shouldThrow) throw new Error('boom');
      return <p>복구됨</p>;
    }

    render(
      <ErrorBoundary onReset={onReset} fallback={renderRetry}>
        <MaybeBoom />
      </ErrorBoundary>
    );
    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByText('복구됨')).toBeInTheDocument();
  });
});
