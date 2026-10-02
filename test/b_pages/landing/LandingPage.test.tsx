/**
 * LandingPage 통합 스모크 테스트.
 *
 * 검증 목적:
 * - 런타임 에러 없이 마운트 가능
 * - <main> 존재 및 4개 섹션 헤딩 텍스트 확인
 *
 * ST-004 변경점: SquadPreviewSection이 useSuspensePlayerList(@features/player/api)로
 * 직접 페칭하므로, RosterPanel.test.tsx 패턴대로 그 훅을 vi.mock해 react-query
 * QueryClientProvider 없이도 렌더 가능하게 한다. season prop(2026)을 전달한다.
 *
 * ⚠️ 목은 반드시 실제 응답 형태(PlyaerListDTO)를 돌려줘야 한다. data: undefined를 돌려주면
 *    SquadPreviewSection이 렌더 중 TypeError를 던지고 SquadPreviewContainer의 ErrorBoundary가
 *    그것을 삼킨다. 헤딩은 경계 바깥이라 그대로 남으므로 아래 단언들은 전부 통과하고,
 *    "런타임 에러 없이 마운트된다"는 이 파일의 전제만 조용히 무너진다. 그래서 스쿼드 그리드가
 *    실제로 렌더됐는지(= 에러 폴백이 아닌지)를 마지막 케이스에서 직접 단언한다.
 *
 * ⚠️ 아키텍처 주의: LandingPage = <main> + 4 섹션만.
 *    Nav(<header>)와 Footer(<footer>)는 app/layout 전역 소관이며
 *    @widgets/Navbar · @widgets/Footer 위젯 테스트에서 별도 검증한다.
 *    이 스모크 테스트에서 nav/footer 존재를 기대하지 않는다.
 *
 * ⚠️ ST-008: LandingPage가 FeaturedMatchContainer·MatchStripContainer(둘 다
 *    useLandingMatches() 구독)를 렌더하므로 QueryClientProvider 컨텍스트가 필요하다.
 *    이 스모크 테스트의 단언은 정적 텍스트(hero 헤드라인·섹션 헤딩)만 확인하고 실제
 *    경기 데이터에 의존하지 않으므로, FeaturedMatchContainer.test.tsx·
 *    MatchStripContainer.test.tsx(ST-006)와 동일하게 useLandingMatches를 vi.mock으로
 *    대체한다 — Provider 래핑보다 가볍고, 실제 데이터를 기다리는 waitFor 없이 동기 렌더로
 *    끝난다.
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

import { useSuspensePlayerList } from '@features/player/api';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@features/player/api', async () => {
  const actual = await vi.importActual<typeof import('@features/player/api')>(
    '@features/player/api'
  );
  return { ...actual, useSuspensePlayerList: vi.fn() };
});

vi.mock('@features/matches/api', async () => {
  const actual = await vi.importActual<typeof import('@features/matches/api')>(
    '@features/matches/api'
  );
  return { ...actual, useLandingMatches: vi.fn() };
});

import { LandingPage } from '@pages/landing';
import { useLandingMatches } from '@features/matches/api';

const mockedUseLandingMatches = vi.mocked(useLandingMatches);

beforeEach(() => {
  mockedUseLandingMatches.mockReturnValue({
    data: undefined,
    isPending: true,
    isError: false,
  } as unknown as ReturnType<typeof useLandingMatches>);
});

const mockedUseSuspensePlayerList = vi.mocked(useSuspensePlayerList);
const SEASON = 2026;
const SQUAD_DTO = buildPlayerListDTO([
  buildPlayerDTO({ id: 1, name: '브루누', number: 8 }),
  buildPlayerDTO({ id: 2, name: '가르나초', number: 17 }),
]);

beforeEach(() => {
  mockedUseSuspensePlayerList.mockReset();
  mockedUseSuspensePlayerList.mockReturnValue({
    data: SQUAD_DTO,
  } as unknown as ReturnType<typeof useSuspensePlayerList>);
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

  it('스쿼드 그리드가 에러 폴백이 아니라 카드로 렌더된다', () => {
    const { container } = render(<LandingPage season={SEASON} />);

    expect(container.querySelector('a[href="/players/1"]')).not.toBeNull();
    expect(container.textContent).not.toContain('다시 시도');
  });
});
