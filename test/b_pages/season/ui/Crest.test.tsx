/**
 * Crest 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: 팀 코드 렌더, utd 강조(빨강 배경) vs 기본(muted 배경) 시각 분기,
 * 장식 요소이므로 aria-hidden.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Crest } from '@pages/season/ui/Crest';

afterEach(cleanup);

describe('Crest', () => {
  it('팀 코드를 렌더하고 aria-hidden(장식 요소)이다', () => {
    render(<Crest code="MUN" />);
    const crest = screen.getByText('MUN');
    expect(crest).toHaveAttribute('aria-hidden', 'true');
  });

  it('utd=true면 united-red 배경·흰 글자 클래스를 갖는다', () => {
    render(<Crest code="MUN" utd />);
    expect(screen.getByText('MUN')).toHaveClass('bg-united-red', 'text-white');
  });

  it('utd 미지정(기본)이면 muted 배경 클래스를 갖는다', () => {
    render(<Crest code="LIV" />);
    expect(screen.getByText('LIV')).toHaveClass('bg-muted');
  });
});
