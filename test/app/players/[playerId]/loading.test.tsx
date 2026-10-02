/**
 * /players/[playerId] loading.tsx 스모크 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 검증 목적: 라우트의 loading state가 PlayerDetailSkeleton을 그대로 렌더하는가
 * (런타임 에러 없이 마운트, aria-hidden main).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import PlayerDetailLoading from '@app/players/[playerId]/loading';

afterEach(cleanup);

describe('PlayerDetailLoading 라우트 (app/players/[playerId]/loading)', () => {
  it('런타임 에러 없이 마운트되고 PlayerDetailSkeleton(aria-hidden main)을 렌더한다', () => {
    const { container } = render(<PlayerDetailLoading />);
    const main = container.querySelector('main');
    expect(main).not.toBeNull();
    expect(main).toHaveAttribute('aria-hidden', 'true');
  });
});
