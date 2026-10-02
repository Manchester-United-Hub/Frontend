'use client';

import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 에러 상태에서 렌더할 UI. 인자로 받은 reset을 호출하면 children 렌더를 다시 시도한다. */
  fallback: (reset: () => void) => ReactNode;
  /** reset 직전에 호출된다 — useQueryErrorResetBoundary().reset 주입 지점. */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * 렌더 중 throw된 에러를 잡아 fallback으로 대체한다.
 *
 * useSuspenseQuery는 에러를 isError가 아니라 throw로 알리므로(throwOnError 강제) Suspense
 * 경계마다 이 경계가 짝으로 필요하다. 훅으로 대체할 수 없는 유일한 케이스라 클래스로 둔다.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) return this.props.fallback(this.handleReset);

    return this.props.children;
  }
}

export { ErrorBoundary, type ErrorBoundaryProps };
