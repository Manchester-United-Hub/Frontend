import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HighlightsSkeleton } from '@pages/highlights/ui/HighlightsSkeleton';

afterEach(cleanup);

describe('HighlightsSkeleton', () => {
  it('기본 개수(한 페이지 9장)만큼 스켈레톤 카드를 렌더하고 전체가 aria-hidden 처리된다', () => {
    const { container } = render(<HighlightsSkeleton />);

    const root = container.firstElementChild;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root?.children).toHaveLength(9);
  });

  it('count prop으로 개수를 지정할 수 있다', () => {
    const { container } = render(<HighlightsSkeleton count={3} />);

    const root = container.firstElementChild;
    expect(root?.children).toHaveLength(3);
  });
});
