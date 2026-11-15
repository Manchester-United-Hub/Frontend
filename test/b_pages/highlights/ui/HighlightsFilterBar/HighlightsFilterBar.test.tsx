import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { HighlightsFilterBar } from '@pages/highlights/ui/HighlightsFilterBar';

afterEach(cleanup);

describe('HighlightsFilterBar', () => {
  it('정렬 radiogroup만 렌더하고 카테고리 필터는 렌더하지 않는다', () => {
    render(<HighlightsFilterBar sortKey="LATEST" onSortChange={() => {}} />);

    expect(screen.getByRole('radiogroup', { name: '정렬 방식' })).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: '카테고리 필터' })).not.toBeInTheDocument();
  });

  it('sortKey에 맞는 정렬 옵션이 선택 상태(aria-checked=true)이다', () => {
    render(<HighlightsFilterBar sortKey="VIEW_COUNT" onSortChange={() => {}} />);

    expect(screen.getByRole('radio', { name: /조회순/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /최신순/ })).toHaveAttribute('aria-checked', 'false');
  });

  it('정렬 세그먼트 클릭 시 onSortChange가 API 정렬 값으로 호출된다', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<HighlightsFilterBar sortKey="LATEST" onSortChange={onSortChange} />);

    await user.click(screen.getByRole('radio', { name: /조회순/ }));

    expect(onSortChange).toHaveBeenCalledWith('VIEW_COUNT');
  });
});
