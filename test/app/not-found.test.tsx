/**
 * app/not-found.tsx 진입점 배선 테스트 (ST-4).
 *
 * 검증 목적: App Router 404 엔트리가 NotFoundPage를 정확히 배선해
 * 렌더 시 h1이 나오는가 (통합 스모크, 얇은 진입점이므로 상세 케이스는
 * NotFoundPage.test.tsx가 담당한다).
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';

afterEach(cleanup);

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={String(href)} className={className}>
      {children}
    </a>
  ),
}));

import NotFound from '@app/not-found';

describe('app/not-found 진입점', () => {
  it('렌더 시 h1이 나온다', () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector('h1')).not.toBeNull();
  });
});
