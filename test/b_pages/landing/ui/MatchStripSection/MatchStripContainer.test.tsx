/**
 * MatchStripContainer 통합 테스트(ST-006).
 *
 * useLandingMatches(d_features/matches/api)를 vi.mock해 react-query 결과 형태를 직접 주입하고,
 * MatchStripContainer가 status(MatchStripStatus)를 올바르게 파생해 실제 MatchStripSection에
 * 배선하는지 검증한다(RosterPanel.test.tsx의 mocking 패턴을 그대로 따른다).
 *
 * 검증 목적:
 * - isPending → loading (MatchCardSkeleton 2장, 텍스트 없음)
 * - isError → error (StateBox variant="error")
 * - 성공했으나 recent·next 모두 null(정상 200) → empty — 에러가 아니라 empty 문구여야 한다
 * - 성공 + recent·next 모두 존재 → ready, 두 팀 데이터가 실제로 그리드에 렌더된다
 * - T-7(High-1 재작업, D-11): 성공했으나 한쪽만 null(시즌 종료·개막 전) → ready로 배선되고
 *   있는 쪽 카드가 실제로 렌더된다(빈 여백이 아니다). 재작업 전에는 "둘 다"·"둘 다 null"
 *   2케이스뿐이라 이 조합이 커버되지 않았다(QA 실측으로 발견).
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

import { MatchStripContainer } from '@pages/landing/ui/MatchStripSection/MatchStripContainer';

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

describe('MatchStripContainer', () => {
  it('isPending이면 loading 상태로 배선한다(스켈레톤 2장, 텍스트 없음)', () => {
    mockedUseLandingMatches.mockReturnValue(buildQueryResult({ isPending: true }));

    const { container } = render(<MatchStripContainer />);

    expect(container.querySelectorAll('[class*="animate-pulse"]').length).toBeGreaterThan(0);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('isError면 error 상태로 배선해 StateBox variant="error"를 렌더한다', () => {
    mockedUseLandingMatches.mockReturnValue(buildQueryResult({ isError: true }));

    render(<MatchStripContainer />);

    expect(screen.getByRole('alert')).toHaveTextContent('경기 정보를 불러오지 못했어요');
  });

  it('성공했으나 recent·next 모두 null이면(정상 200) 에러가 아니라 empty로 배선한다', () => {
    mockedUseLandingMatches.mockReturnValue(
      buildQueryResult({ data: { recent: null, next: null } }),
    );

    render(<MatchStripContainer />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('예정된 경기가 없어요')).toBeInTheDocument();
  });

  it('성공 + recent·next 모두 존재하면 ready로 배선해 두 카드를 렌더한다', () => {
    mockedUseLandingMatches.mockReturnValue(
      buildQueryResult({ data: { recent: RECENT_MATCH, next: NEXT_MATCH } }),
    );

    render(<MatchStripContainer />);

    // 두 매치 모두 홈이 맨유(같은 문자열)라 getByText가 충돌한다 — 카드별 상대팀(원정)
    // 이름으로 각 카드가 실제로 렌더됐는지 구분하고, 맨유 표기는 두 장 모두에서 나온다는
    // 것만 개수로 확인한다.
    expect(screen.getByText(RECENT_MATCH.away.nm)).toBeInTheDocument();
    expect(screen.getByText(NEXT_MATCH.away.nm)).toBeInTheDocument();
    expect(screen.getAllByText(RECENT_MATCH.home.nm)).toHaveLength(2);
  });

  /* ── T-7: 한쪽만 null (시즌 종료·개막 전, High-1 재작업 D-11) ──────────── */

  it('성공 + recent만 존재하면(시즌 종료) 빈 여백이 아니라 recent 카드가 렌더된다', () => {
    mockedUseLandingMatches.mockReturnValue(
      buildQueryResult({ data: { recent: RECENT_MATCH, next: null } }),
    );

    render(<MatchStripContainer />);

    expect(screen.getByText(RECENT_MATCH.away.nm)).toBeInTheDocument();
    expect(screen.getByText('다음 경기 일정이 아직 없어요')).toBeInTheDocument();
  });

  it('성공 + next만 존재하면(개막 전) 빈 여백이 아니라 next 카드가 렌더된다', () => {
    mockedUseLandingMatches.mockReturnValue(
      buildQueryResult({ data: { recent: null, next: NEXT_MATCH } }),
    );

    render(<MatchStripContainer />);

    expect(screen.getByText(NEXT_MATCH.away.nm)).toBeInTheDocument();
    expect(screen.getByText('최근 경기 기록이 없어요')).toBeInTheDocument();
  });
});
