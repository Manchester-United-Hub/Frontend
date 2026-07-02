import { Building2 } from 'lucide-react';

export interface StadiumPhotoSlotProps {
  /** aria-label에 쓰이는 구장명 — "{name} 전경 사진". */
  name: string;
}

/**
 * 구장 사진 슬롯 — 레포에 실제 이미지 자산이 없어 PlayerCard(f_shared/ui) 실루엣
 * 플레이스홀더 관습을 따라 아이콘 워터마크로 대체한 플레이스홀더.
 * `role="img"` + `aria-label`로 스크린 리더에 사진 자리임을 알린다(ResultBadge 선례).
 */
export function StadiumPhotoSlot({ name }: StadiumPhotoSlotProps) {
  return (
    <div
      role="img"
      aria-label={`${name} 전경 사진`}
      className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-linear-to-b from-muted to-muted/60"
    >
      <div className="absolute inset-0 grid place-items-center">
        <Building2 size={48} strokeWidth={1.5} aria-hidden="true" className="text-muted-foreground/40" />
      </div>
    </div>
  );
}
