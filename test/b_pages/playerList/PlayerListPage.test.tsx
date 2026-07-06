/**
 * PlayerListPage 통합 테스트 (ST-4).
 *
 * 검증 목적:
 * - 초기 렌더: 주입한 테스트 선수 전원이 카드뷰로 표시
 * - 포지션 필터: FilterSelect 선택 시 결과가 좁혀진다
 * - 검색 0건: RosterEmpty가 뜨고 '필터 초기화' 클릭 시 전체 필터가 리셋된다
 * - 뷰 토글: 카드뷰 ↔ 리스트뷰 전환
 * - 새로고침: 클릭 즉시 스켈레톤이 뜨고, REFRESH_DELAY_MS 후 결과로 복귀한다(ADR-8, fake timers)
 *
 * ⚠️ 아키텍처 주의: PlayerListPage = <main> + RosterHeadSection + Shell(FilterBar/ResultRow/결과).
 *    Nav/Footer는 app/layout 전역 소관이므로 이 테스트에서 기대하지 않는다(LandingPage 선례).
 */

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import React from 'react';

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

beforeAll(() => {
  // Headless UI Listbox가 옵션을 스크롤·측정할 때 사용 — jsdom 미구현이라 스텁.
  Element.prototype.scrollIntoView = () => {};
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

afterEach(cleanup);

import { PlayerListPage } from '@pages/playerList';
import { REFRESH_DELAY_MS } from '@pages/playerList/model';
import type { PlayerListItem } from '@pages/playerList/model';

// 테스트 전용 목업 — 프로덕션 PLAYERS(추후 API 연동 시 삭제 예정)에 의존하지 않도록 별도 구성한다.
const TEST_PLAYERS: PlayerListItem[] = [
  { id: 'onana', number: 24, name: '안드레 오나나', nameEn: 'André Onana', position: 'GK', nationality: '카메룬', flagCode: 'cm', years: '2023–현재', status: 'active', squad: '1군' },
  { id: 'bruno', number: 8, name: '브루누 페르난데스', nameEn: 'Bruno Fernandes', position: 'MF', nationality: '포르투갈', flagCode: 'pt', years: '2020–현재', status: 'active', squad: '1군' },
  { id: 'rashford', number: 10, name: '마커스 래시포드', nameEn: 'Marcus Rashford', position: 'FW', nationality: '잉글랜드', flagCode: 'gb', years: '2015–현재', status: 'active', squad: '1군' },
  { id: 'martinez', number: 6, name: '리산드로 마르티네스', nameEn: 'Lisandro Martínez', position: 'DF', nationality: '아르헨티나', flagCode: 'ar', years: '2022–현재', status: 'active', squad: '1군' },
];

describe('PlayerListPage', () => {
  it('초기 렌더 — <main> 존재, 주입한 선수 전원이 카드뷰로 표시된다', () => {
    const { container } = render(<PlayerListPage players={TEST_PLAYERS} />);

    expect(container.querySelector('main')).not.toBeNull();
    expect(container.textContent).toContain(`총 ${TEST_PLAYERS.length}명의 선수를 찾았습니다`);
    expect(screen.getAllByRole('listitem')).toHaveLength(TEST_PLAYERS.length);
  });

  it('포지션 필터 — GK를 선택하면 결과가 1명(오나나)으로 좁혀진다', async () => {
    const user = userEvent.setup();
    const { container } = render(<PlayerListPage players={TEST_PLAYERS} />);

    await user.click(screen.getByRole('button', { name: '포지션' }));
    await user.click(screen.getByRole('option', { name: '골키퍼 · GK' }));

    expect(container.textContent).toContain('총 1명의 선수를 찾았습니다');
    expect(screen.getByText('안드레 오나나')).toBeInTheDocument();
  });

  it('검색 0건 — RosterEmpty가 뜨고 초기화 클릭 시 전체 목록으로 되돌아온다', async () => {
    const user = userEvent.setup();
    const { container } = render(<PlayerListPage players={TEST_PLAYERS} />);

    await user.type(screen.getByRole('textbox', { name: '선수 검색' }), '존재하지않는선수');

    expect(screen.getByText('조건에 맞는 선수가 없어요')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '필터 초기화' }));

    expect(container.textContent).toContain(`총 ${TEST_PLAYERS.length}명의 선수를 찾았습니다`);
    expect(screen.getByRole('textbox', { name: '선수 검색' })).toHaveValue('');
  });

  it('뷰 토글 — 리스트뷰로 전환하면 리스트 헤더가, 다시 카드뷰로 전환하면 그리드가 보인다', async () => {
    const user = userEvent.setup();
    render(<PlayerListPage players={TEST_PLAYERS} />);

    await user.click(screen.getByRole('radio', { name: '리스트뷰' }));
    expect(screen.getByText('국적')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '카드뷰' }));
    expect(screen.queryByText('국적')).not.toBeInTheDocument();
  });

  it('새로고침 — 클릭 즉시 스켈레톤이 뜨고 지연 후 결과로 복귀한다(ADR-8)', () => {
    vi.useFakeTimers();
    render(<PlayerListPage players={TEST_PLAYERS} />);

    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(REFRESH_DELAY_MS);
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(TEST_PLAYERS.length);

    vi.useRealTimers();
  });
});
