import { Hash } from 'lucide-react';

import { Badge, Eyebrow } from '@shared/ui';

import type { PlayerDetail } from '../../model/types';
import { PlayerInfoGrid, POSITION_LABEL } from './PlayerInfoGrid';
import { PlayerPhoto } from './PlayerPhoto';

const UNKNOWN_VALUE = '-';

export interface PlayerHeaderProps {
  player: PlayerDetail;
}

/**
 * pd-head — 사진 컬럼(PlayerPhoto) + 정보 컬럼(Eyebrow·이름·PlayerInfoGrid).
 * design_ref player-detail.jsx `DetailApp`의 `.pd-head`/`.pd-id`가 정답지.
 * Nav/Footer는 전역 layout이 렌더하므로 여기서 렌더하지 않는다.
 * 주장 배지·활동연도 배지·현역/은퇴 배지·영문명 서브타이틀은 실 API(PlayerResponse)에
 * 대응 필드가 없어 제거했다(D-23).
 *
 * Eyebrow(PD-3 판정, PD-2 인계 #2): 원래 `{player.squad} · {retired ? 'Former
 * Player' : 'First Team'}`이었으나 `squad`/`status` 필드 자체가 model/types.ts
 * 재작성(PD-3)으로 완전히 제거됐다(plan.json PD-3 명세가 명시적으로 "완전히
 * 제거"라 이 두 필드를 예외적으로 남기는 선택지는 명세 위반). 정적 텍스트
 * "First Team"으로 대체한다 — D-24가 이미 확인한 대로 실 playerId로 도달
 * 가능한 선수는 전부 현재 스쿼드뿐이라(레전드는 `/api/players`에 없어 애초에
 * 도달 불가) 이 문구가 특정 선수에 한정된 사실을 지어내는 것이 아니라 API
 * 응답 자체가 성립시키는 항상-참인 문장이다(AD-3 "추측 금지" 원칙과 충돌하지
 * 않음). 포지션 배지도 `pos`가 optional로 바뀌어(D-31) `?? '-'` 폴백을 추가한다.
 */
export function PlayerHeader({ player }: PlayerHeaderProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 pb-2 pt-5 min-[980px]:grid-cols-[280px_1fr] min-[980px]:gap-8">
      <PlayerPhoto player={player} />

      <div>
        <Eyebrow>First Team</Eyebrow>

        <div className="mt-2 flex flex-wrap items-baseline gap-3.5">
          <span className="text-[30px] font-extrabold tracking-[-0.02em] text-united-red">#{player.num ?? UNKNOWN_VALUE}</span>
          <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.025em] min-[620px]:text-[40px]">
            {player.nm}
          </h1>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          <Badge>
            <Hash size={13} aria-hidden="true" />
            {player.pos ? POSITION_LABEL[player.pos] : UNKNOWN_VALUE}
          </Badge>
        </div>

        <PlayerInfoGrid player={player} />
      </div>
    </div>
  );
}
