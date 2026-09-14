/**
 * ClubHeader 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage), code-conventions §6
 * 컴포넌트 1:테스트 1 미러링 완성.
 *
 * 검증 목적: identity props(구단명·영문명·닉네임·창단연도) 렌더, 액션 버튼 미렌더
 * (ST-005 D-5a 이후 명예의 전당/구단 소식 받기 제거), 배경 실사진이 장식(alt="")이라
 * 접근성 트리에서 제외됨.
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

  it('액션 버튼을 렌더하지 않는다 (명예의 전당·구단 소식 받기 모두 제거)', () => {
    render(<ClubHeader identity={clubIdentity} />);

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('배경 실사진이 alt=""(장식)라 접근성 트리에서 제외된다', () => {
    const { container } = render(<ClubHeader identity={clubIdentity} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const backgroundImage = container.querySelector('img');
    expect(backgroundImage).not.toBeNull();
    expect(backgroundImage).toHaveAttribute('alt', '');
    expect(backgroundImage?.parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});
