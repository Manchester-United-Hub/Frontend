/**
 * FlagSwatch 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage).
 *
 * 검증 목적:
 * - FLAG_GRADIENT에 매핑된 code(pt)는 국기 그라디언트 배경으로 렌더된다
 * - 매핑에 없는 code를 주입했을 때 muted 폴백 배경으로 대체되고 크래시 없다
 *   (FlagSwatch.tsx:16 미도달 분기)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { FlagSwatch } from '@pages/clubInfo/ui/ManagerTab/FlagSwatch';

afterEach(cleanup);

describe('FlagSwatch', () => {
  it('매핑된 code(pt)는 국기 그라디언트 배경으로 렌더된다', () => {
    const { container } = render(<FlagSwatch code="pt" />);
    const swatch = container.querySelector('span[aria-hidden="true"]');
    expect(swatch).not.toBeNull();
    expect(swatch).toHaveStyle({
      background: 'linear-gradient(90deg,#0a6b3b 0 40%,#d52b1e 40% 100%)',
    });
  });

  it('FLAG_GRADIENT에 없는 code면 muted 폴백 배경으로 렌더되고 크래시 없다', () => {
    const { container } = render(<FlagSwatch code="xx" />);
    const swatch = container.querySelector('span[aria-hidden="true"]');
    expect(swatch).not.toBeNull();
    expect(swatch).toHaveStyle({ background: 'var(--muted)' });
  });
});
