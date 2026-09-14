/**
 * StadiumPhotoSlot 전용 테스트 (ST-006 — D-3 구장 실사진 도입).
 *
 * 검증 목적:
 * - 실제 사진(next/image)이 role="img"·의미 있는 alt·src로 렌더되는가
 * - 기존 아이콘 워터마크 플레이스홀더 분기가 제거되었는가
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StadiumPhotoSlot } from '@pages/clubInfo/ui/StadiumTab/StadiumPhotoSlot';

afterEach(cleanup);

describe('StadiumPhotoSlot', () => {
  it('구장명 기반 alt를 가진 사진을 role="img"로 렌더한다', () => {
    render(<StadiumPhotoSlot name="올드 트래포드" />);

    const photo = screen.getByRole('img', { name: '올드 트래포드 항공 전경' });
    expect(photo).toBeInTheDocument();
    expect(photo.tagName).toBe('IMG');
    expect(photo.getAttribute('src')).toContain('old-trafford.jpg');
  });

  it('아이콘 워터마크 플레이스홀더를 렌더하지 않는다', () => {
    const { container } = render(<StadiumPhotoSlot name="올드 트래포드" />);

    expect(container.querySelector('svg')).toBeNull();
  });
});
