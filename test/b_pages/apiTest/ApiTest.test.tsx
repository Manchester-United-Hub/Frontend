/**
 * ApiTest 페이지 컴포넌트 테스트 (ST-6)
 *
 * 검증 목적:
 * - "API Test" 헤딩 렌더
 * - 카테고리 탭(News / Player / Team / Match) 4개 렌더
 * - 복수 endpoint 카테고리(News)는 첫 로드 시 중첩 endpoint 탭이 렌더됨
 * - 단일 endpoint 카테고리(Player) 클릭 시 EndpointPanel이 직접 렌더됨
 *
 * 전략: EndpointPanel을 vi.mock으로 스텁 → useQuery 의존성 제거,
 *       QueryClientProvider 불필요, 탭 구조 검증에 집중.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// EndpointPanel 스텁 — useQuery 의존성 제거
vi.mock('@pages/apiTest/ui', () => ({
  EndpointPanel: ({ endpoint }: { endpoint: { name: string } }) =>
    React.createElement(
      'div',
      { 'data-testid': 'endpoint-panel' },
      endpoint.name
    ),
}));

import { ApiTest } from '@pages/apiTest/ApiTest';

afterEach(cleanup);

describe('ApiTest', () => {
  it('"API Test" 헤딩이 렌더된다', () => {
    const { container } = render(<ApiTest />);
    expect(container.textContent).toContain('API Test');
  });

  it('카테고리 탭(News / Player / Team / Match) 4개가 렌더된다', () => {
    render(<ApiTest />);
    expect(screen.getByRole('tab', { name: 'News' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Player' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Team' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Match' })).toBeInTheDocument();
  });

  it('복수 endpoint 카테고리(News)는 기본 선택 시 중첩 endpoint 탭이 렌더된다', () => {
    render(<ApiTest />);
    // News 탭이 기본 선택 → News TabPanel 렌더 → 내부에 endpoint 탭(Recent News, News List)
    expect(
      screen.getByRole('tab', { name: 'Recent News' })
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'News List' })).toBeInTheDocument();
  });

  it('단일 endpoint 카테고리(Player) 클릭 시 EndpointPanel이 직접 렌더된다', async () => {
    const user = userEvent.setup();
    render(<ApiTest />);

    await user.click(screen.getByRole('tab', { name: 'Player' }));

    await waitFor(() => {
      const panels = screen.getAllByTestId('endpoint-panel');
      expect(panels.some((p) => p.textContent === 'Player List')).toBe(true);
    });
  });
});
