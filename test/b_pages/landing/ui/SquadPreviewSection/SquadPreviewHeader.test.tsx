/**
 * SquadPreviewHeader 단위 테스트.
 *
 * 검증 목적:
 * - 헤딩 "1군 스쿼드"를 렌더하고 SECTION_HEADING_ID를 id로 노출한다
 *   (상위 section의 aria-labelledby가 이 id를 참조한다)
 * - "역대 선수 목록"은 선수 목록 페이지(/players)로 이동하는 링크다
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import {
  SECTION_HEADING_ID,
  SquadPreviewHeader,
} from '@pages/landing/ui/SquadPreviewSection/SquadPreviewHeader';

afterEach(cleanup);

describe('SquadPreviewHeader', () => {
  it('헤딩 "1군 스쿼드"를 SECTION_HEADING_ID로 렌더한다', () => {
    render(<SquadPreviewHeader />);

    const heading = screen.getByRole('heading', { name: '1군 스쿼드' });
    expect(heading).toHaveAttribute('id', SECTION_HEADING_ID);
  });

  it('"역대 선수 목록"을 /players 링크로 렌더한다', () => {
    render(<SquadPreviewHeader />);

    const link = screen.getByRole('link', { name: /역대 선수 목록/ });
    expect(link).toHaveAttribute('href', '/players');
  });
});
