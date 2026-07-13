/**
 * /players/[playerId] 라우트 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 필수 시나리오 #6: 라우트 app/players/[playerId]/page.tsx async params 위임.
 *
 * PlayerPage는 Next 16 async Server Component(`params: Promise<{playerId}>`)라
 * team/[teamId] route.test.ts 선례(async params 언랩)와 동일하게, 컴포넌트
 * 함수를 직접 호출해 await로 반환된 JSX를 render()에 전달한다.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { ReactNode } from 'react';

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

import PlayerPage from '@app/players/[playerId]/page';

afterEach(cleanup);

describe('PlayerPage 라우트 (app/players/[playerId]/page)', () => {
  it('params를 await로 풀어 playerId를 PlayerDetailPage에 위임한다 — 존재하는 id', async () => {
    const jsx = await PlayerPage({ params: Promise.resolve({ playerId: 'bruno' }) });
    render(jsx);

    expect(screen.getByRole('heading', { level: 1, name: '브루누 페르난데스' })).toBeInTheDocument();
  });

  it('미존재 playerId면 위임된 PlayerDetailPage가 PlayerNotFound를 렌더한다', async () => {
    const jsx = await PlayerPage({ params: Promise.resolve({ playerId: 'no-such-id' }) });
    render(jsx);

    expect(screen.getByRole('heading', { level: 3, name: '선수를 찾을 수 없어요' })).toBeInTheDocument();
  });

  it('다른 playerId(GK, onana)로도 정확히 위임한다', async () => {
    const jsx = await PlayerPage({ params: Promise.resolve({ playerId: 'onana' }) });
    render(jsx);

    expect(screen.getByRole('heading', { level: 1, name: '안드레 오나나' })).toBeInTheDocument();
  });
});
