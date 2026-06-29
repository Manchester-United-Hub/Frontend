import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';
import type { Route } from 'next';

import { Button } from '@shared/ui';

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

describe('Button', () => {
  it('기본 모드는 type=button 버튼으로 children을 렌더한다', () => {
    render(<Button>저장</Button>);
    expect(screen.getByRole('button', { name: '저장' })).toHaveAttribute(
      'type',
      'button'
    );
  });

  it('mode=submit이면 type=submit이다', () => {
    render(<Button mode="submit">전송</Button>);
    expect(screen.getByRole('button', { name: '전송' })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('mode=link에 togo가 있으면 링크(앵커)로 렌더된다', () => {
    render(
      <Button mode="link" togo={'/season' as Route}>
        시즌
      </Button>
    );
    expect(screen.getByRole('link', { name: '시즌' })).toHaveAttribute(
      'href',
      '/season'
    );
  });

  it('mode=link인데 togo가 없으면 에러를 던진다', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Button mode="link">missing</Button>)).toThrow();
    spy.mockRestore();
  });

  it('variant=red는 united-red 배경 클래스를 적용한다', () => {
    render(<Button variant="red">알림</Button>);
    expect(screen.getByRole('button', { name: '알림' })).toHaveClass(
      'bg-united-red'
    );
  });

  it('전달한 className이 variant 기본 클래스를 덮어쓴다(twMerge)', () => {
    render(
      <Button variant="primary" className="bg-blue-500">
        x
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'x' });
    expect(btn).toHaveClass('bg-blue-500');
    expect(btn).not.toHaveClass('bg-primary');
  });

  it('mode=link에 disabled면 링크 대신 비활성 요소로 렌더된다', () => {
    render(
      <Button mode="link" togo={'/x' as Route} disabled>
        비활성
      </Button>
    );
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('비활성')).toHaveAttribute('aria-disabled', 'true');
  });

  it('mode=icon은 size=icon(정사각형)을 자동 적용한다', () => {
    render(
      <Button mode="icon" aria-label="메뉴">
        x
      </Button>
    );
    expect(screen.getByRole('button', { name: '메뉴' })).toHaveClass('w-10');
  });
});
