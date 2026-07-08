import { describe, expect, it } from 'vitest';
import type { SyntheticEvent } from 'react';

import { handleImageError } from '@shared/utils';

const DEFAULT_IMAGE = '/images/news-default.svg';

/** onError는 SyntheticEvent<HTMLImageElement>를 넘긴다 — currentTarget만 사용하므로 최소 모킹. */
const errorEventFor = (img: HTMLImageElement): SyntheticEvent<HTMLImageElement> =>
  ({ currentTarget: img }) as SyntheticEvent<HTMLImageElement>;

describe('handleImageError', () => {
  it('로딩 실패 시 기본 이미지로 교체한다', () => {
    const img = document.createElement('img');
    img.src = 'https://cdn.example.com/broken.jpg';

    handleImageError(errorEventFor(img), DEFAULT_IMAGE);

    expect(img.getAttribute('src')).toBe(DEFAULT_IMAGE);
    expect(img.dataset.fallback).toBe('true');
  });

  it('기본 이미지도 실패하면 재교체하지 않는다(무한 루프 방지)', () => {
    const img = document.createElement('img');
    img.src = 'https://cdn.example.com/broken.jpg';

    handleImageError(errorEventFor(img), DEFAULT_IMAGE);
    img.src = 'https://cdn.example.com/still-broken.jpg';
    handleImageError(errorEventFor(img), DEFAULT_IMAGE);

    expect(img.getAttribute('src')).toBe('https://cdn.example.com/still-broken.jpg');
  });
});
