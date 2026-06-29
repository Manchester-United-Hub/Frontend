import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SearchInput } from '@shared/ui';

afterEach(cleanup);

describe('SearchInput', () => {
  it('기본 aria-label "검색"의 검색 입력을 렌더한다', () => {
    render(<SearchInput placeholder="선수·경기 검색" />);
    const input = screen.getByRole('searchbox', { name: '검색' });
    expect(input).toHaveAttribute('placeholder', '선수·경기 검색');
  });

  it('shortcut을 주면 kbd 힌트를 렌더한다', () => {
    render(<SearchInput shortcut="/" />);
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('shortcut이 없으면 kbd가 없다', () => {
    const { container } = render(<SearchInput />);
    expect(container.querySelector('kbd')).toBeNull();
  });
});
