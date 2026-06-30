/**
 * TanstackQueryProvider 단위 테스트 (ST-7)
 *
 * 검증 목적:
 * - children을 렌더한다
 * - 하위 consumer가 useQueryClient()로 정의된 QueryClient를 받는다
 * - lazy init 동일성: 부모를 rerender해도 동일 QueryClient 인스턴스가 유지된다
 *   (`useState(()=>new QueryClient())` 속성)
 *
 * 회귀 가드: QueryClient를 useState 없이 컴포넌트 바디에서 생성하는 패턴으로 바뀌면
 * 세 번째 테스트가 깨진다 — rerender 시마다 새 인스턴스가 생성되어 toBe 비교 실패.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { TanstackQueryProvider } from '@app/providers';

afterEach(() => {
  cleanup();
});

describe('TanstackQueryProvider', () => {
  it('children을 렌더한다', () => {
    render(
      <TanstackQueryProvider>
        <div data-testid="child">child content</div>
      </TanstackQueryProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('하위 consumer가 useQueryClient()로 정의된 QueryClient를 받는다', () => {
    let capturedClient: QueryClient | undefined;

    function Consumer() {
      capturedClient = useQueryClient();
      return null;
    }

    render(
      <TanstackQueryProvider>
        <Consumer />
      </TanstackQueryProvider>
    );

    expect(capturedClient).toBeInstanceOf(QueryClient);
  });

  it('부모를 rerender해도 동일 QueryClient 인스턴스가 유지된다 (lazy init 회귀 가드)', () => {
    let firstClient: QueryClient | undefined;
    let latestClient: QueryClient | undefined;

    function Consumer() {
      latestClient = useQueryClient();
      return null;
    }

    function Wrapper({ tick }: { tick: number }) {
      return (
        <TanstackQueryProvider>
          <Consumer />
          <span data-testid="tick">{tick}</span>
        </TanstackQueryProvider>
      );
    }

    const { rerender } = render(<Wrapper tick={0} />);
    firstClient = latestClient;

    rerender(<Wrapper tick={1} />);
    expect(latestClient).toBe(firstClient);

    rerender(<Wrapper tick={2} />);
    expect(latestClient).toBe(firstClient);
  });
});
