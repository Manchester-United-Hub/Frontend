/**
 * EndpointPanel 컴포넌트 테스트 (ST-5)
 *
 * 검증 목적:
 * - endpoint.fields 기반 입력 필드·라벨·paramType 뱃지 렌더 / defaultValue 초기화
 * - fields 0개일 때 "파라미터 없음" 렌더
 * - 입력 변경 시 preview URL 갱신
 * - Request 버튼 클릭 시 fetch가 previewUrl로 호출됨
 * - 응답 ok=true → 초록색 status 뱃지·body JSON 렌더
 * - 응답 ok=false → 빨간색 status 뱃지 렌더
 * - isFetching 중 버튼이 "요청 중..."·disabled 상태
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

import { EndpointPanel } from '@pages/apiTest/ui';
import type { EndpointDef } from '@pages/apiTest/model';

// --- 테스트 픽스처 ---

const noFieldsEndpoint: EndpointDef = {
  name: 'Recent News',
  path: '/api/v1/news?preview=1',
  fields: [],
};

const withFieldsEndpoint: EndpointDef = {
  name: 'News List',
  path: '/api/v1/news',
  fields: [
    {
      name: 'cursorAt',
      label: 'Cursor At',
      type: 'text',
      required: true,
      placeholder: '2024-01-01T00:00',
      paramType: 'query',
    },
    {
      name: 'cursorId',
      label: 'Cursor ID',
      type: 'number',
      required: true,
      placeholder: '0',
      defaultValue: '0',
      paramType: 'query',
    },
    {
      name: 'size',
      label: 'Size',
      type: 'number',
      required: true,
      placeholder: '10',
      defaultValue: '10',
      paramType: 'query',
    },
  ],
};

// --- 헬퍼 ---

function renderPanel(endpoint: EndpointDef) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <EndpointPanel endpoint={endpoint} />
    </QueryClientProvider>
  );
}

// --- 생명주기 ---

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

// --- 테스트 ---

describe('EndpointPanel', () => {
  it('endpoint.fields 기반 입력 필드·라벨·paramType 뱃지가 렌더되고 defaultValue로 초기화된다', () => {
    const { container } = renderPanel(withFieldsEndpoint);

    // 라벨 렌더
    expect(container.textContent).toContain('Cursor At');
    expect(container.textContent).toContain('Cursor ID');
    expect(container.textContent).toContain('Size');
    // paramType 뱃지
    expect(container.textContent).toContain('query');

    // 입력 필드 3개 (모두 type="text")
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3);

    // defaultValue 초기화 확인
    expect((inputs[1] as HTMLInputElement).value).toBe('0');  // cursorId
    expect((inputs[2] as HTMLInputElement).value).toBe('10'); // size
  });

  it('fields가 0개이면 "파라미터 없음" 문구가 렌더된다', () => {
    const { container } = renderPanel(noFieldsEndpoint);
    expect(container.textContent).toContain('파라미터 없음');
  });

  it('입력 변경 시 preview URL이 갱신된다', async () => {
    const user = userEvent.setup();
    const { container } = renderPanel(withFieldsEndpoint);

    // 초기 preview — cursorId=0, size=10 (cursorAt은 빈 값이라 제외)
    expect(container.textContent).toContain('/api/v1/news');

    // cursorId 값을 0 → 999로 변경
    const inputs = screen.getAllByRole('textbox');
    const cursorIdInput = inputs[1];
    await user.clear(cursorIdInput);
    await user.type(cursorIdInput, '999');

    // preview URL에 cursorId=999 반영 확인
    expect(container.textContent).toContain('cursorId=999');
  });

  it('Request 버튼 클릭 시 fetch가 previewUrl로 호출된다', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ data: 'ok' }),
    } as unknown as Response);

    const user = userEvent.setup();
    renderPanel(noFieldsEndpoint);

    await user.click(screen.getByRole('button', { name: 'Request' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/v1/news?preview=1');
    });
  });

  it('응답 ok=true이면 초록색 status 뱃지와 응답 body가 렌더된다', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ message: 'success' }),
    } as unknown as Response);

    const user = userEvent.setup();
    const { container } = renderPanel(noFieldsEndpoint);

    await user.click(screen.getByRole('button', { name: 'Request' }));

    await waitFor(() => {
      expect(container.textContent).toContain('Response');
    });

    const statusBadge = screen.getByText('200');
    expect(statusBadge).toHaveClass('bg-green-100');
    expect(container.textContent).toContain('"message"');
  });

  it('응답 ok=false이면 빨간색 status 뱃지가 렌더된다', async () => {
    vi.mocked(fetch).mockResolvedValue({
      status: 500,
      ok: false,
      json: () => Promise.resolve({ error: 'Internal Server Error' }),
    } as unknown as Response);

    const user = userEvent.setup();
    const { container } = renderPanel(noFieldsEndpoint);

    await user.click(screen.getByRole('button', { name: 'Request' }));

    await waitFor(() => {
      expect(container.textContent).toContain('Response');
    });

    const statusBadge = screen.getByText('500');
    expect(statusBadge).toHaveClass('bg-red-100');
  });

  it('isFetching 중 버튼이 "요청 중..."으로 변경되고 disabled 상태다', async () => {
    let resolveFetch!: (value: Response) => void;
    const pendingFetch = new Promise<Response>((res) => {
      resolveFetch = res;
    });
    vi.mocked(fetch).mockImplementation(() => pendingFetch);

    const user = userEvent.setup();
    renderPanel(noFieldsEndpoint);

    expect(screen.getByRole('button', { name: 'Request' })).not.toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Request' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '요청 중...' })).toBeDisabled();
    });

    // pending promise를 resolve하여 dangling promise 정리
    resolveFetch({
      status: 200,
      ok: true,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).not.toBeDisabled();
    });
  });
});
