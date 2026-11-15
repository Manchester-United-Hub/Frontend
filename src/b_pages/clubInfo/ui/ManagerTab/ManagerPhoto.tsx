'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Silhouette } from './Silhouette';

/** mgr-shot 슬롯(w-40 = 160px 정사각) 크기 */
const MANAGER_PHOTO_SIZE = 160;

export interface ManagerPhotoProps {
  src: string | null;
  alt: string;
}

/**
 * 감독 사진 슬롯. next/image는 로드 실패 시 src를 교체할 수 없어 에러를 로컬 state로
 * 추적한다(RosterCardPhoto와 동일). 사진이 없거나 로드에 실패하면 Silhouette으로 폴백.
 */
export function ManagerPhoto({ src, alt }: ManagerPhotoProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (!src || hasError) return <Silhouette />;

  return (
    <Image
      src={src}
      alt={alt}
      width={MANAGER_PHOTO_SIZE}
      height={MANAGER_PHOTO_SIZE}
      onError={handleError}
      className="h-full w-full object-cover"
    />
  );
}
