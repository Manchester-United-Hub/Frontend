import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { HighlightsFilterBar } from '@pages/highlights/ui/HighlightsFilterBar';

afterEach(cleanup);

describe('HighlightsFilterBar', () => {
  it('카테고리 radiogroup과 정렬 radiogroup을 함께 렌더한다', () => {
    render(
      <HighlightsFilterBar
        category="전체"
        onCategoryChange={() => {}}
        sortKey="recent"
        onSortChange={() => {}}
      />
    );
    expect(screen.getByRole('radiogroup', { name: '카테고리 필터' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: '정렬 방식' })).toBeInTheDocument();
  });

  it('sortKey에 맞는 정렬 옵션이 선택 상태(aria-checked=true)이다', () => {
    render(
      <HighlightsFilterBar
        category="전체"
        onCategoryChange={() => {}}
        sortKey="views"
        onSortChange={() => {}}
      />
    );
    expect(screen.getByRole('radio', { name: /조회순/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /최신순/ })).toHaveAttribute('aria-checked', 'false');
  });

  it('카테고리 pill 클릭 시 onCategoryChange가 호출된다', async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();
    render(
      <HighlightsFilterBar
        category="전체"
        onCategoryChange={onCategoryChange}
        sortKey="recent"
        onSortChange={() => {}}
      />
    );

    await user.click(screen.getByRole('radio', { name: '세이브' }));
    expect(onCategoryChange).toHaveBeenCalledWith('세이브');
  });

  it('정렬 세그먼트 클릭 시 onSortChange가 호출된다', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <HighlightsFilterBar
        category="전체"
        onCategoryChange={() => {}}
        sortKey="recent"
        onSortChange={onSortChange}
      />
    );

    await user.click(screen.getByRole('radio', { name: /조회순/ }));
    expect(onSortChange).toHaveBeenCalledWith('views');
  });
});
