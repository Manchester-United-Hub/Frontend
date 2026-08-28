'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * PlayerCard(f_shared, 수정 금지)의 photo 슬롯에 주입하는 실사진.
 *
 * next/image는 로딩 실패 시 handleImageError(f_shared/utils)처럼 src를 직접 교체할 수
 * 없다(NewsRow.tsx 상단 주석 — next/image 전환 시 state 기반 폴백이 필요하다는 선례).
 * 그래서 Crest(f_shared/ui/Crest)와 동일하게 에러를 로컬 state로 추적한다.
 *
 * `PlayerCard`의 `photo ?? <Silhouette />`는 **slot으로 넘긴 값**만 본다. 이 컴포넌트가
 * 렌더 결과로 `null`을 내도 slot 값(React 엘리먼트)은 여전히 non-nullish라 `PlayerCard`의
 * 폴백은 **절대 평가되지 않는다.** 그래서 로드 실패 폴백은 여기서 직접 렌더한다
 * (D-15 · signoff 파트 1).
 */
interface RosterCardPhotoProps {
  src: string;
}

const PLAYER_PHOTO_SIZE = 400;

// PlayerCard(f_shared)의 비공개 Silhouette과 동일 형상이다. f_shared를 수정하지 않기 위한
// 의도된 중복이며(S-19), PlayerCard가 Silhouette을 공개 API로 노출하면 그때 치환한다.
const PHOTO_FALLBACK_SILHOUETTE = (
  <svg
    viewBox="0 0 64 64"
    fill="currentColor"
    aria-hidden="true"
    className="h-2/3 w-2/3 text-muted-foreground/40"
  >
    <circle cx="32" cy="22" r="13" />
    <path d="M8 60c0-14 11-22 24-22s24 8 24 22z" />
  </svg>
);

function RosterCardPhoto({ src }: RosterCardPhotoProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) return PHOTO_FALLBACK_SILHOUETTE;

  return (
    <Image
      src={src}
      // 카드 본문에 선수 이름(name·nameEn)이 이미 텍스트로 노출되므로(NewsRow.tsx와 동일한
      // 판단) 사진은 장식용으로 두어 스크린리더 중복 낭독을 피한다.
      alt=""
      width={PLAYER_PHOTO_SIZE}
      height={PLAYER_PHOTO_SIZE}
      loading="lazy"
      onError={handleError}
      className="h-full w-full object-cover"
    />
  );
}

export { RosterCardPhoto };
