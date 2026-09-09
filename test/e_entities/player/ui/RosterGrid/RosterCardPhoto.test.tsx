/**
 * RosterCardPhoto 단위 테스트 — 리뷰③ H-1 회귀 방어 + M-2(테스트 부재) 동시 해소.
 *
 * 검증 목적:
 * - 정상: 실사진(img) 렌더, 실루엣(svg) 없음
 * - 로드 실패(img error): img가 사라지고 자체 실루엣(svg)으로 폴백한다(D-15).
 *   결함 상태(`hasError`일 때 `return null`)였다면 이 케이스는 img 0 · svg 0으로 실패한다.
 * - 실루엣은 aria-hidden="true"로 장식 폴백이 접근성 트리에 새지 않는다.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { RosterCardPhoto } from '@entities/player/ui/RosterGrid/RosterCardPhoto';

afterEach(cleanup);

const PLAYER_PHOTO_URL = 'https://pub-8dfe7ca8163c400aac6a83640c67edb4.r2.dev/players/8.png';

describe('RosterCardPhoto', () => {
  it('정상 상태에서는 img 1개를 렌더하고 svg는 렌더하지 않는다', () => {
    const { container } = render(<RosterCardPhoto src={PLAYER_PHOTO_URL} />);

    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('이미지 로드 실패 시 img가 사라지고 실루엣(svg)으로 폴백한다(D-15)', () => {
    const { container } = render(<RosterCardPhoto src={PLAYER_PHOTO_URL} />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();

    fireEvent.error(img!);

    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });

  it('폴백 실루엣은 aria-hidden="true"로 접근성 트리에 노출되지 않는다', () => {
    const { container } = render(<RosterCardPhoto src={PLAYER_PHOTO_URL} />);
    const img = container.querySelector('img');

    fireEvent.error(img!);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('alt 미지정 시 img의 alt가 기본값 "맨체스터 유나이티드 선수"로 렌더된다', () => {
    const { container } = render(<RosterCardPhoto src={PLAYER_PHOTO_URL} />);

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '맨체스터 유나이티드 선수');
  });

  it('alt를 주입하면 기본값 대신 주입된 값이 렌더된다', () => {
    const { container } = render(
      <RosterCardPhoto src={PLAYER_PHOTO_URL} alt="누네스 선수 사진" />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '누네스 선수 사진');
  });

  it('className을 주입하면 기본 클래스와 병합되고 충돌 시 호출자 값이 우선한다', () => {
    const { container } = render(
      <RosterCardPhoto src={PLAYER_PHOTO_URL} className="object-contain" />
    );

    const img = container.querySelector('img');
    expect(img?.className).toContain('h-full');
    expect(img?.className).toContain('w-full');
    expect(img?.className).toContain('object-contain');
    expect(img?.className).not.toContain('object-cover');
  });
});
