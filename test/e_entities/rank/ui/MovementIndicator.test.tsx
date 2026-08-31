/**
 * MovementIndicator 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: up=win색·"순위 상승", down=united-red색·"순위 하락", same=muted색·
 * "순위 변동 없음" 3가지 분기.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { MovementIndicator } from '@entities/rank/ui/MovementIndicator';

afterEach(cleanup);

describe('MovementIndicator', () => {
  it('up은 "순위 상승" 라벨과 win 색 클래스를 갖는다', () => {
    render(<MovementIndicator movement="up" />);
    expect(screen.getByRole('img', { name: '순위 상승' })).toHaveClass('text-win');
  });

  it('down은 "순위 하락" 라벨과 united-red 색 클래스를 갖는다', () => {
    render(<MovementIndicator movement="down" />);
    expect(screen.getByRole('img', { name: '순위 하락' })).toHaveClass('text-united-red');
  });

  it('same은 "순위 변동 없음" 라벨과 muted 색 클래스를 갖는다', () => {
    render(<MovementIndicator movement="same" />);
    expect(screen.getByRole('img', { name: '순위 변동 없음' })).toHaveClass('text-muted-foreground');
  });
});
