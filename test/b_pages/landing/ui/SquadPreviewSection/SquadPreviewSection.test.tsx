/**
 * SquadPreviewSection 단위 테스트.
 *
 * 이 컴포넌트는 조회 결과를 그리드로 그리는 일만 한다 — 로딩·에러 분기는 상위
 * SquadPreviewContainer의 Suspense·ErrorBoundary 소관이라 여기서 다루지 않는다.
 * useSuspensePlayerList를 vi.mock해 QueryClientProvider 없이 data만 주입한다.
 *
 * 검증 목적:
 * - ready 상태: 카드가 li로 렌더되고 선수 상세로 링크된다
 * - 프리뷰 건수(4)를 넘는 데이터는 잘려 나간다
 * - position이 없으면 "-" 표시, number가 없어도 "undefined" 문자열이 새지 않음
 * - 빈 목록: 빈 상태 문구
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
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

import { useSuspensePlayerList } from '@features/player/api';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@features/player/api', async () => {
  const actual =
    await vi.importActual<typeof import('@features/player/api')>(
      '@features/player/api'
    );
  return { ...actual, useSuspensePlayerList: vi.fn() };
});

import { SquadPreviewSection } from '@pages/landing/ui/SquadPreviewSection';

const mockedUseSuspensePlayerList = vi.mocked(useSuspensePlayerList);

const SEASON = 2026;
/** selectSquadPreview가 남기는 프리뷰 건수 — 상수 import 없이 리터럴로 고정한다. */
const PREVIEW_COUNT = 4;

const mockPlayers = (dtos: ReturnType<typeof buildPlayerDTO>[]) => {
  mockedUseSuspensePlayerList.mockReturnValue({
    data: buildPlayerListDTO(dtos),
  } as unknown as ReturnType<typeof useSuspensePlayerList>);
};

beforeEach(() => {
  mockedUseSuspensePlayerList.mockReset();
});

describe('SquadPreviewSection', () => {
  it('선수마다 li와 상세 링크를 렌더한다', () => {
    mockPlayers([
      buildPlayerDTO({ id: 1, name: '브루누', number: 8 }),
      buildPlayerDTO({ id: 2, name: '가르나초', number: 17 }),
    ]);

    render(<SquadPreviewSection season={SEASON} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: /브루누/ })).toHaveAttribute(
      'href',
      '/players/1'
    );
  });

  it('프리뷰 건수를 넘는 선수는 잘라낸다', () => {
    mockPlayers(
      Array.from({ length: PREVIEW_COUNT + 3 }, (_, index) =>
        buildPlayerDTO({
          id: index + 1,
          number: index + 1,
          name: `Player ${index + 1}`,
        })
      )
    );

    render(<SquadPreviewSection season={SEASON} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(PREVIEW_COUNT);
  });

  it('position이 없으면 "-"로 표시하고 "undefined" 문자열을 노출하지 않는다', () => {
    mockPlayers([
      buildPlayerDTO({ id: 1, name: '가르나초', number: null, position: null }),
    ]);

    const { container } = render(<SquadPreviewSection season={SEASON} />);

    expect(screen.getByText('-')).toBeInTheDocument();
    expect(container.textContent).not.toContain('undefined');
  });

  it('선수가 없으면 빈 상태 문구를 렌더한다', () => {
    mockPlayers([]);

    render(<SquadPreviewSection season={SEASON} />);

    expect(screen.getByText('등록된 선수가 없어요')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
