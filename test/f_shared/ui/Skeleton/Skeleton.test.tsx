import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Skeleton } from '@shared/ui';

afterEach(cleanup);

describe('Skeleton', () => {
  it('animate-pulse와 aria-hidden을 가진 박스를 렌더하고 className을 병합한다', () => {
    const { container } = render(<Skeleton className="h-4 w-20" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('animate-pulse');
    expect(el).toHaveAttribute('aria-hidden');
    expect(el).toHaveClass('h-4', 'w-20');
  });
});
