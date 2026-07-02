import { Badge, Card } from '@shared/ui';

import type { Manager } from '../../model/types';
import { FlagSwatch } from './FlagSwatch';
import { Silhouette } from './Silhouette';

/** 감독 사진 슬롯 워터마크 번호(시안 정본 값, 카드 1장 고정) */
const PHOTO_WATERMARK = '01';

export interface ManagerCardProps {
  manager: Manager;
}

/** 감독 사진 슬롯(실루엣+워터마크+뱃지) + 이름/국적/나이 메타. */
export function ManagerCard({ manager }: ManagerCardProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[linear-gradient(160deg,var(--muted),color-mix(in_srgb,var(--muted)_55%,var(--background)))]">
        <Badge variant="position" className="absolute left-3 top-3">감독</Badge>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-2.5 select-none text-[150px] font-extrabold leading-none text-muted-foreground/10"
        >
          {PHOTO_WATERMARK}
        </span>
        <Silhouette />
      </div>
      <div className="p-[18px]">
        <h3 className="text-[22px] font-extrabold tracking-[-0.01em]">{manager.name}</h3>
        <div className="mt-0.5 text-[13px] text-muted-foreground">{manager.en}</div>
        <div className="mt-2.5 flex items-center gap-2 text-[13px] text-muted-foreground">
          <FlagSwatch code={manager.flag} />
          {manager.nat}
          <span className="text-border">·</span>
          {manager.age}
        </div>
      </div>
    </Card>
  );
}
