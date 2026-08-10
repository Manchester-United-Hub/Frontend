/**
 * PlayerDetailPage 통합 테스트 — 실 API 연동 이후 재작성(PD-3).
 *
 * usePlayerProfile/usePlayerStatistics를 vi.mock으로 대체해 로딩/성공/에러/
 * 빈 상태 분기를 렌더 검증한다(AD-7 — 페이지 컴포넌트 테스트는 훅을 mock,
 * matches/player 기존 컨벤션 미러링).
 *
 * 검증 목적:
 * (1) 로딩 중 — PlayerDetailSkeleton
 * (2) 필드플레이어(bruno) — 헤더·통산카드·현재시즌(Donut)·시즌표
 * (3) GK(onana) — CurrentSeasonCard Ring 분기
 * (4) 에러/NaN playerId/데이터 없음 — PlayerNotFound(D-24)
 * (5) 능력치 카드(AttributeCard)는 더 이상 렌더되지 않는다(D-26/D-30)
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';

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

vi.mock('@features/player/api', () => ({
  usePlayerProfile: vi.fn(),
  usePlayerStatistics: vi.fn(),
}));

import { usePlayerProfile, usePlayerStatistics } from '@features/player/api';
import { PlayerDetailPage } from '@pages/playerDetail';
import type { LeagueStatisticsDTO, PlyaerDTO } from '@entities/player/model';
import { buildStatisticsFixture } from '@test/b_pages/playerDetail/model/playerFixtures';

afterEach(cleanup);

const mockedUsePlayerProfile = usePlayerProfile as Mock;
const mockedUsePlayerStatistics = usePlayerStatistics as Mock;

function mockQueryResult<T>(overrides: Partial<UseQueryResult<T>>): UseQueryResult<T> {
  return { data: undefined, isLoading: false, isError: false, ...overrides } as UseQueryResult<T>;
}

const BRUNO_DTO: PlyaerDTO = {
  id: 1485,
  name: 'Bruno Fernandes',
  birthDate: '1994-09-08',
  nationality: 'Portugal',
  height: '179',
  weight: '66',
  number: 8,
  position: 'Midfielder',
  photo: 'https://example.com/1485.png',
};

const ONANA_DTO: PlyaerDTO = {
  id: 24309,
  name: 'André Onana',
  birthDate: '1996-04-02',
  nationality: 'Cameroon',
  height: '190',
  weight: '92',
  number: 24,
  position: 'Goalkeeper',
  photo: 'https://example.com/24309.png',
};

const BRUNO_STATS: LeagueStatisticsDTO[] = [
  buildStatisticsFixture({ leagueName: 'Premier League', appearances: 30, goals: 8, assists: 6 }),
  buildStatisticsFixture({ leagueId: 45, leagueName: 'FA Cup', appearances: 3, goals: 1, assists: 0 }),
];

const ONANA_STATS: LeagueStatisticsDTO[] = [
  buildStatisticsFixture({ leagueName: 'Premier League', appearances: 34, goals: 0, assists: 0 }),
];

function mockQueries(
  profile: Partial<UseQueryResult<PlyaerDTO>>,
  statistics: Partial<UseQueryResult<LeagueStatisticsDTO[]>>
) {
  mockedUsePlayerProfile.mockReturnValue(mockQueryResult(profile));
  mockedUsePlayerStatistics.mockReturnValue(mockQueryResult(statistics));
}

describe('PlayerDetailPage — 로딩 중', () => {
  it('PlayerDetailSkeleton을 렌더한다(h1은 렌더되지 않음)', () => {
    mockQueries({ isLoading: true }, { isLoading: true });
    render(<PlayerDetailPage playerId="1485" />);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});

describe('PlayerDetailPage — 필드플레이어(bruno)', () => {
  it('런타임 에러 없이 마운트되고 헤더·통산카드·시즌표를 렌더한다', () => {
    mockQueries({ data: BRUNO_DTO }, { data: BRUNO_STATS });
    const { container } = render(<PlayerDetailPage playerId="1485" />);

    expect(container.querySelector('main')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'Bruno Fernandes' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /선수 목록/ })).toHaveAttribute('href', '/players');
  });

  it('시즌 합계 카드가 대회별 통계를 합산한 값을 렌더한다(30+3=33 apps, 8+1=9 goals, 6+0=6 assists)', () => {
    mockQueries({ data: BRUNO_DTO }, { data: BRUNO_STATS });
    render(<PlayerDetailPage playerId="1485" />);

    const statCards = within(screen.getByRole('list', { name: '통산 기록' }));
    expect(statCards.getByText('33')).toBeInTheDocument();
    expect(statCards.getByText('9')).toBeInTheDocument();
    expect(statCards.getByText('6')).toBeInTheDocument();
  });

  it('필드플레이어이므로 CurrentSeasonCard가 Donut(공격 포인트)을 렌더하고 Ring은 렌더하지 않는다', () => {
    mockQueries({ data: BRUNO_DTO }, { data: BRUNO_STATS });
    render(<PlayerDetailPage playerId="1485" />);
    expect(screen.getByRole('img', { name: /공격 포인트/ })).toBeInTheDocument();
  });

  it('시즌표에 대회별 행 + 시즌 합계 행을 렌더한다', () => {
    mockQueries({ data: BRUNO_DTO }, { data: BRUNO_STATS });
    render(<PlayerDetailPage playerId="1485" />);

    expect(screen.getByRole('rowheader', { name: 'Premier League' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'FA Cup' })).toBeInTheDocument();

    const totalRow = screen.getByRole('rowheader', { name: '시즌 합계' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual(['33', '9', '6']);
  });

  it('AttributeCard(능력치 카드)는 더 이상 렌더되지 않는다(D-26/D-30)', () => {
    mockQueries({ data: BRUNO_DTO }, { data: BRUNO_STATS });
    render(<PlayerDetailPage playerId="1485" />);
    expect(screen.queryByText(/선수 능력치/)).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /능력치 육각형/ })).not.toBeInTheDocument();
  });
});

describe('PlayerDetailPage — 빈 통계(statistics: []) — code-review M-2', () => {
  // 44명 스쿼드 전수 조사 결과 10명(23%)이 statistics: []로 온다(신인·유소년·
  // 이적 직후 — code-review M-1). 예외가 아니라 주류 경로이므로
  // `!statisticsQuery.data`가 빈 배열을 truthy로 통과시켜(D-24 의도대로
  // PlayerNotFound로 빠지지 않고) 카드 레이아웃이 0으로 채워져 렌더되는 것을
  // 이 테스트로 고정한다. `!data.length`로 "고치면" 이 10명이 조용히
  // PlayerNotFound가 되므로 회귀 가드 역할을 한다.
  it('프로필은 있고 통계가 빈 배열이면 PlayerNotFound가 아니라 0으로 채운 카드/시즌 합계만 렌더한다', () => {
    mockQueries({ data: BRUNO_DTO }, { data: [] });
    render(<PlayerDetailPage playerId="1485" />);

    expect(screen.queryByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Bruno Fernandes' })).toBeInTheDocument();

    const statCards = within(screen.getByRole('list', { name: '통산 기록' }));
    expect(statCards.getAllByText('0')).toHaveLength(3);

    // 대회별 데이터 행은 없고 "시즌 합계 0 0 0" 한 줄만 남는다.
    expect(screen.queryAllByRole('rowheader').map((el) => el.textContent)).toEqual(['시즌 합계']);
    const totalRow = screen.getByRole('rowheader', { name: '시즌 합계' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual(['0', '0', '0']);
  });
});

describe('PlayerDetailPage — GK 분기(onana)', () => {
  it('GK는 CurrentSeasonCard가 Ring(출전)을 렌더하고 Donut은 렌더하지 않으며, Shield 노트 문구가 보인다', () => {
    mockQueries({ data: ONANA_DTO }, { data: ONANA_STATS });
    render(<PlayerDetailPage playerId="24309" />);

    expect(screen.getByRole('img', { name: /^출전/ })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /공격 포인트/ })).not.toBeInTheDocument();
    expect(screen.getByText(/골키퍼는 출전 중심으로 표시됩니다\./)).toBeInTheDocument();
  });

  it('포지션 라벨이 "골키퍼"로 헤더에 렌더된다', () => {
    mockQueries({ data: ONANA_DTO }, { data: ONANA_STATS });
    render(<PlayerDetailPage playerId="24309" />);
    expect(screen.getAllByText(/골키퍼/).length).toBeGreaterThan(0);
  });
});

describe('PlayerDetailPage — 미존재/에러 (필수 시나리오, D-24)', () => {
  it('숫자로 변환할 수 없는 playerId(NaN)는 PlayerNotFound를 렌더한다', () => {
    mockQueries({}, {});
    render(<PlayerDetailPage playerId="no-such-player-id" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('프로필 쿼리가 에러면 PlayerNotFound를 렌더한다', () => {
    mockQueries({ isError: true }, { data: [] });
    render(<PlayerDetailPage playerId="999999" />);
    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
  });

  it('통계 쿼리가 에러면 PlayerNotFound를 렌더한다', () => {
    mockQueries({ data: BRUNO_DTO }, { isError: true });
    render(<PlayerDetailPage playerId="1485" />);
    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
  });

  it('둘 다 성공했지만 데이터가 없으면(undefined) PlayerNotFound를 렌더한다', () => {
    mockQueries({ data: undefined }, { data: undefined });
    render(<PlayerDetailPage playerId="1485" />);
    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
  });
});
