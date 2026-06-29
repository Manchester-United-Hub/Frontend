import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ResultBadge } from '@shared/ui';

afterEach(cleanup);

describe('ResultBadge', () => {
  it.each([
    ['W', 'bg-win'],
    ['D', 'bg-draw'],
    ['L', 'bg-loss'],
  ] as const)('결과 %s는 %s 클래스를 적용한다', (result, cls) => {
    render(<ResultBadge result={result} />);
    expect(screen.getByText(result)).toHaveClass(cls);
  });

  it.each([
    ['W', '승'],
    ['D', '무'],
    ['L', '패'],
  ] as const)('결과 %s를 스크린리더에 "%s"로 전달한다', (result, label) => {
    render(<ResultBadge result={result} />);
    expect(screen.getByRole('img', { name: label })).toBeInTheDocument();
  });
});
