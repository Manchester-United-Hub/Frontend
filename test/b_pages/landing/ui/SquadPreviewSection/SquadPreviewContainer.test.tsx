/**
 * SquadPreviewContainer 단위 테스트 (ST-004 신규).
 *
 * RosterPanel.test.tsx 패턴을 따라 usePlayerList(@features/player/api)를 vi.mock해
 * loading/error/empty/ready 4개 status 전이와 재시도→refetch를 검증한다. react-query
 * QueryClientProvider는 필요 없다 — 훅 자체를 목킹하기 때문이다.
 *
 * 검증 목적:
 * - isLoading → loading 상태(스켈레톤, listitem 없음)
 * - isError → error 상태, "다시 시도" 클릭 시 refetch 호출
 * - 데이터가 빈 배열 → empty 상태(빈 상태 문구)
 * - 정상 데이터 → ready 상태(카드 수만큼 listitem)
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
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
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@features/player/api', async () => {
  const actual = await vi.importActual<typeof import('@features/player/api')>(
    '@features/player/api',
  );
  return { ...actual, usePlayerList: vi.fn() };
});

import { SquadPreviewContainer } from '@pages/landing/ui/SquadPreviewSection';

const mockedUsePlayerList = vi.mocked(usePlayerList);

const SEASON = 2026;

/** react-query useQuery 반환값 중 컨테이너가 실제로 소비하는 4개 필드만 채운 테스트 더블. */
const buildQueryResult = (overrides: {
  data?: unknown;
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
}) =>
  ({
    data: overrides.data,
    isLoading: overrides.isLoading ?? false,
    isError: overrides.isError ?? false,
    refetch: overrides.refetch ?? vi.fn(),
  }) as unknown as ReturnType<typeof usePlayerList>;

beforeEach(() => {
  mockedUsePlayerList.mockReset();
});

describe('SquadPreviewContainer', () => {
  it('isLoading이면 loading 상태를 렌더한다(스켈레톤, listitem 없음)', () => {
    mockedUsePlayerList.mockReturnValue(buildQueryResult({ isLoading: true }));

    render(<SquadPreviewContainer season={SEASON} />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('isError이면 error 상태를 렌더하고 "다시 시도" 클릭 시 refetch를 호출한다', async () => {
    const refetch = vi.fn();
    mockedUsePlayerList.mockReturnValue(buildQueryResult({ isError: true, refetch }));
    const user = userEvent.setup();

    render(<SquadPreviewContainer season={SEASON} />);
    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('선수 목록이 빈 배열이면 empty 상태를 렌더한다', () => {
    mockedUsePlayerList.mockReturnValue(buildQueryResult({ data: buildPlayerListDTO([]) }));

    render(<SquadPreviewContainer season={SEASON} />);

    expect(screen.getByText('등록된 선수가 없어요')).toBeInTheDocument();
  });

  it('정상 데이터가 있으면 ready 상태로 카드를 렌더한다', () => {
    const dtos = [
      buildPlayerDTO({ id: 1 }),
      buildPlayerDTO({ id: 2, number: 9, name: 'B' }),
    ];
    mockedUsePlayerList.mockReturnValue(buildQueryResult({ data: buildPlayerListDTO(dtos) }));

    render(<SquadPreviewContainer season={SEASON} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(dtos.length);
  });
});
