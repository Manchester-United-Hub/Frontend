/**
 * ClubTabs 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage).
 *
 * 검증 목적: 기본 동작(6탭 렌더, 기본 활성 탭=history)은 이미
 * test/b_pages/clubInfo/ClubPage.test.tsx가 통합 테스트로 커버한다. 이 파일은
 * ClubTabs.tsx:19-20의 미도달 분기 — `subTabs.find(...) ?? 기본라벨` 폴백 — 을
 * 닫는 데 집중한다.
 *
 * mockData.subTabs에는 항상 highlights/stats 메타가 존재하므로 정상 경로로는
 * `??` 우변(하드코딩 기본 라벨)이 실행되지 않는다. 이 분기를 실제로 타게 하려면
 * subTabs에서 해당 항목을 제거한 상태로 ClubTabs 모듈을 로드해야 한다(HIGHLIGHTS_LABEL/
 * STATS_LABEL은 모듈 스코프 상수라 import 시점에 1회 계산됨) — 그래서 model/mockData를
 * 부분 목업한다. subTabs에서 항목이 사라지면 탭 네비게이션에서도 해당 탭 버튼이
 * 함께 사라지므로(같은 배열을 공유 소스로 사용), 이 테스트는 "폴백 계산이 크래시 없이
 * 실행되고 나머지 탭 동작에 영향을 주지 않는다"를 검증한다.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

vi.mock('@pages/clubInfo/model/mockData', async () => {
  const actual = await vi.importActual<typeof import('@pages/clubInfo/model/mockData')>(
    '@pages/clubInfo/model/mockData',
  );
  return {
    ...actual,
    // highlights/stats 메타를 제거해 ClubTabs.tsx의 `subTabs.find(...) ?? fallback`
    // 우변(하드코딩 기본 라벨)이 모듈 로드 시 실행되도록 강제한다.
    subTabs: actual.subTabs.filter((tab) => tab.id !== 'highlights' && tab.id !== 'stats'),
  };
});

// vi.mock은 vitest 트랜스폼이 파일 최상단으로 호이스팅하므로, 아래 정적 import는
// 이미 위 목업이 적용된 model/mockData를 대상으로 ClubTabs 모듈을 로드한다.
import { ClubTabs } from '@pages/clubInfo/ui/ClubTabs';

afterEach(cleanup);

describe('ClubTabs 라벨 폴백 — subTabs에 하이라이트/팀통계 메타가 없을 때', () => {
  it('폴백 라벨 계산이 크래시 없이 실행되고, 남은 4개 탭은 정상 렌더된다', () => {
    expect(() => render(<ClubTabs />)).not.toThrow();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
    expect(screen.queryByRole('tab', { name: /하이라이트/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /팀통계/ })).not.toBeInTheDocument();
  });

  it('기본 활성 탭(history)은 subTabs 필터링과 무관하게 그대로 렌더된다', () => {
    render(<ClubTabs />);
    expect(screen.getByRole('tab', { name: /연혁/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('뉴턴 히스 LYR 창단')).toBeInTheDocument();
  });
});
