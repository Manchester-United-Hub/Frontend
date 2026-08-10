/**
 * /players/[playerId] 라우트 테스트 — 실 API 연동 이후 재작성(PD-3).
 *
 * 필수 시나리오: 라우트 app/players/[playerId]/page.tsx async params 위임.
 *
 * PlayerPage는 Next 16 async Server Component(`params: Promise<{playerId}>`)라
 * team/[teamId] route.test.ts 선례(async params 언랩)와 동일하게, 컴포넌트
 * 함수를 직접 호출해 await로 반환된 JSX를 render()에 전달한다.
 *
 * 이전 버전은 실제 PlayerDetailPage가 slug 기반 mock 데이터를 동기 조회하는
 * 구조라 훅 mock 없이도 렌더됐으나, PD-3의 API 연동(usePlayerProfile/
 * usePlayerStatistics, react-query)으로 QueryClientProvider 없이는 렌더 자체가
 * 불가능해졌다 — PlayerDetailPage.test.tsx와 동일하게 훅을 vi.mock한다
 * (AD-7). 이 파일의 검증 목적은 "라우트가 params를 정확히 위임하는가"이므로
 * usePlayerProfile/usePlayerStatistics에 넘어간 playerId 인자를 직접
 * 단정한다.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
import PlayerPage from '@app/players/[playerId]/page';
import type { PlyaerDTO } from '@entities/player/model';

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

describe('PlayerPage 라우트 (app/players/[playerId]/page)', () => {
  it('params를 await로 풀어 playerId를 PlayerDetailPage에 위임한다 — usePlayerProfile/usePlayerStatistics가 숫자 id로 호출된다', async () => {
    mockedUsePlayerProfile.mockReturnValue(mockQueryResult<PlyaerDTO>({ data: BRUNO_DTO }));
    mockedUsePlayerStatistics.mockReturnValue(mockQueryResult({ data: [] }));

    const jsx = await PlayerPage({ params: Promise.resolve({ playerId: '1485' }) });
    render(jsx);

    expect(screen.getByRole('heading', { level: 1, name: 'Bruno Fernandes' })).toBeInTheDocument();
    expect(mockedUsePlayerProfile).toHaveBeenCalledWith(1485, expect.any(Number));
    expect(mockedUsePlayerStatistics).toHaveBeenCalledWith(1485, expect.any(Number));
  });

  it('숫자로 변환할 수 없는 playerId면 위임된 PlayerDetailPage가 PlayerNotFound를 렌더한다', async () => {
    mockedUsePlayerProfile.mockReturnValue(mockQueryResult({}));
    mockedUsePlayerStatistics.mockReturnValue(mockQueryResult({}));

    const jsx = await PlayerPage({ params: Promise.resolve({ playerId: 'no-such-id' }) });
    render(jsx);

    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
  });

  it('다른 playerId로도 정확히 위임한다', async () => {
    mockedUsePlayerProfile.mockReturnValue(
      mockQueryResult<PlyaerDTO>({ data: { ...BRUNO_DTO, id: 24309, name: 'André Onana', position: 'Goalkeeper' } })
    );
    mockedUsePlayerStatistics.mockReturnValue(mockQueryResult({ data: [] }));

    const jsx = await PlayerPage({ params: Promise.resolve({ playerId: '24309' }) });
    render(jsx);

    expect(screen.getByRole('heading', { level: 1, name: 'André Onana' })).toBeInTheDocument();
    expect(mockedUsePlayerProfile).toHaveBeenCalledWith(24309, expect.any(Number));
  });
});
