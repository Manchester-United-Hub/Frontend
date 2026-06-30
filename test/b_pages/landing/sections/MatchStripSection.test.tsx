/**
 * MatchStripSection 단위 테스트.
 *
 * 검증 목적:
 * - status 4분기: ready / loading / empty / error
 * - status 미전달 시 기본값(ready) 동작
 * - 섹션 aria-labelledby 시맨틱
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

import { MatchStripSection } from '@pages/landing/ui/MatchStripSection';
import { recentMatch, nextMatch } from '@pages/landing/model/mockData';
import type { MatchItem } from '@pages/landing/model/types';

describe('MatchStripSection 상태 분기', () => {
  it('ready → MatchCard 팀명("맨체스터 유나이티드") 렌더', () => {
    const { container } = render(
      <MatchStripSection status="ready" recent={recentMatch} next={nextMatch} />,
    );
    expect(container.textContent).toContain('맨체스터 유나이티드');
  });

  it('ready → 과거 경기 에버턴 렌더', () => {
    const { container } = render(
      <MatchStripSection status="ready" recent={recentMatch} next={nextMatch} />,
    );
    expect(container.textContent).toContain('에버턴');
  });

  it('loading → Skeleton aria-hidden 자리표시자 렌더 — 팀명 없음', () => {
    const { container } = render(
      <MatchStripSection status="loading" recent={recentMatch} next={nextMatch} />,
    );
    expect(container.querySelectorAll('[aria-hidden]').length).toBeGreaterThan(0);
    expect(container.textContent).not.toContain('에버턴');
    expect(container.textContent).not.toContain('맨체스터 유나이티드');
  });

  it('empty → StateBox(empty) — "예정된 경기가 없어요" 렌더', () => {
    const { container } = render(
      <MatchStripSection status="empty" recent={recentMatch} next={nextMatch} />,
    );
    expect(container.textContent).toContain('예정된 경기가 없어요');
  });

  it('error → StateBox(error) — role=alert + 에러 제목 렌더', () => {
    const { container } = render(
      <MatchStripSection status="error" recent={recentMatch} next={nextMatch} />,
    );
    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(container.textContent).toContain('경기 정보를 불러오지 못했어요');
  });

  it('default prop (status 미전달) → ready와 동일하게 팀명 렌더', () => {
    const { container } = render(<MatchStripSection recent={recentMatch} next={nextMatch} />);
    expect(container.textContent).toContain('맨체스터 유나이티드');
  });

  it('섹션 aria-labelledby 시맨틱 존재', () => {
    const { container } = render(
      <MatchStripSection status="ready" recent={recentMatch} next={nextMatch} />,
    );
    const section = container.querySelector('section[aria-labelledby]');
    expect(section).not.toBeNull();
  });

  /* ── 다음 경기 옵션 필드 분기 (time·countdown 부재) ───────────────────── */

  it('next에 time·countdown 없으면 날짜만 렌더하고 카운트다운 Badge 미표시', () => {
    const nextNoTime: MatchItem = {
      variant: 'next',
      tag: '다음 경기',
      competition: '프리미어리그 · 33R',
      home: { code: 'MUN', name: '맨체스터 유나이티드' },
      away: { code: 'ARS', name: '아스널' },
      venue: '에미레이츠',
      date: '5월 25일 (일)',
    };
    const { container } = render(
      <MatchStripSection status="ready" recent={recentMatch} next={nextNoTime} />,
    );
    expect(container.textContent).toContain('5월 25일 (일)');
    // countdown 부재 → 기본 데이터의 'D-3' Badge가 나타나지 않음
    expect(container.textContent).not.toContain('D-3');
  });
});
