import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { DEFAULT_NEWS_SKELETON_COUNT, NewsSkeleton } from '@pages/newsArticle/ui/NewsSkeleton';

afterEach(cleanup);

describe('NewsSkeleton', () => {
  it('기본 개수만큼 스켈레톤 카드를 렌더하고 aria-hidden 처리한다', () => {
    const { container } = render(<NewsSkeleton />);
    const wrapper = container.querySelector('[aria-hidden="true"]');

    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.children).toHaveLength(DEFAULT_NEWS_SKELETON_COUNT);
  });

  it('count로 카드 개수를 조절한다', () => {
    const { container } = render(<NewsSkeleton count={3} />);

    expect(container.querySelector('[aria-hidden="true"]')?.children).toHaveLength(3);
  });
});
