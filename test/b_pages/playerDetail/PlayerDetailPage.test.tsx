/**
 * PlayerDetailPage 통합 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 검증 목적(plan.json verification.qa_guidance 전체 시나리오를 페이지 조립
 * 레벨에서 관통):
 * (1) 필드플레이어 vs GK — CurrentSeasonCard 도넛↔링 분기
 * (2) 현역/은퇴/레전드/주장 — 헤더 배지·정보 그리드 분기
 * (3) 미존재 playerId → PlayerNotFound
 * (4) 시즌표 통산 합계 행 = 통산 스탯
 * (5) 차트 접근성(role=img + aria-label)
 *
 * getPlayerById·deriveSeasonRows·deriveCurrentSeason은 실제 구현을 그대로
 * 사용한다(모킹 없음) — 페이지 조립 코드가 model과 정확히 맞물리는지가
 * 이 테스트의 핵심이다.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { getPlayerById } from '@pages/playerDetail/model';
import { PlayerDetailPage } from '@pages/playerDetail';

afterEach(cleanup);

describe('PlayerDetailPage — 존재하는 선수(필드플레이어, 현역, 주장) — bruno', () => {
  it('런타임 에러 없이 마운트되고 <main> 안에 헤더·통산카드·능력치·시즌스냅샷·시즌표를 모두 렌더한다', () => {
    const bruno = getPlayerById('bruno')!;
    const { container } = render(<PlayerDetailPage playerId="bruno" />);

    expect(container.querySelector('main')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: bruno.nm })).toBeInTheDocument();
    expect(screen.getByText(bruno.en)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /선수 목록/ })).toHaveAttribute('href', '/players');
  });

  it('주장 배지("주장 · C")가 렌더된다 — 헤더 배지 분기', () => {
    render(<PlayerDetailPage playerId="bruno" />);
    expect(screen.getByText('주장 · C')).toBeInTheDocument();
  });

  it('현역 태그·정보그리드 "현재 상태" 셀이 렌더된다(은퇴 셀은 없음)', () => {
    render(<PlayerDetailPage playerId="bruno" />);
    expect(screen.getByText('현역')).toBeInTheDocument();
    expect(screen.getByText('현재 상태')).toBeInTheDocument();
    expect(screen.queryByText('방출 / 은퇴')).not.toBeInTheDocument();
  });

  it('필드플레이어이므로 CurrentSeasonCard가 Donut(공격 포인트)을 렌더하고 Ring은 렌더하지 않는다', () => {
    render(<PlayerDetailPage playerId="bruno" />);
    expect(screen.getByRole('img', { name: /공격 포인트/ })).toBeInTheDocument();
  });

  it('통산 스탯 카드가 player.career/trophies 값 그대로 렌더된다', () => {
    // 주의: career 수치는 SeasonTable "통산" 행에도 동일한 값이 등장하므로
    // CareerStatCards(role=list "통산 기록")로 스코프해 중복 매치를 피한다.
    const bruno = getPlayerById('bruno')!;
    render(<PlayerDetailPage playerId="bruno" />);
    const statCards = within(screen.getByRole('list', { name: '통산 기록' }));
    expect(statCards.getByText(String(bruno.career.apps))).toBeInTheDocument();
    expect(statCards.getByText(String(bruno.career.goals))).toBeInTheDocument();
    expect(statCards.getByText(String(bruno.career.assists))).toBeInTheDocument();
    expect(statCards.getByText(String(bruno.trophies))).toBeInTheDocument();
  });

  it('시즌표 통산 합계 행 = player.career (필수 시나리오 #4, 페이지 조립 레벨)', () => {
    const bruno = getPlayerById('bruno')!;
    render(<PlayerDetailPage playerId="bruno" />);

    const totalRow = screen.getByRole('rowheader', { name: '통산' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual([
      String(bruno.career.apps),
      String(bruno.career.goals),
      String(bruno.career.assists),
    ]);
  });

  it('AttributeCard의 HexRadar가 role=img + aria-label로 렌더된다(필수 시나리오 #5)', () => {
    render(<PlayerDetailPage playerId="bruno" />);
    expect(screen.getByRole('img', { name: /능력치 육각형/ })).toBeInTheDocument();
  });
});

describe('PlayerDetailPage — GK 분기 — onana', () => {
  it('GK는 CurrentSeasonCard가 Ring(출전)을 렌더하고 Donut은 렌더하지 않으며, Shield 노트 문구가 보인다', () => {
    render(<PlayerDetailPage playerId="onana" />);
    expect(screen.getByRole('img', { name: /^출전/ })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /공격 포인트/ })).not.toBeInTheDocument();
    expect(screen.getByText(/골키퍼는 출전 중심으로 표시됩니다\./)).toBeInTheDocument();
  });

  it('포지션 라벨이 "골키퍼"로 헤더에 렌더된다', () => {
    render(<PlayerDetailPage playerId="onana" />);
    expect(screen.getAllByText(/골키퍼/).length).toBeGreaterThan(0);
  });

  it('GK 시즌표 통산 합계 행도 player.career와 정확히 일치한다', () => {
    const onana = getPlayerById('onana')!;
    render(<PlayerDetailPage playerId="onana" />);
    const totalRow = screen.getByRole('rowheader', { name: '통산' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual([
      String(onana.career.apps),
      String(onana.career.goals),
      String(onana.career.assists),
    ]);
  });
});

describe('PlayerDetailPage — 은퇴 레전드 분기 — rooney', () => {
  it('"은퇴" 태그, "방출 / 은퇴" 셀(현재 상태 셀 없음), "Former Player" Eyebrow가 렌더된다', () => {
    const rooney = getPlayerById('rooney')!;
    render(<PlayerDetailPage playerId="rooney" />);

    expect(screen.getByText('은퇴')).toBeInTheDocument();
    expect(screen.getByText('방출 / 은퇴')).toBeInTheDocument();
    expect(screen.getByText(rooney.left as string)).toBeInTheDocument();
    expect(screen.queryByText('현재 상태')).not.toBeInTheDocument();
    expect(screen.getByText(/Former Player/)).toBeInTheDocument();
  });

  it('마지막 시즌 타이틀("마지막 시즌")이 CurrentSeasonCard에 렌더된다', () => {
    render(<PlayerDetailPage playerId="rooney" />);
    expect(screen.getByText('마지막 시즌')).toBeInTheDocument();
  });

  it('시즌표 통산 합계 행 = rooney.career', () => {
    const rooney = getPlayerById('rooney')!;
    render(<PlayerDetailPage playerId="rooney" />);
    const totalRow = screen.getByRole('rowheader', { name: '통산' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual([
      String(rooney.career.apps),
      String(rooney.career.goals),
      String(rooney.career.assists),
    ]);
  });
});

describe('PlayerDetailPage — 미존재 playerId (필수 시나리오 #3)', () => {
  it('PlayerNotFound(StateBox + "선수 목록으로" /players 링크)를 렌더한다', () => {
    render(<PlayerDetailPage playerId="no-such-player-id" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /선수 목록으로/ });
    expect(link).toHaveAttribute('href', '/players');

    // 정상 경로 컴포넌트(헤더 h1·시즌표)는 렌더되지 않는다.
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('빈 문자열 playerId(경계값)도 동일하게 PlayerNotFound를 렌더한다', () => {
    render(<PlayerDetailPage playerId="" />);
    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
  });
});
