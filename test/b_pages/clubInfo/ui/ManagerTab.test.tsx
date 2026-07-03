/**
 * ManagerTab 파생 계산 테스트 — QA 검증(qa-clubInfo).
 *
 * 검증 목적:
 * - 승률(win rate) = round(w / p * 100)이 렌더 중 정확히 파생되는가 (mockData: 19/38 = 50%)
 * - 경계값: p=0(0경기) 입력 시 division-by-zero 없이 대체 텍스트('—')로 가드되는가
 *   (code-review 후속 조치 — 이전에는 NaN%가 렌더되는 것을 "이슈로 기록"만 했으나 가드 적용됨)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ManagerTab } from '@pages/clubInfo/ui/ManagerTab';
import { manager } from '@pages/clubInfo/model/mockData';

afterEach(cleanup);

describe('ManagerTab 승률 파생 계산', () => {
  it('mockData 기준 19승/38경기 → 50% 로 표시된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(manager.record).toEqual({ p: 38, w: 19, d: 9, l: 10 });
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('38경기 기준', { exact: false })).toBeInTheDocument();
  });

  it('P/W/D/L 4셀이 record 값 그대로 렌더된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(screen.getByText('38')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('경계값: p=0이면 NaN% 대신 대체 텍스트(—)가 렌더되고 크래시 없다', () => {
    const zeroGames = { ...manager, record: { p: 0, w: 0, d: 0, l: 0 } };
    expect(() => render(<ManagerTab manager={zeroGames} />)).not.toThrow();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByText('NaN%')).not.toBeInTheDocument();
  });
});
