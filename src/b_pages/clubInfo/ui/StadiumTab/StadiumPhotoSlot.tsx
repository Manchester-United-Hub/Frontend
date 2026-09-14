import Image from 'next/image';

const STADIUM_PHOTO_SRC = '/images/old-trafford.jpg';
const STADIUM_PHOTO_SIZES = '(min-width: 1025px) 56vw, 100vw';

export interface StadiumPhotoSlotProps {
  /** alt 텍스트에 쓰이는 구장명 — "{name} 항공 전경". */
  name: string;
}

/**
 * 구장 사진 슬롯 — public/images/old-trafford.jpg(로컬 자산, 16:10)를 next/image로
 * 렌더한다. 실제 `<img>`가 의미 있는 alt를 가지므로 role="img"+aria-label 중복 선언은
 * 두지 않는다.
 */
export function StadiumPhotoSlot({ name }: StadiumPhotoSlotProps) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border">
      <Image
        src={STADIUM_PHOTO_SRC}
        alt={`${name} 항공 전경`}
        fill
        sizes={STADIUM_PHOTO_SIZES}
        className="object-cover"
      />
    </div>
  );
}
