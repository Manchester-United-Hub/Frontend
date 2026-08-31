/**
 * SeasonHeader 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * ST-06: SeasonHeader에 `status: SeasonStatus` 필수 prop이 추가됐다
 * (src/b_pages/season/ui/SeasonHeader/SeasonHeader.tsx) — eyebrow 옆에
 * SeasonStatusTag를 함께 렌더한다. 라벨 문구 정합성("개막 전"/"시즌 중")과
 * 색상만으로 상태를 구분하지 않는지(a11y)는 SeasonStatusTag.test.tsx(신규)가
 * 전담 검증하므로, 여기서는 SeasonHeader가 받은 status를 실제로
 * SeasonStatusTag에 배선하는지만 확인한다.
 *
 * 검증 목적: eyebrow(동적)·h1(시즌, 고정)·설명 문단 렌더 + status prop 배선.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SeasonHeader } from '@pages/season/ui/SeasonHeader';

const season = '2026-27';

afterEach(cleanup);

describe('SeasonHeader', () => {
  it('eyebrow·h1("시즌")·설명 문단을 렌더한다', () => {
    render(<SeasonHeader season={season} status="upcoming" />);

    expect(screen.getByText(`${season} Premier League`)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: '시즌' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('일정과 결과, 프리미어리그 순위표를 한곳에서 확인하세요.')
    ).toBeInTheDocument();
  });

  it('status="upcoming"이면 "개막 전" 태그가 함께 렌더된다', () => {
    render(<SeasonHeader season={season} status="upcoming" />);

    expect(screen.getByText('개막 전')).toBeInTheDocument();
  });

  it('status="ongoing"이면 "시즌 중" 태그가 함께 렌더된다', () => {
    render(<SeasonHeader season={season} status="ongoing" />);

    expect(screen.getByText('시즌 중')).toBeInTheDocument();
  });
});
