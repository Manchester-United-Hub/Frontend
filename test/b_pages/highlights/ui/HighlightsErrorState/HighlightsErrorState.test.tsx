import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { HighlightsErrorState } from '@pages/highlights/ui/HighlightsErrorState';

afterEach(cleanup);

describe('HighlightsErrorState', () => {
  it('role=alert로 실패 안내를 렌더한다', () => {
    render(<HighlightsErrorState onRetry={vi.fn()} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('하이라이트를 불러오지 못했어요');
    expect(alert).toHaveTextContent('잠시 후 다시 시도해 주세요.');
  });

  it('다시 시도 버튼을 누르면 onRetry를 호출한다', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<HighlightsErrorState onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
