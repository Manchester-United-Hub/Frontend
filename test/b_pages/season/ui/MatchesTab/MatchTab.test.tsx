/**
 * MatchesTab 통합 테스트 — QA 시나리오(플랜 "SeasonTabs 탭 전환·필터 적용 시
 * 행 수 변화·대회필터로 빈상태 도달").
 *
 * 검증 목적:
 * - 초기 렌더 = 전체 13경기
 * - 홈/대회 필터 적용 시 해당 조건에 맞는 경기 수만큼만 렌더
 * - 결과가 없는 필터 조합(홈 + FA컵)이면 빈 상태(StateBox)가 렌더된다
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { MatchesTab } from '@pages/season/ui/MatchesTab';
import { matches } from '@pages/season/model';

afterEach(cleanup);

const rowCount = () => screen.getAllByRole('listitem').length;

describe('MatchesTab', () => {
  it('초기 렌더 시 전체 경기를 모두 렌더한다(필터=전체)', () => {
    render(<MatchesTab />);
    expect(rowCount()).toBe(matches.length);
  });

  it('홈 필터를 선택하면 홈경기 수만큼만 렌더된다', async () => {
    const user = userEvent.setup();
    render(<MatchesTab />);

    await user.click(screen.getByRole('button', { name: '홈' }));

    const homeCount = matches.filter((f) => f.ha === 'home').length;
    expect(rowCount()).toBe(homeCount);
  });

  it('대회 필터(FA컵)를 선택하면 FA컵 경기 수만큼만 렌더된다', async () => {
    const user = userEvent.setup();
    render(<MatchesTab />);

    await user.click(screen.getByRole('button', { name: 'FA컵' }));

    const faCupCount = matches.filter((f) => f.comp === 'FA컵').length;
    expect(rowCount()).toBe(faCupCount);
  });

  it('홈 + FA컵처럼 결과가 없는 필터 조합이면 빈 상태(StateBox)가 렌더된다', async () => {
    const user = userEvent.setup();
    render(<MatchesTab />);

    await user.click(screen.getByRole('button', { name: '홈' }));
    await user.click(screen.getByRole('button', { name: 'FA컵' }));

    expect(
      screen.getByRole('heading', { name: '조건에 맞는 경기가 없어요' })
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
