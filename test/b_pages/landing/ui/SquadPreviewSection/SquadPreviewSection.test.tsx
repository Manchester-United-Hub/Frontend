/**
 * SquadPreviewSection 단위 테스트 (ST-004 재작성 — mockData.squadPlayers 의존 제거).
 *
 * players는 @test/fixtures/players의 buildPlayerDTO + 실 컨버터(mapPlayerDtoToListItem)로
 * 얻는다 — status/필드 매핑을 실 컨버터 경유로 검증한다.
 *
 * 검증 목적:
 * - 헤딩 "1군 스쿼드" (D-14 카피 정정)
 * - ready 상태: players 수만큼 카드 렌더, 이름 표시
 * - position이 없으면 "-" 표시
 * - number가 없어도 "undefined" 문자열이 새지 않음
 * - loading 상태: 스켈레톤(aria-hidden) 자리표시자, listitem 없음
 * - error 상태: "다시 시도" 클릭 시 onRetry 호출
 * - empty 상태: 빈 상태 문구
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
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

import { mapPlayerDtoToListItem } from '@entities/player/utils';
import { buildPlayerDTO } from '@test/fixtures/players';

import { SquadPreviewSection } from '@pages/landing/ui/SquadPreviewSection';

const PLAYER_WITH_NUMBER = mapPlayerDtoToListItem(
  buildPlayerDTO({ id: 1, name: '브루누', number: 8 }),
);
const PLAYER_WITHOUT_NUMBER_OR_POSITION = mapPlayerDtoToListItem(
  buildPlayerDTO({ id: 2, name: '가르나초', number: null, position: null }),
);

describe('SquadPreviewSection', () => {
  it('헤딩 "1군 스쿼드"를 렌더한다', () => {
    render(<SquadPreviewSection players={[PLAYER_WITH_NUMBER]} />);

    expect(screen.getByRole('heading', { name: '1군 스쿼드' })).toBeInTheDocument();
  });

  it('ready 상태 — players 수만큼 카드가 렌더되고 이름이 표시된다', () => {
    render(
      <SquadPreviewSection
        status="ready"
        players={[PLAYER_WITH_NUMBER, PLAYER_WITHOUT_NUMBER_OR_POSITION]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    // name·nameEn이 둘 다 dto.name이라(D-9) 같은 텍스트가 두 번 렌더된다.
    expect(screen.getAllByText('브루누').length).toBeGreaterThan(0);
    expect(screen.getAllByText('가르나초').length).toBeGreaterThan(0);
  });

  it('position이 없으면 "-"로 표시된다', () => {
    render(<SquadPreviewSection players={[PLAYER_WITHOUT_NUMBER_OR_POSITION]} />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('number가 없어도 "undefined" 문자열이 새지 않는다', () => {
    const { container } = render(
      <SquadPreviewSection players={[PLAYER_WITHOUT_NUMBER_OR_POSITION]} />,
    );

    expect(container.textContent).not.toContain('undefined');
  });

  it('loading 상태 — 스켈레톤 자리표시자가 렌더되고 listitem은 없다', () => {
    const { container } = render(<SquadPreviewSection status="loading" players={[]} />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it('error 상태 — "다시 시도" 클릭 시 onRetry가 호출된다', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<SquadPreviewSection status="error" players={[]} onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('empty 상태 — 빈 상태 문구가 렌더된다', () => {
    render(<SquadPreviewSection status="empty" players={[]} />);

    expect(screen.getByText('등록된 선수가 없어요')).toBeInTheDocument();
  });
});
