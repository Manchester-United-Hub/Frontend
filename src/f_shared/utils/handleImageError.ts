import type { SyntheticEvent } from 'react';

/**
 * 이미지 로딩 실패 시 기본 이미지로 폴백. 무한 루프 방지를 위해 1회만 교체한다.
 *
 * 뉴스·하이라이트·선수·메인 등 외부 피드 이미지를 쓰는 모든 곳에서 공유한다(리뷰 #6).
 * 기본 이미지는 사용처마다 다르므로 매개변수로 받는다.
 */
export function handleImageError(
  event: SyntheticEvent<HTMLImageElement>,
  defaultImageSource: string,
): void {
  const img = event.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = 'true';
  img.src = defaultImageSource;
}
