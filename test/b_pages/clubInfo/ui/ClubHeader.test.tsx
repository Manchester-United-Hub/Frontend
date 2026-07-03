/**
 * ClubHeader 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage), code-conventions §6
 * 컴포넌트 1:테스트 1 미러링 완성.
 *
 * 검증 목적: identity props(구단명·영문명·닉네임·창단연도) 렌더, 액션 버튼 2개,
 * 창단연도 워터마크(장식) 렌더.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ClubHeader } from '@pages/clubInfo/ui/ClubHeader';
import { clubIdentity } from '@pages/clubInfo/model/mockData';

afterEach(cleanup);

describe('ClubHeader', () => {
  it('구단명(h1)·영문명·닉네임 뱃지·창단연도 뱃지를 렌더한다', () => {
    render(<ClubHeader identity={clubIdentity} />);

    expect(
      screen.getByRole('heading', { level: 1, name: clubIdentity.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(clubIdentity.en)).toBeInTheDocument();
    expect(screen.getByText(clubIdentity.nickname)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Est\\.\\s*${clubIdentity.founded}`))).toBeInTheDocument();
  });

  it('명예의 전당 액션 버튼을 렌더한다 (구단 소식 받기 알림 버튼은 임시 비활성화)', () => {
    render(<ClubHeader identity={clubIdentity} />);

    expect(screen.getByRole('button', { name: /명예의 전당/ })).toBeInTheDocument();
    // 알림 버튼 임시 비활성화 — 원복 시 아래 주석 해제
    // expect(screen.getByRole('button', { name: /구단 소식 받기/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /구단 소식 받기/ })).not.toBeInTheDocument();
  });

  it('창단연도 워터마크(장식 요소)가 aria-hidden으로 렌더된다', () => {
    const { container } = render(<ClubHeader identity={clubIdentity} />);
    const watermark = container.querySelector('span.pointer-events-none.select-none');
    expect(watermark).not.toBeNull();
    expect(watermark).toHaveAttribute('aria-hidden', 'true');
    expect(watermark?.textContent).toBe(clubIdentity.founded);
  });
});
