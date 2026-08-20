/**
 * FeaturedMatchPanel 단위 테스트.
 *
 * 검증 목적:
 * - 경쟁대회·팀 코드·팀명·경기장 렌더
 * - time 있음 → 날짜 뒤에 시간 표기 (match.time != null 분기)
 * - time 없음 → 시간 미표기 (false 분기)
 * - countdown 없음 → '—' 폴백 렌더 (match.countdown ?? '—' 분기)
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

import { FeaturedMatchPanel } from '@pages/landing/ui/HeroSection';
import { nextMatch } from '@pages/landing/model/mockData';
import type { MatchItem } from '@pages/landing/model/types';

/** time·countdown이 없는 최소 경기 (옵션 필드 부재 분기 검증용) */
const minimalMatch: MatchItem = {
  variant: 'next',
  tag: '다음 경기',
  competition: '프리미어리그 · 33R',
  home: { code: 'MUN', name: '맨체스터 유나이티드' },
  away: { code: 'ARS', name: '아스널' },
  venue: '에미레이츠',
  date: '5월 25일 (일)',
};

describe('FeaturedMatchPanel', () => {
  it('팀 코드·경기장·경쟁대회 렌더', () => {
    const { container } = render(<FeaturedMatchPanel match={nextMatch} />);
    expect(container.textContent).toContain(nextMatch.home.code);
    expect(container.textContent).toContain(nextMatch.away.code);
    expect(container.textContent).toContain(nextMatch.venue);
    expect(container.textContent).toContain(nextMatch.competition);
  });

  it('time·countdown 있으면 시간·카운트다운 렌더 (truthy 분기)', () => {
    const { container } = render(<FeaturedMatchPanel match={nextMatch} />);
    expect(container.textContent).toContain('23:30 KST');
    expect(container.textContent).toContain('D-3');
  });

  it('time 없으면 날짜만 렌더하고 시간 미표기 (match.time != null false 분기)', () => {
    const { container } = render(<FeaturedMatchPanel match={minimalMatch} />);
    expect(container.textContent).toContain('5월 25일 (일)');
    expect(container.textContent).not.toContain('KST');
  });

  it('countdown 없으면 "—" 폴백 렌더 (match.countdown ?? "—" 분기)', () => {
    const { container } = render(<FeaturedMatchPanel match={minimalMatch} />);
    expect(container.textContent).toContain('—');
  });
});
