/**
 * Crest 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: teamLogoUrl 이미지 렌더, 장식 요소이므로 wrapper aria-hidden,
 * className 병합(호출자 우선).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Crest } from '@pages/season/ui/Crest';

afterEach(cleanup);

describe('Crest', () => {
  it('teamLogoUrl 이미지를 렌더한다', () => {
    render(
      <Crest
        teamLogoUrl="https://media.api-sports.io/football/teams/33.png"
        code="MUN"
      />
    );
    expect(screen.getByAltText('팀 로고')).toBeInTheDocument();
  });

  it('장식 요소이므로 wrapper가 aria-hidden이다', () => {
    const { container } = render(
      <Crest
        teamLogoUrl="https://media.api-sports.io/football/teams/33.png"
        code="MUN"
      />
    );
    expect(container.querySelector('span')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('className을 호출자 우선으로 병합한다', () => {
    const { container } = render(
      <Crest
        teamLogoUrl="https://media.api-sports.io/football/teams/33.png"
        code="MUN"
        className="custom-crest"
      />
    );
    expect(container.querySelector('span')).toHaveClass('custom-crest');
  });
});
