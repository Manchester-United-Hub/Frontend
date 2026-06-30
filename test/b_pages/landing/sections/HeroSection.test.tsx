/**
 * HeroSection 단위 테스트.
 *
 * 검증 목적:
 * - Eyebrow · 헤드라인 accent 분리 · 서브카피 렌더
 * - CTA 버튼 2개 렌더
 * - stats 3개(리그 우승 / UCL 우승 / 창단) 렌더
 * - FeaturedMatchPanel — nextMatch 팀 코드·경기장 렌더
 * - aria 시맨틱 (h1#hero-heading, section aria-labelledby)
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

import { HeroSection } from '@pages/landing/ui/HeroSection';
import { heroContent, nextMatch } from '@pages/landing/model/mockData';

describe('HeroSection', () => {
  it('Eyebrow 텍스트 렌더', () => {
    const { container } = render(<HeroSection content={heroContent} nextMatch={nextMatch} />);
    expect(container.textContent).toContain(heroContent.eyebrow);
  });

  it('헤드라인 accent 분리 렌더 (accent 텍스트 존재)', () => {
    const { container } = render(<HeroSection content={heroContent} nextMatch={nextMatch} />);
    expect(container.textContent).toContain(heroContent.accent);
  });

  it('서브카피 렌더', () => {
    const { container } = render(<HeroSection content={heroContent} nextMatch={nextMatch} />);
    expect(container.textContent).toContain('경기 일정과 결과');
  });

  it('CTA 버튼 2개 렌더 (선수 둘러보기 / 시즌 일정)', () => {
    const { container } = render(<HeroSection content={heroContent} nextMatch={nextMatch} />);
    expect(container.textContent).toContain('선수 둘러보기');
    expect(container.textContent).toContain('시즌 일정');
  });

  it('stats 3개 모두 렌더 (리그 우승 / UCL 우승 / 창단)', () => {
    const { container } = render(<HeroSection content={heroContent} nextMatch={nextMatch} />);
    heroContent.stats.forEach((stat) => {
      expect(container.textContent).toContain(stat.label);
      expect(container.textContent).toContain(stat.num);
    });
  });

  it('FeaturedMatchPanel — nextMatch 팀 코드·경기장 렌더', () => {
    const { container } = render(<HeroSection content={heroContent} nextMatch={nextMatch} />);
    expect(container.textContent).toContain(nextMatch.home.code);
    expect(container.textContent).toContain(nextMatch.away.code);
    expect(container.textContent).toContain(nextMatch.venue);
  });

  it('h1 id=hero-heading 존재 — aria-labelledby 연결', () => {
    const { container } = render(<HeroSection content={heroContent} nextMatch={nextMatch} />);
    expect(container.querySelector('h1#hero-heading')).not.toBeNull();
  });

  it('section aria-labelledby="hero-heading" 존재', () => {
    const { container } = render(<HeroSection content={heroContent} nextMatch={nextMatch} />);
    expect(
      container.querySelector('section[aria-labelledby="hero-heading"]'),
    ).not.toBeNull();
  });
});
