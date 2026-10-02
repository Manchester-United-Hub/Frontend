'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Badge } from '@shared/ui';

import type { PlayerDetail } from '../../model/types';
import { PlayerSilhouette } from './PlayerSilhouette';

const UNKNOWN_VALUE = '-';
const PHOTO_SIZES = '(min-width: 980px) 280px, 100vw';

export interface PlayerPhotoProps {
  player: PlayerDetail;
}

/**
 * pd-photo — 사진 컬럼. 포지션·번호 배지(badge-pos → Badge variant="position")를
 * 표시한다.
 *
 * 사진(code-review M-4 반영): 실 API가 모든 선수에게 사진 URL을 제공한다
 * (`PlyaerDTO.photo`, non-null) — "사진 자산이 없어 실루엣으로 대체"는
 * 목데이터 시절 사실이었고 지금은 틀렸다. `season` 페이지의 `Crest.tsx`
 * 선례와 동일한 `next/image` + `useState` 에러 폴백 패턴을 그대로 따른다
 * (`next.config.ts`의 `remotePatterns`가 이미 `**.api-sports.io`를 허용해
 * 별도 설정 변경 없이 연결 가능했다 — `f_shared/ui` 미수정). 이미지 로드
 * 실패(또는 `photo`가 빈 문자열)면 기존 실루엣+숫자 워터마크로 폴백한다.
 *
 * PD-3 판정(PD-2 인계 #2와 동일한 이유의 연장 — 이 파일은 PD-2 files 목록
 * 밖이었지만 같은 `ui/PlayerHeader/` 폴더 소속이라 PD-2 완료 후 수정 허용
 * 원칙을 그대로 적용): 레전드/은퇴 배지(`player.legend`/`player.status`
 * 기반)는 model/types.ts 재작성(PD-3)으로 두 필드가 완전히 제거돼 컴파일이
 * 깨진다. D-24가 이미 확인한 대로 실 playerId로 도달 가능한 선수는 전부
 * 현재 스쿼드뿐이라(레전드는 `/api/players`에 없어 도달 불가) 이 두 배지는
 * 실 데이터 경로에서 항상 미표시였을 배지다 — PD-2가 PlayerHeader.tsx에서
 * 이미 제거한 "현역/은퇴 배지"와 정확히 같은 근거(D-23)로 여기서도 제거한다.
 * `pos`/`num`은 nullable/optional이라(D-23/D-31) '-'로 방어한다.
 */
export function PlayerPhoto({ player }: PlayerPhotoProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const showPhoto = player.photo !== '' && !hasImageError;

  function handleImageLoadError() {
    setHasImageError(true);
  }

  return (
    <div className="relative grid aspect-4/5 place-items-center overflow-hidden rounded-lg border border-border bg-[linear-gradient(165deg,var(--muted),color-mix(in_srgb,var(--muted)_55%,var(--background)))]">
      <Badge variant="position" className="absolute left-3.5 top-3.5 z-10">
        {player.pos ?? UNKNOWN_VALUE} · {player.num ?? UNKNOWN_VALUE}
      </Badge>

      {showPhoto ? (
        <Image
          alt={player.nm}
          src={player.photo}
          fill
          sizes={PHOTO_SIZES}
          className="object-cover"
          onError={handleImageLoadError}
        />
      ) : (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-14 -right-5 select-none text-[230px] font-extrabold leading-none text-foreground/[0.07]"
          >
            {player.num ?? UNKNOWN_VALUE}
          </span>
          <PlayerSilhouette />
        </>
      )}
    </div>
  );
}
