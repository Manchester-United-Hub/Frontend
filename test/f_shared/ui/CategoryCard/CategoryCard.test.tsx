import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';
import type { Route } from 'next';

import { CategoryCard } from '@shared/ui';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

describe('CategoryCard', () => {
  it('아이콘·한영 라벨·설명·기본 goLabel을 렌더한다', () => {
    render(
      <CategoryCard
        icon={<svg data-testid="icon" />}
        name="구단"
        nameEn="Club"
        description="연혁·홈구장·팀 통계"
      />
    );
    expect(screen.getByText('구단')).toBeInTheDocument();
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.getByText('연혁·홈구장·팀 통계')).toBeInTheDocument();
    expect(screen.getByText('바로가기')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('href를 주면 링크로 렌더된다', () => {
    render(
      <CategoryCard
        icon={<svg />}
        name="구단"
        nameEn="Club"
        description="d"
        href={'/club' as Route}
      />
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/club');
  });

  it('href가 없으면 링크가 아니다', () => {
    render(
      <CategoryCard icon={<svg />} name="구단" nameEn="Club" description="d" />
    );
    expect(screen.queryByRole('link')).toBeNull();
  });
});
