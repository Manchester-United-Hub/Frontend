/**
 * FeaturedMatchContainer 통합 테스트(ST-006).
 *
 * useLandingMatches(d_features/matches/api)를 vi.mock해 react-query 결과 형태를 직접 주입하고,
 * FeaturedMatchContainer가 4상태를 실제 자식(FeaturedMatchPanelSkeleton·StateBox·
 * FeaturedMatchPanel)으로 정확히 렌더하는지 검증한다(RosterPanel.test.tsx의 mocking 패턴을
 * 그대로 따른다 — buildQueryResult 더블 + vi.mocked).
 *
 * 검증 목적:
 * - isPending → FeaturedMatchPanelSkeleton (텍스트 없음, 로딩 블록만)
 * - isError → StateBox variant="error" (role="alert", 에러 문구)
 * - 성공했으나 next===null(정상 200, 개막 전·시즌 종료) → StateBox variant="empty" — 에러 문구가
 *   아니라 empty 문구여야 한다(에러와 empty를 구분하는 것이 ST-006의 핵심 계약)
 * - 성공 + next 존재 → toMatchItem(next, 'next')로 매핑된 FeaturedMatchPanel(팀명·배지 노출)
 * - T-8(High-1 재작업, D-11): recent가 있어도 next===null이면 "다음 경기 일정이 아직
 *   없어요"를 렌더한다 — MatchStripContainer.test.tsx(T-7)의 next 슬롯과 같은 데이터·같은
 *   상수(NEXT_MATCH_EMPTY_BOX)를 써서 두 섹션의 문구가 어긋나지 않음을 고정한다.
 * - R-4(M4+L7, D-11): isError·next===null 상태 모두 HeroStateBox로 감싸져 h2로 렌더된다
 *   (Hero의 유일한 h1 바로 아래 단계 — 기존 StateBox 기본값 h4는 h1→h4 스킵이었다).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { useLandingMatches } from '@features/matches/api';
import type { Match } from '@entities/matches/types';
import { matches } from '@test/fixtures/matches';

vi.mock('@features/matches/api', async () => {
  const actual = await vi.importActual<typeof import('@features/matches/api')>(
    '@features/matches/api',
  );
  return { ...actual, useLandingMatches: vi.fn() };
});

import { FeaturedMatchContainer } from '@pages/landing/ui/HeroSection/FeaturedMatchContainer';

afterEach(cleanup);

const mockedUseLandingMatches = vi.mocked(useLandingMatches);

/** react-query useQuery 반환값 중 컨테이너가 실제로 읽는 3개 필드만 채운 테스트 더블. */
const buildQueryResult = (overrides: {
  data?: { recent: Match | null; next: Match | null };
  isPending?: boolean;
  isError?: boolean;
}) =>
  ({
    data: overrides.data,
    isPending: overrides.isPending ?? false,
    isError: overrides.isError ?? false,
  }) as unknown as ReturnType<typeof useLandingMatches>;

const RECENT_MATCH = matches[0]!;
const NEXT_MATCH = matches[4]!;

describe('FeaturedMatchContainer', () => {
  it('isPending이면 FeaturedMatchPanelSkeleton을 렌더한다(텍스트 없음)', () => {
    mockedUseLandingMatches.mockReturnValue(buildQueryResult({ isPending: true }));

    const { container } = render(<FeaturedMatchContainer />);

    expect(container.textContent).toBe('');
    expect(container.querySelectorAll('[class*="animate-pulse"]').length).toBeGreaterThan(0);
  });

  it('isError면 StateBox variant="error"를 렌더한다', () => {
    mockedUseLandingMatches.mockReturnValue(buildQueryResult({ isError: true }));

    render(<FeaturedMatchContainer />);

    expect(screen.getByRole('alert')).toHaveTextContent('경기 정보를 불러오지 못했어요');
    expect(
      screen.getByRole('heading', { level: 2, name: '경기 정보를 불러오지 못했어요' }),
    ).toBeInTheDocument();
  });

  it('성공했으나 next가 null이면(정상 200, recent 존재 여부 무관) 에러가 아니라 "다음 경기 일정이 아직 없어요" StateBox를 렌더한다', () => {
    mockedUseLandingMatches.mockReturnValue(
      buildQueryResult({ data: { recent: RECENT_MATCH, next: null } }),
    );

    render(<FeaturedMatchContainer />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('다음 경기 일정이 아직 없어요')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '다음 경기 일정이 아직 없어요' }),
    ).toBeInTheDocument();
  });

  it('성공 + next 존재 시 toMatchItem으로 매핑한 FeaturedMatchPanel을 렌더한다', () => {
    mockedUseLandingMatches.mockReturnValue(
      buildQueryResult({ data: { recent: null, next: NEXT_MATCH } }),
    );

    render(<FeaturedMatchContainer />);

    expect(screen.getByText(NEXT_MATCH.home.nm)).toBeInTheDocument();
    expect(screen.getByText(NEXT_MATCH.away.nm)).toBeInTheDocument();
    expect(screen.getByText('다음 경기')).toBeInTheDocument();
  });
});
