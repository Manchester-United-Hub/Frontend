/**
 * Crest 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: teamLogoUrl 이미지 렌더, 장식 요소이므로 wrapper aria-hidden,
 * className 병합(호출자 우선).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

  it('이미지 로드에 실패하면 팀 코드로 폴백한다.', () => {
    render(
      <Crest
        teamLogoUrl="https://media.api-sports.io/ootball/teams/33.png"
        code="MUN"
      />
    );

    fireEvent.error(screen.getByAltText('팀 로고'));

    expect(screen.getByText('MUN')).toBeInTheDocument();
    expect(screen.queryByAltText('팀 로고')).not.toBeInTheDocument();
  });

  it('팀 코드가 맨체스터 유나이티드 팀이면 배경색이 팀 색상, 글씨는 흰색이다.', () => {
    render(
      <Crest
        teamLogoUrl="https://media.api-sports.io/ootball/teams/33.png"
        code="MUN"
        utd={true}
      />
    );

    fireEvent.error(screen.getByAltText('팀 로고'));

    expect(screen.getByText('MUN')).toBeInTheDocument();
    expect(screen.getByText('MUN')).toHaveClass(
      'border-transparent bg-united-red text-white'
    );
    expect(screen.queryByAltText('팀 로고')).not.toBeInTheDocument();
  });

  it('팀 코드가 맨체스터 유나이티드 팀이 아니면 배경색은 muted, 글씨는 foreground이다.', () => {
    render(
      <Crest
        teamLogoUrl="https://media.api-sports.io/ootball/teams/42.png"
        code="ARS"
      />
    );

    fireEvent.error(screen.getByAltText('팀 로고'));

    expect(screen.getByText('ARS')).toBeInTheDocument();
    expect(screen.getByText('ARS')).toHaveClass(
      'border-border bg-muted text-foreground'
    );
    expect(screen.queryByAltText('팀 로고')).not.toBeInTheDocument();
  });
});
