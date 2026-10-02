/**
 * StandingsTab 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * ST-08: StandingsTab이 `usePLRankList`(react-query) 소비를 그만두고
 * `standings: Standing[]`을 props로 직접 받는 순수 표현 컴포넌트로
 * 바뀌었다(S-6, src/b_pages/season/ui/StandingsTab/StandingsTab.tsx).
 * 기존 loading(StandingSkeleton, role=status)/error(StateBox, role=alert)
 * 2분기는 컴포넌트에서 완전히 사라졌다 — loading은 SeasonTabs가 감싸는
 * Suspense fallback으로, error는 StandingsPanel(서버 컴포넌트)의 실패
 * 분기(StateBox)로 이관됐다. 두 곳 모두 async 서버 컴포넌트/서버 조립
 * 지점이라 jsdom 환경에서 RTL로 렌더할 수 없어(S-16) 이 파일에서는
 * 검증하지 않는다 — Suspense fallback은 순수 마크업이라 단위 테스트
 * 가치가 낮고, StandingsPanel의 데이터 조회+실패 분기는 ST-09가
 * `getStandings` 데이터 접근 함수 테스트로 커버한다.
 *
 * `fetchPremierLeagueRankList` vi.mock·QueryClientProvider 래퍼는 더는
 * 필요 없어 제거했다.
 *
 * 검증 목적: standings를 props로 받아 패널 헤더·순위표·존 범례를
 * 렌더하는가(조립 배선 검증).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StandingsTab } from '@widgets/Standing/ui/StandingsTab';
import { standings } from '@test/fixtures/standings';

afterEach(cleanup);

describe('StandingsTab', () => {
  it('패널 헤더·순위표·존 범례를 모두 렌더한다', () => {
    render(<StandingsTab season="2025-26" standings={standings} />);

    expect(
      screen.getByRole('heading', { level: 2, name: '순위표' })
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: '순위표 존 범례' })
    ).toBeInTheDocument();
  });
});
