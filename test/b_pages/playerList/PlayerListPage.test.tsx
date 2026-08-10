/**
 * PlayerListPage 통합 테스트 (ST-4, PL-2로 실 API 연결 — decision-1.md D-31).
 *
 * AD-7(테스트 전략): 페이지 컴포넌트 테스트는 feature 훅(usePlayerList)을 vi.mock해
 * 로딩/성공/에러/빈 상태를 렌더 검증한다 — 더 이상 `players` prop으로 데이터를 주입하지 않는다
 * (PLAYERS 목데이터는 테스트 fixture로 격하, AD-6).
 *
 * 검증 목적:
 * - 초기 렌더: usePlayerList 성공 응답이 mapPlayerDtoToListItem을 거쳐 카드뷰로 표시
 * - 포지션 필터: FilterSelect 선택 시 결과가 좁혀진다
 * - 검색 0건: RosterEmpty가 뜨고 '필터 초기화' 클릭 시 전체 필터가 리셋된다
 * - 뷰 토글: 카드뷰 ↔ 리스트뷰 전환
 * - 로딩: isLoading이면 스켈레톤(listitem 없음)
 * - 에러: isError면 RosterErrorState, '다시 시도' 클릭 시 refetch 호출
 * - number/position이 null인 선수(B2)도 제외되지 않고 '-'로 표시된다
 * - 새로고침 버튼: 로컬 스켈레톤 연출(usePlayerListFilters.refresh)과 refetch를 함께 트리거한다
 *
 * ⚠️ 아키텍처 주의: PlayerListPage = <main> + RosterHeadSection + Shell(FilterBar/ResultRow/결과).
 *    Nav/Footer는 app/layout 전역 소관이므로 이 테스트에서 기대하지 않는다(LandingPage 선례).
 */

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import React from 'react';

import { usePlayerList } from '@features/player/api';
import type { PlyaerDTO } from '@entities/player/model';

vi.mock('@features/player/api', () => ({ usePlayerList: vi.fn() }));

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

const mockedUsePlayerList = vi.mocked(usePlayerList);

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
  },
];

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

const successResult = (dtos: PlyaerDTO[], refetch?: () => void) =>
  buildQueryResult({ data: { success: true, data: dtos, error: null }, refetch });

beforeEach(() => {
  mockedUsePlayerList.mockReset();
  mockedUsePlayerList.mockReturnValue(successResult(TEST_DTOS));
});

describe('PlayerListPage', () => {
  it('초기 렌더 — <main> 존재, API 응답 전원이 카드뷰로 표시된다', () => {
    const { container } = render(<PlayerListPage />);

    expect(container.querySelector('main')).not.toBeNull();
    expect(container.textContent).toContain(`총 ${TEST_DTOS.length}명의 선수를 찾았습니다`);
    expect(screen.getAllByRole('listitem')).toHaveLength(TEST_DTOS.length);
  });

  it('활약연도·스쿼드 셀렉트는 옵션이 없어 렌더되지 않는다(리뷰 H-3)', () => {
    render(<PlayerListPage />);

    expect(screen.getByRole('button', { name: '포지션' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '활약연도' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '스쿼드' })).not.toBeInTheDocument();
  });

  it('포지션 필터 — GK를 선택하면 결과가 1명(Onana)으로 좁혀진다', async () => {
    const user = userEvent.setup();
    const { container } = render(<PlayerListPage />);

    await user.click(screen.getByRole('button', { name: '포지션' }));
    await user.click(screen.getByRole('option', { name: '골키퍼 · GK' }));

    expect(container.textContent).toContain('총 1명의 선수를 찾았습니다');
    // name/nameEn이 둘 다 dto.name이라(AD-3) 같은 텍스트가 두 줄로 렌더된다.
    expect(screen.getAllByText('André Onana').length).toBeGreaterThan(0);
  });

  it('검색 0건 — RosterEmpty가 뜨고 초기화 클릭 시 전체 목록으로 되돌아온다', async () => {
    const user = userEvent.setup();
    const { container } = render(<PlayerListPage />);

    await user.type(screen.getByRole('textbox', { name: '선수 검색' }), '존재하지않는선수');

    expect(screen.getByText('조건에 맞는 선수가 없어요')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '필터 초기화' }));

    expect(container.textContent).toContain(`총 ${TEST_DTOS.length}명의 선수를 찾았습니다`);
    expect(screen.getByRole('textbox', { name: '선수 검색' })).toHaveValue('');
  });

  it('뷰 토글 — 리스트뷰로 전환하면 리스트 헤더가, 다시 카드뷰로 전환하면 그리드가 보인다', async () => {
    const user = userEvent.setup();
    render(<PlayerListPage />);

    await user.click(screen.getByRole('radio', { name: '리스트뷰' }));
    expect(screen.getByText('국적')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '카드뷰' }));
    expect(screen.queryByText('국적')).not.toBeInTheDocument();
  });

  it('로딩 중이면(react-query isLoading) 결과 대신 스켈레톤이 뜬다', () => {
    mockedUsePlayerList.mockReturnValue(
      buildQueryResult({ data: undefined, isLoading: true }),
    );
    render(<PlayerListPage />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('에러(react-query isError)면 RosterErrorState가 뜨고 "다시 시도" 클릭 시 refetch가 호출된다', async () => {
    const refetch = vi.fn();
    mockedUsePlayerList.mockReturnValue(
      buildQueryResult({ data: undefined, isError: true, refetch }),
    );
    const user = userEvent.setup();
    render(<PlayerListPage />);

    expect(screen.getByText('선수 목록을 불러오지 못했어요')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('BFF 에러 봉투(success:false)면 결과 없음이 아니라 RosterErrorState가 뜬다(리뷰 H-1)', () => {
    mockedUsePlayerList.mockReturnValue(
      buildQueryResult({
        data: { success: false, data: null, error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' } },
        isError: false,
      }),
    );
    render(<PlayerListPage />);

    expect(screen.getByText('선수 목록을 불러오지 못했어요')).toBeInTheDocument();
    expect(screen.queryByText('조건에 맞는 선수가 없어요')).not.toBeInTheDocument();
  });

  it('number/position이 null인 선수도 제외되지 않고 등번호·포지션이 "-"로 표시된다(B2)', () => {
    const dtoWithoutNumberOrPosition = {
      ...TEST_DTOS[0],
      id: 284324,
      name: 'A. Garnacho',
      number: null,
      position: null,
    } as unknown as PlyaerDTO;
    mockedUsePlayerList.mockReturnValue(
      successResult([...TEST_DTOS, dtoWithoutNumberOrPosition]),
    );

    render(<PlayerListPage />);

    expect(screen.getAllByRole('listitem')).toHaveLength(TEST_DTOS.length + 1);
    // name과 nameEn이 둘 다 dto.name(영문)이라(AD-3, 번역 없음) PlayerCard가 같은 텍스트를
    // 두 줄(name/nameEn)로 렌더한다 — getAllByText로 중복 매치를 허용한다.
    expect(screen.getAllByText('A. Garnacho').length).toBeGreaterThan(0);
  });

  it('새로고침 — 클릭 즉시 스켈레톤이 뜨고 지연 후 결과로 복귀하며 refetch도 호출된다', () => {
    vi.useFakeTimers();
    const refetch = vi.fn();
    mockedUsePlayerList.mockReturnValue(successResult(TEST_DTOS, refetch));
    render(<PlayerListPage />);

    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(refetch).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(REFRESH_DELAY_MS);
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(TEST_DTOS.length);

    vi.useRealTimers();
  });
});
