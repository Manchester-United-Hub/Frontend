import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Badge } from '@shared/ui';

afterEach(cleanup);

describe('Badge', () => {
  it('children을 렌더한다', () => {
    render(<Badge>신규</Badge>);
    expect(screen.getByText('신규')).toBeInTheDocument();
  });

  it('variant=live면 점멸 도트(animate-pulse)를 함께 렌더한다', () => {
    const { container } = render(<Badge variant="live">다음 경기</Badge>);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('기본 variant에는 점멸 도트가 없다', () => {
    const { container } = render(<Badge>D-3</Badge>);
    expect(container.querySelector('.animate-pulse')).toBeNull();
  });

  it('variant=position은 united-red 배경을 적용한다', () => {
    render(<Badge variant="position">MF</Badge>);
    expect(screen.getByText('MF')).toHaveClass('bg-united-red');
  });
});
