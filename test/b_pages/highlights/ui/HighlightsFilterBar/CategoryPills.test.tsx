import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { CategoryPills } from '@pages/highlights/ui/HighlightsFilterBar';
import { HIGHLIGHT_CATEGORIES } from '@pages/highlights/model';

afterEach(cleanup);

describe('CategoryPills', () => {
  it('HIGHLIGHT_CATEGORIES 개수만큼 role=radio를 렌더한다', () => {
    render(<CategoryPills value="전체" onChange={() => {}} />);
    expect(screen.getAllByRole('radio')).toHaveLength(HIGHLIGHT_CATEGORIES.length);
  });

  it('radiogroup에 aria-label을 부여한다', () => {
    render(<CategoryPills value="전체" onChange={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: '카테고리 필터' })).toBeInTheDocument();
  });

  it('value와 일치하는 카테고리만 aria-checked=true이다', () => {
    render(<CategoryPills value="골" onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: '골' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '전체' })).toHaveAttribute('aria-checked', 'false');
  });

  it('다른 카테고리 클릭 시 onChange가 해당 카테고리로 호출된다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CategoryPills value="전체" onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: '어시스트' }));
    expect(onChange).toHaveBeenCalledWith('어시스트');
  });
});
