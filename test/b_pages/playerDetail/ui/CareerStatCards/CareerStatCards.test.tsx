/**
 * CareerStatCards 단위 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * D-21(PD-2)로 우승 트로피 카드가 제거되고 `trophies` prop도 사라졌다 —
 * 검증 목적: 통산(시즌 합계) 스탯 카드 3개(출전/득점/도움)가 props 그대로
 * 렌더되는가, 트로피 카드는 더 이상 렌더되지 않는가.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { CareerStatCards } from '@pages/playerDetail/ui';

afterEach(cleanup);

describe('CareerStatCards', () => {
  it('출전·득점·도움 3개 카드를 props 값 그대로 렌더한다', () => {
    render(<CareerStatCards career={{ apps: 290, goals: 84, assists: 71 }} />);

    expect(screen.getByRole('list', { name: '통산 기록' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    expect(screen.getByText('290')).toBeInTheDocument();
    expect(screen.getByText('출전 경기')).toBeInTheDocument();
    expect(screen.getByText('84')).toBeInTheDocument();
    expect(screen.getByText('득점')).toBeInTheDocument();
    expect(screen.getByText('71')).toBeInTheDocument();
    expect(screen.getByText('도움')).toBeInTheDocument();
  });

  it('우승 트로피 카드는 더 이상 렌더되지 않는다 (D-21)', () => {
    render(<CareerStatCards career={{ apps: 290, goals: 84, assists: 71 }} />);
    expect(screen.queryByText('우승 트로피')).not.toBeInTheDocument();
  });

  it('값이 0이어도(경계값) "0"을 그대로 렌더한다 — 논리연산자 && 회귀 방지', () => {
    render(<CareerStatCards career={{ apps: 0, goals: 0, assists: 0 }} />);
    expect(screen.getAllByText('0')).toHaveLength(3);
  });
});
