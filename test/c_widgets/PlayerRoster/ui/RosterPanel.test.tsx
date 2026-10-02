/**
 * RosterPanel 통합 테스트(ST-4로 PlayerListPage.test.tsx에서 이관 — 조립 본체가
 * c_widgets/PlayerRoster/ui/RosterPanel로 옮겨지면서 상호작용 커버리지가 함께 옮겨졌다).
 *
 * AD-7(테스트 전략): 페이지 컴포넌트 테스트는 feature 훅(usePlayerList)을 vi.mock해
 * 로딩/성공/에러/빈 상태를 렌더 검증한다 — 더 이상 `players` prop으로 데이터를 주입하지 않는다
 * (PLAYERS 목데이터는 테스트 fixture로 격하, AD-6).
 *
 * ST-005 변경점: season은 이제 이 컴포넌트가 useCurrentSeason()으로 직접 확정하지 않고
 * app/players/page.tsx → PlayerListPage가 서버에서 확정해 prop으로 내린다(A-4/S-9). 그래서
 * - useCurrentSeason mock·시즌 로딩/에러 케이스는 제거됐다(season은 항상 유효한 number로 온다).
 * - usePlayerList가 받는 데이터는 더 이상 BffApiResponse 봉투가 아니라 playerQueries.ts의
 *   queryFn이 이미 언랩한 PlyaerListDTO다(S-6). "BFF 에러 봉투(success:false)" 케이스는
 *   playerQueries.ts가 throw로 정규화해 react-query의 isError로 흡수하므로, 그 검증은
 *   test/d_features/player/api/playerQueries.test.ts로 옮겨졌다(책임 이동, 커버리지 손실 아님).
 * - usePlayerList 호출 인자 검증은 `{ enabled }` 게이팅 없이 rosterListQuery(season) 결과
 *   하나만 확인한다.
 *
 * 검증 목적:
 * - 초기 렌더: usePlayerList 성공 응답(페이지 봉투)의 players가 mapPlayerDtoToListItem을
 *   거쳐 카드뷰로 표시
 * - 포지션 필터: FilterSelect 선택 시 결과가 좁혀진다
 * - 검색 0건: RosterEmpty가 뜨고 '필터 초기화' 클릭 시 전체 필터가 리셋된다
 * - 뷰 토글: 카드뷰 ↔ 리스트뷰 전환
 * - 로딩: isLoading이면 스켈레톤(listitem 없음)
 * - 에러: isError면 RosterErrorState, '다시 시도' 클릭 시 refetch 호출
 * - season prop으로 rosterListQuery(season)을 usePlayerList에 그대로 넘긴다
 * - 페이지네이션: 한 페이지(DESKTOP_ROSTER_PAGE_SIZE명)를 넘으면 페이저가 뜨고, 페이지 이동·필터
 *   후 1페이지 복귀
 * - number/position/nationality가 null인 선수(B2)도 제외되지 않고 '-'로 표시된다
 * - 새로고침 버튼: 로컬 스켈레톤 연출(usePlayerListFilters.refresh)과 refetch를 함께 트리거한다
 * - ST-006: 뷰포트 폭(matchMedia 스텁)에 따라 렌더되는 카드 수가 10/8/6으로 바뀐다
 *
 * ST-006 변경점: RosterPanel이 useRosterPageSize()(window.matchMedia 구독)를 호출하므로,
 * jsdom에 없는 matchMedia를 test/fixtures/matchMedia.ts(S-15)로 스텁한다 — 스텁이 없으면
 * 이 파일의 모든 테스트가 렌더 시점에 깨진다. 기본 뷰포트는 데스크톱(DESKTOP_VIEWPORT_WIDTH,
 * pageSize=10)으로 고정하고, 반응형 자체를 검증하는 테스트만 다른 폭을 쓴다.
 *
 * ⚠️ <main>·RosterHeadSection·Shell 배선 검증은 이 파일이 아니라
 *    test/b_pages/playerList/PlayerListPage.test.tsx(위젯 병합 계약)가 담당한다 — RosterPanel은
 *    Shell을 소유하지 않는다(ST-4).
 */

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import React from 'react';

import { usePlayerList } from '@features/player/api';
import type { PlyaerDTO } from '@entities/player/model';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';
import { installMatchMedia, restoreMatchMedia } from '@test/fixtures/matchMedia';

vi.mock('@features/player/api', async () => {
  const actual = await vi.importActual<typeof import('@features/player/api')>(
    '@features/player/api'
  );
  return { ...actual, usePlayerList: vi.fn() };
});

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

afterEach(() => {
  cleanup();
  restoreMatchMedia();
});

import { RosterPanel } from '@widgets/PlayerRoster/ui';
import { REFRESH_DELAY_MS } from '@features/player/model';

const mockedUsePlayerList = vi.mocked(usePlayerList);

const CURRENT_SEASON = 2026;

/** 이 파일의 기본 뷰포트 — 데스크톱(1101px 이상)이면 useRosterPageSize가 10을 반환한다. */
const DESKTOP_VIEWPORT_WIDTH = 1200;
const DESKTOP_ROSTER_PAGE_SIZE = 10;

/** react-query useQuery 반환값 중 페이지가 실제로 소비하는 4개 필드만 채운 테스트 더블. */
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

/** usePlayerList의 새 반환 형태 — playerQueries.ts가 이미 BFF 봉투를 언랩한 PlyaerListDTO(S-6). */
const successResult = (dtos: PlyaerDTO[], refetch?: () => void) =>
  buildQueryResult({ data: buildPlayerListDTO(dtos), refetch });

const TEST_DTOS: PlyaerDTO[] = [
  {
    id: 24,
    name: 'André Onana',
    birthDate: '1996-04-02',
    nationality: 'Cameroon',
    height: '190 cm',
    weight: '85 kg',
    number: 24,
    position: 'Goalkeeper',
    photo: '',
    seasons: [2023, 2024, 2025],
  },
  {
    id: 8,
    name: 'Bruno Fernandes',
    birthDate: '1994-09-08',
    nationality: 'Portugal',
    height: '179 cm',
    weight: '69 kg',
    number: 8,
    position: 'Midfielder',
    photo: '',
    seasons: [2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: 10,
    name: 'Marcus Rashford',
    birthDate: '1997-10-31',
    nationality: 'England',
    height: '188 cm',
    weight: '80 kg',
    number: 10,
    position: 'Attacker',
    photo: '',
    seasons: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  },
  {
    id: 6,
    name: 'Lisandro Martínez',
    birthDate: '1998-01-18',
    nationality: 'Argentina',
    height: '175 cm',
    weight: '73 kg',
    number: 6,
    position: 'Defender',
    photo: '',
    seasons: [2022, 2023, 2024, 2025],
  },
];

beforeEach(() => {
  installMatchMedia(DESKTOP_VIEWPORT_WIDTH);
  mockedUsePlayerList.mockReset();
  mockedUsePlayerList.mockReturnValue(successResult(TEST_DTOS));
});

describe('RosterPanel', () => {
  it('초기 렌더 — API 응답 전원이 카드뷰로 표시된다', () => {
    const { container } = render(<RosterPanel season={CURRENT_SEASON} />);

    expect(container.textContent).toContain(`총 ${TEST_DTOS.length}명의 선수를 찾았습니다`);
    expect(screen.getAllByRole('listitem')).toHaveLength(TEST_DTOS.length);
  });

  it('활약연도·스쿼드 셀렉트는 옵션이 없어 렌더되지 않는다(리뷰 H-3)', () => {
    render(<RosterPanel season={CURRENT_SEASON} />);

    expect(screen.getByRole('button', { name: '포지션' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '활약연도' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '스쿼드' })).not.toBeInTheDocument();
  });

  it('포지션 필터 — GK를 선택하면 결과가 1명(Onana)으로 좁혀진다', async () => {
    const user = userEvent.setup();
    const { container } = render(<RosterPanel season={CURRENT_SEASON} />);

    await user.click(screen.getByRole('button', { name: '포지션' }));
    await user.click(screen.getByRole('option', { name: '골키퍼 · GK' }));

    expect(container.textContent).toContain('총 1명의 선수를 찾았습니다');
    // name/nameEn이 둘 다 dto.name이라(AD-3) 같은 텍스트가 두 줄로 렌더된다.
    expect(screen.getAllByText('André Onana').length).toBeGreaterThan(0);
  });

  it('검색 0건 — RosterEmpty가 뜨고 초기화 클릭 시 전체 목록으로 되돌아온다', async () => {
    const user = userEvent.setup();
    const { container } = render(<RosterPanel season={CURRENT_SEASON} />);

    await user.type(screen.getByRole('textbox', { name: '선수 검색' }), '존재하지않는선수');

    expect(screen.getByText('조건에 맞는 선수가 없어요')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '필터 초기화' }));

    expect(container.textContent).toContain(`총 ${TEST_DTOS.length}명의 선수를 찾았습니다`);
    expect(screen.getByRole('textbox', { name: '선수 검색' })).toHaveValue('');
  });

  it('뷰 토글 — 리스트뷰로 전환하면 리스트 헤더가, 다시 카드뷰로 전환하면 그리드가 보인다', async () => {
    const user = userEvent.setup();
    render(<RosterPanel season={CURRENT_SEASON} />);

    await user.click(screen.getByRole('radio', { name: '리스트뷰' }));
    expect(screen.getByText('국적')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '카드뷰' }));
    expect(screen.queryByText('국적')).not.toBeInTheDocument();
  });

  it('로딩 중이면(react-query isLoading) 결과 대신 스켈레톤이 뜬다', () => {
    mockedUsePlayerList.mockReturnValue(
      buildQueryResult({ data: undefined, isLoading: true }),
    );
    render(<RosterPanel season={CURRENT_SEASON} />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('에러(react-query isError)면 RosterErrorState가 뜨고 "다시 시도" 클릭 시 refetch가 호출된다', async () => {
    const refetch = vi.fn();
    mockedUsePlayerList.mockReturnValue(
      buildQueryResult({ data: undefined, isError: true, refetch }),
    );
    const user = userEvent.setup();
    render(<RosterPanel season={CURRENT_SEASON} />);

    expect(screen.getByText('선수 목록을 불러오지 못했어요')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('number/position이 null인 선수도 제외되지 않고 등번호·포지션이 "-"로 표시된다(B2)', () => {
    const dtoWithoutNumberOrPosition: PlyaerDTO = {
      ...TEST_DTOS[0]!,
      id: 284324,
      name: 'A. Garnacho',
      number: null,
      position: null,
      nationality: null,
    };
    mockedUsePlayerList.mockReturnValue(
      successResult([...TEST_DTOS, dtoWithoutNumberOrPosition]),
    );

    render(<RosterPanel season={CURRENT_SEASON} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(TEST_DTOS.length + 1);
    // name과 nameEn이 둘 다 dto.name(영문)이라(AD-3, 번역 없음) PlayerCard가 같은 텍스트를
    // 두 줄(name/nameEn)로 렌더한다 — getAllByText로 중복 매치를 허용한다.
    expect(screen.getAllByText('A. Garnacho').length).toBeGreaterThan(0);
  });

  it('season prop으로 rosterListQuery(season)을 그대로 usePlayerList에 넘긴다(A-5/S-5)', () => {
    render(<RosterPanel season={CURRENT_SEASON} />);

    expect(mockedUsePlayerList).toHaveBeenCalledWith({ season: CURRENT_SEASON, size: 100 });
  });

  it('한 페이지를 넘으면 페이저가 뜨고 2페이지로 이동하면 나머지만 보인다', async () => {
    const overflowCount = 3;
    const many = Array.from(
      { length: DESKTOP_ROSTER_PAGE_SIZE + overflowCount },
      (_, index) => buildPlayerDTO({ id: 9000 + index, name: `Player ${index}` }),
    );
    mockedUsePlayerList.mockReturnValue(successResult(many));
    const user = userEvent.setup();
    const { container } = render(<RosterPanel season={CURRENT_SEASON} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(DESKTOP_ROSTER_PAGE_SIZE);
    expect(container.textContent).toContain(
      `총 ${many.length}명의 선수를 찾았습니다 · 1/2 페이지`,
    );

    await user.click(screen.getByRole('button', { name: '2페이지' }));

    expect(screen.getAllByRole('listitem')).toHaveLength(overflowCount);
    expect(container.textContent).toContain('2/2 페이지');
  });

  it('2페이지에서 검색어를 입력하면 1페이지로 돌아간다', async () => {
    const many = Array.from({ length: DESKTOP_ROSTER_PAGE_SIZE + 3 }, (_, index) =>
      buildPlayerDTO({ id: 9000 + index, name: `Player ${index}` }),
    );
    mockedUsePlayerList.mockReturnValue(successResult(many));
    const user = userEvent.setup();
    const { container } = render(<RosterPanel season={CURRENT_SEASON} />);

    await user.click(screen.getByRole('button', { name: '2페이지' }));
    expect(container.textContent).toContain('2/2 페이지');

    await user.type(screen.getByRole('textbox', { name: '선수 검색' }), 'Player');

    expect(container.textContent).toContain('1/2 페이지');
  });

  it('결과가 한 페이지에 들어가면 페이저를 렌더하지 않는다', () => {
    render(<RosterPanel season={CURRENT_SEASON} />);

    expect(screen.queryByRole('navigation', { name: '선수 목록 페이지' })).not.toBeInTheDocument();
  });

  it('새로고침 — 클릭 즉시 스켈레톤이 뜨고 지연 후 결과로 복귀하며 refetch도 호출된다', () => {
    vi.useFakeTimers();
    const refetch = vi.fn();
    mockedUsePlayerList.mockReturnValue(successResult(TEST_DTOS, refetch));
    render(<RosterPanel season={CURRENT_SEASON} />);

    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(refetch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(REFRESH_DELAY_MS);
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(TEST_DTOS.length);

    vi.useRealTimers();
  });

  it.each([
    [1200, 10],
    [1000, 8],
    [700, 6],
  ])('뷰포트 %ipx이면 카드 %i장이 렌더된다(ST-006)', (width, expectedCardCount) => {
    installMatchMedia(width);
    const many = Array.from({ length: 20 }, (_, index) =>
      buildPlayerDTO({ id: 9000 + index, name: `Player ${index}` }),
    );
    mockedUsePlayerList.mockReturnValue(successResult(many));

    render(<RosterPanel season={CURRENT_SEASON} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(expectedCardCount);
  });
});
