/**
 * /club 라우트 스모크 테스트 — QA 커버리지 갭 메우기(qa-coverage).
 *
 * 라우트 엔트리(Club, async Server Component)가 loadManager로 감독을 조회해
 * ClubPage에 위임하고, 런타임 에러 없이 렌더되는지 검증한다. 컴포넌트 함수를 직접
 * 호출해 await로 반환된 JSX를 render()에 전달한다(players/[playerId] 라우트 테스트 선례).
 * 세부 시나리오(탭 전환 등)는 test/b_pages/clubInfo/ClubPage.test.tsx가 담당한다.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import Club from '@app/club/page';
import { loadManager } from '@pages/clubInfo/api/loadManager';
import { MANAGER_FIXTURE } from '@test/fixtures/coach';

vi.mock('@pages/clubInfo/api/loadManager', () => ({ loadManager: vi.fn() }));

beforeEach(() => {
  vi.mocked(loadManager).mockResolvedValue(MANAGER_FIXTURE);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Club 라우트 (app/club/page)', () => {
  it('런타임 에러 없이 마운트되고 ClubPage(<main> + 탭 4개)가 렌더된다', async () => {
    const { container } = render(await Club());
    expect(container.querySelector('main')).not.toBeNull();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
  });

  it('초기 탭은 history — 연혁 타임라인이 기본 렌더된다', async () => {
    render(await Club());
    expect(screen.getByRole('tab', { name: /연혁/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('뉴턴 히스 LYR 창단')).toBeInTheDocument();
  });

  it('loadManager로 조회한 감독을 ClubPage에 전달한다(요약 카드에 감독 이름 표시)', async () => {
    render(await Club());
    expect(loadManager).toHaveBeenCalledTimes(1);
    expect(screen.getByText(MANAGER_FIXTURE.name)).toBeInTheDocument();
  });
});
