import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Eyebrow } from '@shared/ui';

afterEach(cleanup);

describe('Eyebrow', () => {
  it('children과 united-red tick 마크를 렌더한다', () => {
    const { container } = render(<Eyebrow>2025/26 PL</Eyebrow>);
    expect(screen.getByText('2025/26 PL')).toBeInTheDocument();
    expect(container.querySelector('.bg-united-red')).not.toBeNull();
  });
});
