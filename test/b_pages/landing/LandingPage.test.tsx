/**
 * LandingPage 통합 스모크 테스트.
 *
 * 검증 목적:
 * - 런타임 에러 없이 마운트 가능
 * - <main> 존재 및 4개 섹션 헤딩 텍스트 확인
 *
 * ST-004 변경점: SquadPreviewContainer가 usePlayerList(@features/player/api)로 직접
 * 페칭하므로, RosterPanel.test.tsx 패턴대로 usePlayerList를 vi.mock해 react-query
 * QueryClientProvider 없이도 렌더 가능하게 한다. season prop(2026)을 전달한다.
 *
 * ⚠️ 아키텍처 주의: LandingPage = <main> + 4 섹션만.
 *    Nav(<header>)와 Footer(<footer>)는 app/layout 전역 소관이며
 *    @widgets/Navbar · @widgets/Footer 위젯 테스트에서 별도 검증한다.
 *    이 스모크 테스트에서 nav/footer 존재를 기대하지 않는다.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
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

import { usePlayerList } from '@features/player/api';

vi.mock('@features/player/api', async () => {
  const actual = await vi.importActual<typeof import('@features/player/api')>(
    '@features/player/api',
  );
  return { ...actual, usePlayerList: vi.fn() };
});

import { LandingPage } from '@pages/landing';

const mockedUsePlayerList = vi.mocked(usePlayerList);
const SEASON = 2026;

beforeEach(() => {
  mockedUsePlayerList.mockReset();
  mockedUsePlayerList.mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof usePlayerList>);
});

describe('LandingPage 스모크', () => {
  it('런타임 에러 없이 마운트되고 <main> 존재', () => {
    const { container } = render(<LandingPage season={SEASON} />);
    expect(container.querySelector('main')).not.toBeNull();
  });

  it('Hero 헤드라인 텍스트 포함', () => {
    const { container } = render(<LandingPage season={SEASON} />);
    expect(container.textContent).toContain('올드 트래포드');
  });

  it('MatchStrip 섹션 헤딩 존재', () => {
    const { container } = render(<LandingPage season={SEASON} />);
    expect(container.textContent).toContain('최근 경기');
  });

  it('카테고리 섹션 헤딩 존재', () => {
    const { container } = render(<LandingPage season={SEASON} />);
    expect(container.textContent).toContain('무엇을 찾고 있나요');
  });

  it('스쿼드 섹션 헤딩 존재("1군 스쿼드" — D-14 카피 정정)', () => {
    const { container } = render(<LandingPage season={SEASON} />);
    expect(container.textContent).toContain('1군 스쿼드');
  });
});
