/**
 * CareerStatCards 단위 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 검증 목적: 통산 스탯 카드 4개(출전/득점/도움/우승)가 props 그대로 렌더되는가.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { CareerStatCards } from '@pages/playerDetail/ui';

afterEach(cleanup);

describe('CareerStatCards', () => {
  it('출전·득점·도움·우승 트로피 4개 카드를 props 값 그대로 렌더한다', () => {
    render(<CareerStatCards career={{ apps: 290, goals: 84, assists: 71 }} trophies={2} />);

    expect(screen.getByRole('list', { name: '통산 기록' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);

    expect(screen.getByText('290')).toBeInTheDocument();
    expect(screen.getByText('출전 경기')).toBeInTheDocument();
    expect(screen.getByText('84')).toBeInTheDocument();
    expect(screen.getByText('득점')).toBeInTheDocument();
    expect(screen.getByText('71')).toBeInTheDocument();
    expect(screen.getByText('도움')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('우승 트로피')).toBeInTheDocument();
  });

  it('값이 0이어도(경계값) "0"을 그대로 렌더한다 — 논리연산자 & 회귀 방지', () => {
    render(<CareerStatCards career={{ apps: 0, goals: 0, assists: 0 }} trophies={0} />);
    expect(screen.getAllByText('0')).toHaveLength(4);
  });
});
