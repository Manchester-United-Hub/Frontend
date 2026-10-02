/**
 * HeroSection 단위 테스트.
 *
 * 검증 목적:
 * - Eyebrow · 헤드라인 accent 분리 · 서브카피 렌더
 * - CTA 버튼 2개 렌더
 * - matchPanel 슬롯 — 전달된 노드를 그대로 렌더 (ST-006: nextMatch 데이터는 더 이상
 *   HeroSection이 알지 못하고 FeaturedMatchContainer가 소유한다. 데이터 의존이 사라져
 *   QueryClientProvider가 불필요하다)
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
import { heroContent } from '@pages/landing/model/configs';
import type { HeroContent } from '@pages/landing/model/types';
import type { Route } from 'next';

/** matchPanel 슬롯용 스텁 — HeroSection은 데이터를 모르므로 내용은 임의 노드면 된다. */
const MATCH_PANEL_STUB = (
  <div data-testid="match-panel-stub">스텁 매치 패널</div>
);

describe('HeroSection', () => {
  it('Eyebrow 텍스트 렌더', () => {
    const { container } = render(
      <HeroSection content={heroContent} matchPanel={MATCH_PANEL_STUB} />
    );
    expect(container.textContent).toContain(heroContent.eyebrow);
  });

  it('헤드라인 accent 분리 렌더 (accent 텍스트 존재)', () => {
    const { container } = render(
      <HeroSection content={heroContent} matchPanel={MATCH_PANEL_STUB} />
    );
    expect(container.textContent).toContain(heroContent.accent);
  });

  it('서브카피 렌더', () => {
    const { container } = render(
      <HeroSection content={heroContent} matchPanel={MATCH_PANEL_STUB} />
    );
    expect(container.textContent).toContain('경기 일정과 결과');
  });

  it('CTA 버튼 2개 렌더 (선수 둘러보기 / 시즌 일정)', () => {
    const { container } = render(
      <HeroSection content={heroContent} matchPanel={MATCH_PANEL_STUB} />
    );
    expect(container.textContent).toContain('선수 둘러보기');
    expect(container.textContent).toContain('시즌 일정');
  });

  it('matchPanel 슬롯 — 전달된 노드를 그대로 렌더 (컨테이너 분리 후 HeroSection은 데이터를 모른다)', () => {
    const { container } = render(
      <HeroSection content={heroContent} matchPanel={MATCH_PANEL_STUB} />
    );
    expect(
      container.querySelector('[data-testid="match-panel-stub"]')
    ).not.toBeNull();
    expect(container.textContent).toContain('스텁 매치 패널');
  });

  it('h1 id=hero-heading 존재 — aria-labelledby 연결', () => {
    const { container } = render(
      <HeroSection content={heroContent} matchPanel={MATCH_PANEL_STUB} />
    );
    expect(container.querySelector('h1#hero-heading')).not.toBeNull();
  });

  it('section aria-labelledby="hero-heading" 존재', () => {
    const { container } = render(
      <HeroSection content={heroContent} matchPanel={MATCH_PANEL_STUB} />
    );
    expect(
      container.querySelector('section[aria-labelledby="hero-heading"]')
    ).not.toBeNull();
  });

  /* ── 옵션 필드 분기 (mockData 기본값의 반대 케이스) ───────────────────── */

  it('accent가 headline에 없으면 분리 없이 전체 텍스트 렌더 (splitAtAccent -1 분기)', () => {
    const content: HeroContent = {
      ...heroContent,
      headline: '액센트 없는 헤드라인 문장',
      accent: '여기에없는단어',
    };
    const { container } = render(
      <HeroSection content={content} matchPanel={MATCH_PANEL_STUB} />
    );
    expect(container.textContent).toContain('액센트 없는 헤드라인 문장');
  });

  it('href 있는 CTA는 링크(mode=link)로 렌더 — red·outline variant 모두 (cta.href != null 분기)', () => {
    const content: HeroContent = {
      ...heroContent,
      ctas: [
        { label: '선수 보기', variant: 'red', href: '/players' as Route },
        { label: '일정 보기', variant: 'outline', href: '/season' as Route },
      ],
    };
    const { container } = render(
      <HeroSection content={content} matchPanel={MATCH_PANEL_STUB} />
    );
    const redLink = container.querySelector('a[href="/players"]');
    const outlineLink = container.querySelector('a[href="/season"]');
    expect(redLink).not.toBeNull();
    expect(redLink?.textContent).toContain('선수 보기');
    expect(outlineLink).not.toBeNull();
    expect(outlineLink?.textContent).toContain('일정 보기');
  });
});
