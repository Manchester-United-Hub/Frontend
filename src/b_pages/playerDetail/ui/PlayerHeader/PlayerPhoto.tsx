import { Star } from 'lucide-react';

import { Badge } from '@shared/ui';

import type { PlayerDetail } from '../../model/types';
import { PlayerSilhouette } from './PlayerSilhouette';

const ICON_STAR = <Star size={12} aria-hidden="true" />;

export interface PlayerPhotoProps {
  player: PlayerDetail;
}

/**
 * pd-photo — 사진 컬럼. 사진 자산이 없어 실루엣+워터마크로 대체(design_ref
 * `Silhouette`/`.wm`), 포지션·번호 배지(badge-pos → Badge variant="position")와
 * 레전드/은퇴 배지를 겹쳐 표시한다. 레전드 배지의 `var(--draw)` 배경은 신규 토큰
 * 없이 등록된 `bg-draw` 유틸리티로 대체(raw hex 금지 — plan.json ADR-6과 동일 원칙).
 */
export function PlayerPhoto({ player }: PlayerPhotoProps) {
  const retired = player.status === 'retired';

  return (
    <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-lg border border-border bg-[linear-gradient(165deg,var(--muted),color-mix(in_srgb,var(--muted)_55%,var(--background)))]">
      <Badge variant="position" className="absolute left-3.5 top-3.5">
        {player.pos} · {player.num}
      </Badge>

      {player.legend ? (
        <Badge className="absolute right-3.5 top-3.5 border-transparent bg-draw text-white">
          {ICON_STAR}
          레전드
        </Badge>
      ) : null}
      {!player.legend && retired ? (
        <Badge variant="soft" className="absolute right-3.5 top-3.5">
          은퇴
        </Badge>
      ) : null}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 -right-5 select-none text-[230px] font-extrabold leading-none text-foreground/[0.07]"
      >
        {player.num}
      </span>
      <PlayerSilhouette />
    </div>
  );
}
