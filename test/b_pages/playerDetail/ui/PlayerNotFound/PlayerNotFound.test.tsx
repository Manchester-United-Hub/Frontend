/**
 * PlayerNotFound 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 필수 시나리오(plan.json verification.qa_guidance #3): 미존재 playerId →
 * PlayerNotFound(StateBox + '선수 목록으로' /players 링크).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { PlayerNotFound } from '@pages/playerDetail/ui';

afterEach(cleanup);

describe('PlayerNotFound', () => {
  it('<main> 안에 role=alert StateBox와 제목을 렌더한다', () => {
    const { container } = render(<PlayerNotFound />);
    expect(container.querySelector('main')).not.toBeNull();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
  });

  it('"선수 목록으로" 액션이 /players로 이동하는 링크로 렌더된다', () => {
    render(<PlayerNotFound />);
    const link = screen.getByRole('link', { name: /선수 목록으로/ });
    expect(link).toHaveAttribute('href', '/players');
  });
});
