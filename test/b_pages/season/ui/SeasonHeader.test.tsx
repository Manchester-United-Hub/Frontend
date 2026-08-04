/**
 * SeasonHeader 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * ST-A2: SeasonHeader는 이제 `{ season: string }` prop을 필수로 받는다
 * (src/b_pages/season/ui/SeasonHeader/SeasonHeader.tsx). h1은 "시즌" 고정 텍스트이고
 * eyebrow만 `{season} Premier League` 형태로 동적이다.
 *
 * 검증 목적: eyebrow(동적)·h1(시즌, 고정)·설명 문단 렌더.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SeasonHeader } from '@pages/season/ui/SeasonHeader';

const season = '2026-27';

afterEach(cleanup);

describe('SeasonHeader', () => {
  it('eyebrow·h1("시즌")·설명 문단을 렌더한다', () => {
    render(<SeasonHeader season={season} />);

    expect(screen.getByText(`${season} Premier League`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '시즌' })).toBeInTheDocument();
    expect(
      screen.getByText('일정과 결과, 프리미어리그 순위표를 한곳에서 확인하세요.')
    ).toBeInTheDocument();
  });
});
