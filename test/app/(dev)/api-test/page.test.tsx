/**
 * api-test 페이지 통합 테스트 (ST-7)
 *
 * 검증 목적: page → ApiTest → 실제 EndpointPanel → 실제 useQuery → fetch 전체 경로 관통
 * - fetch만 vi.stubGlobal — EndPointPanel·ApiTest·QueryClient 전부 실제 구현 사용
 * - TanstackQueryProvider로 직접 감싸 렌더 (layout이 감싸는 역할을 테스트가 대신함)
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Button 컴포넌트 내부의 next/link import 해소
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
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import TestApi from '@app/(dev)/api-test/page';
import { TanstackQueryProvider } from '@app/providers';

// --- 생명주기 ---

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// --- 헬퍼 ---

function renderPage() {
  return render(
    <TanstackQueryProvider>
      <TestApi />
    </TanstackQueryProvider>
  );
}

// --- 테스트 ---

describe('TestApi 페이지 (통합)', () => {
  it('페이지 렌더 시 카테고리 탭과 실제 EndpointPanel이 화면에 표시된다', () => {
    const { container } = renderPage();

    // 카테고리 탭 렌더 확인
    expect(screen.getByRole('tab', { name: 'News' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Player' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Team' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Game' })).toBeInTheDocument();

    // 실제 EndpointPanel 렌더 확인 — Request 버튼 존재
    expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();

    // 기본 선택: News 카테고리 > Recent News (파라미터 없음)
    expect(container.textContent).toContain('파라미터 없음');
  });

  it('엔드포인트 필드 입력 후 Request 클릭 시 global fetch가 기대 URL로 호출된다', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ data: 'ok' }),
    } as unknown as Response);

    const user = userEvent.setup();
    renderPage();

    // News 카테고리 내 'News List' 엔드포인트 탭으로 이동 (필드 3개 보유)
    await user.click(screen.getByRole('tab', { name: 'News List' }));

    // cursorId 필드 (두 번째 textbox, defaultValue='0') 값을 42로 변경
    const inputs = screen.getAllByRole('textbox');
    const cursorIdInput = inputs[1]; // cursorAt(0), cursorId(1), size(2)
    await user.clear(cursorIdInput);
    await user.type(cursorIdInput, '42');

    // Request 클릭
    await user.click(screen.getByRole('button', { name: 'Request' }));

    // fetch가 cursorId=42를 포함한 URL로 호출됨
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('cursorId=42')
      );
    });
  });

  it('fetch 스텁 응답이 화면에 렌더된다 (fetch → Response → UI 전체 경로)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ result: 'success' }),
    } as unknown as Response);

    const user = userEvent.setup();
    const { container } = renderPage();

    // 기본 선택: Recent News (파라미터 없음) — 바로 Request 클릭
    await user.click(screen.getByRole('button', { name: 'Request' }));

    // Response 섹션이 화면에 나타남
    await waitFor(() => {
      expect(container.textContent).toContain('Response');
    });

    // 스텁 응답 body JSON이 렌더됨
    expect(container.textContent).toContain('"result"');
    expect(container.textContent).toContain('"success"');

    // ok=true → 초록색 status 뱃지
    expect(screen.getByText('200')).toHaveClass('bg-green-100');
  });
});
