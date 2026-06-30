/**
 * SquadPreviewSection 단위 테스트.
 *
 * 검증 목적:
 * - 현역(active) / 은퇴(retired) 분기 배지 텍스트 렌더
 * - 선수 영문 이름 렌더 (Bruno Fernandes / Rasmus Højlund / Kobbie Mainoo)
 * - 은퇴 선수 이름 + 재임 기간 렌더 (Wayne Rooney / 2004–2017)
 * - ul[role=list] li 4개 렌더
 * - 현역 선수 meta "현재 소속" 렌더
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
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

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

import { SquadPreviewSection } from '@pages/landing/ui/SquadPreviewSection';
import { squadPlayers } from '@pages/landing/model/mockData';

describe('SquadPreviewSection', () => {
  it('현역 선수 "현역" 텍스트 렌더', () => {
    const { container } = render(<SquadPreviewSection players={squadPlayers} />);
    expect(container.textContent).toContain('현역');
  });

  it('은퇴 선수 "은퇴" 텍스트 렌더 (웨인 루니)', () => {
    const { container } = render(<SquadPreviewSection players={squadPlayers} />);
    expect(container.textContent).toContain('은퇴');
    expect(container.textContent).toContain('Wayne Rooney');
  });

  it('현역 선수 3명 이름(en) 렌더', () => {
    const { container } = render(<SquadPreviewSection players={squadPlayers} />);
    const text = container.textContent ?? '';
    expect(text).toContain('Bruno Fernandes');
    expect(text).toContain('Rasmus Højlund');
    expect(text).toContain('Kobbie Mainoo');
  });

  it('선수 li 4개 렌더', () => {
    const { container } = render(<SquadPreviewSection players={squadPlayers} />);
    const list = container.querySelector('ul[role="list"]');
    expect(list).not.toBeNull();
    const items = list!.querySelectorAll('li');
    expect(items).toHaveLength(4);
  });

  it('은퇴 선수 meta에 재임 기간 렌더 (2004–2017)', () => {
    const { container } = render(<SquadPreviewSection players={squadPlayers} />);
    expect(container.textContent).toContain('2004–2017');
  });

  it('현역 선수 meta "현재 소속" 렌더', () => {
    const { container } = render(<SquadPreviewSection players={squadPlayers} />);
    expect(container.textContent).toContain('현재 소속');
  });
});
