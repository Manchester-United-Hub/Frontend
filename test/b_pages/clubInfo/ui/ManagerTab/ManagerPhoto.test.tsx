/**
 * ManagerPhoto 전용 테스트 — 감독 사진(next/image)과 Silhouette 폴백 분기 검증.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ManagerPhoto } from '@pages/clubInfo/ui/ManagerTab/ManagerPhoto';

afterEach(cleanup);

const PHOTO_URL = 'https://example.com/coaches/25762.png';
const PHOTO_ALT = 'Michael Carrick 감독 사진';

describe('ManagerPhoto', () => {
  it('src가 있으면 alt를 가진 사진을 role="img"로 렌더한다', () => {
    render(<ManagerPhoto src={PHOTO_URL} alt={PHOTO_ALT} />);

    const photo = screen.getByRole('img', { name: PHOTO_ALT });
    expect(photo.tagName).toBe('IMG');
    expect(photo.getAttribute('src')).toContain(encodeURIComponent(PHOTO_URL));
  });

  it('src가 null이면 사진 없이 장식용 Silhouette을 렌더한다', () => {
    const { container } = render(<ManagerPhoto src={null} alt={PHOTO_ALT} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });

  it('사진 로드에 실패하면 Silhouette으로 대체한다', () => {
    const { container } = render(<ManagerPhoto src={PHOTO_URL} alt={PHOTO_ALT} />);

    fireEvent.error(screen.getByRole('img', { name: PHOTO_ALT }));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });
});
