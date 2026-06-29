import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { MatchCard } from '@shared/ui';

afterEach(cleanup);

const nextProps = {
  variant: 'next' as const,
  tag: '다음 경기',
  competition: 'PL',
  venue: 'Old Trafford',
  date: '9월 14일',
  home: { code: 'MUN', name: '맨유' },
  away: { code: 'LIV', name: '리버풀' },
};

describe('MatchCard', () => {
  it('대진·대회·경기장 정보를 렌더한다', () => {
    render(<MatchCard {...nextProps} />);
    expect(screen.getByText('맨유')).toBeInTheDocument();
    expect(screen.getByText('리버풀')).toBeInTheDocument();
    expect(screen.getByText('PL')).toBeInTheDocument();
    expect(screen.getByText(/Old Trafford/)).toBeInTheDocument();
  });

  it('점수가 없으면 VS를 표시한다', () => {
    render(<MatchCard {...nextProps} />);
    expect(screen.getByText('VS')).toBeInTheDocument();
  });

  it('점수 0도 유효 점수로 표시한다(0–2, VS 아님)', () => {
    render(
      <MatchCard
        variant="past"
        tag="9월 1일"
        result="L"
        competition="PL"
        venue="Anfield"
        date="9월 1일"
        home={{ code: 'MUN', name: '맨유', score: 0 }}
        away={{ code: 'LIV', name: '리버풀', score: 2 }}
      />
    );
    expect(screen.getByText('0–2')).toBeInTheDocument();
    expect(screen.queryByText('VS')).toBeNull();
  });

  it('past에 result를 주면 결과 배지와 점수를 함께 표시한다', () => {
    render(
      <MatchCard
        variant="past"
        tag="9월 1일"
        result="W"
        competition="PL"
        venue="Old Trafford"
        date="9월 1일"
        home={{ code: 'MUN', name: '맨유', score: 3 }}
        away={{ code: 'AVL', name: '아스톤빌라', score: 1 }}
      />
    );
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('3–1')).toBeInTheDocument();
  });

  it('highlight 팀의 crest는 united-red 배경을 적용한다', () => {
    render(
      <MatchCard
        {...nextProps}
        home={{ code: 'MUN', name: '맨유', highlight: true }}
      />
    );
    expect(screen.getByText('MUN')).toHaveClass('bg-united-red');
  });
});
