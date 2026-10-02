import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { NewsErrorState } from '@pages/news/ui/NewsErrorState';

afterEach(cleanup);

describe('NewsErrorState', () => {
  it('에러 타이틀·설명을 렌더한다', () => {
    render(<NewsErrorState />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('기사를 불러오지 못했어요')).toBeInTheDocument();
  });

  it('onRetry가 없으면 재시도 버튼을 렌더하지 않는다', () => {
    render(<NewsErrorState />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('onRetry가 있으면 재시도 버튼을 렌더하고 클릭 시 콜백을 호출한다', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<NewsErrorState onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
