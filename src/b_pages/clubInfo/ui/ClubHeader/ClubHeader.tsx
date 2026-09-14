import Image from 'next/image';
import { History } from 'lucide-react';

import type { ClubIdentity } from '../../model/types';
import { Badge, Eyebrow, Shell, UnitedShield } from '@shared/ui';

/* ── 헤더 전용 아이콘 (모듈 스코프 호이스팅) ─────────────────────────── */

const ICON_HISTORY = <History size={13} aria-hidden="true" />;

const CLUB_HEADER_HEADING_ID = 'club-header-heading';
const CLUB_HEADER_BG_SRC = '/images/old-trafford.jpg';
const CLUB_HEADER_BG_SIZES = '100vw';

/* ── 컴포넌트 ─────────────────────────────────────────────────────── */

export interface ClubHeaderProps {
  identity: ClubIdentity;
}

/**
 * 구단 아이덴티티 헤더 — 배경 실사진(마스크) + 스크림, 크레스트, 구단명·닉네임,
 * 창단연도 뱃지. 서버 컴포넌트(상태 없음). design-ref `club.jsx`의 `ClubHeader`가
 * 정답지(단, `.ch-actions`는 자식 없는 컨테이너라 렌더하지 않는다 — decisions 참조).
 *
 * 배경(D-5a): `.club-head::before`의 CSS 배경 대신, 마스크를 입힌 absolute 래퍼
 * 안에 `next/image`(fill·priority·sizes="100vw")로 렌더한다 — 418KB LCP 후보라
 * next/image의 반응형 최적화가 필요하고, mask-image를 래퍼에 걸면 자식 img까지
 * 함께 잘려 시각 결과가 CSS 배경과 동일하다. 외부 wikimedia 호스트 대신 D-4로
 * 확보한 로컬 자산(`public/images/old-trafford.jpg`)을 재사용한다(D-2: 외부 호스트
 * 미추가). 장식 이미지라 래퍼 `aria-hidden` + `alt=""`로 접근성 트리에서 제외한다
 * (기존 `role="img"`+`aria-label` 플레이스홀더는 제거 — 이중 선언 방지).
 * 마스크 그라디언트의 `#000`은 색이 아니라 알파 스텐실(mask-mode: match-source → alpha)이라
 * 토큰화 대상이 아니다 — 시안 club.css:5 문자열을 축자 이식했다(decision-1).
 *
 * 크레스트 배지: 시안은 빨간 정사각형 배경 위 흰색 채움 방패(색 반전)지만,
 * f_shared `UnitedShield`는 빨간 채움/흰 선 고정(내부 수정 금지 — 소비만).
 * 두 값을 그대로 합치면(빨강 배경 위 빨강 채움) 방패 윤곽이 배경에 묻혀 사라지므로,
 * 배지 배경을 흰색으로 두어 UnitedShield를 있는 그대로 재사용했다(§1.5 (a) variant
 * 흡수 불가 → 임의 재구현 대신 최소 변형). result-ST-002.md에 결정 사유 기록.
 */
export function ClubHeader({ identity }: ClubHeaderProps) {
  return (
    <section
      aria-labelledby={CLUB_HEADER_HEADING_ID}
      className="relative isolate overflow-hidden border-b border-border bg-[var(--surface-hero)]"
    >
      {/* 배경 실사진 — 장식(마스크로 좌측 대부분 가려짐) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 [mask-image:linear-gradient(90deg,transparent_0%,transparent_40%,rgba(0,0,0,.45)_66%,#000_92%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,transparent_40%,rgba(0,0,0,.45)_66%,#000_92%)]"
      >
        <Image
          alt=""
          src={CLUB_HEADER_BG_SRC}
          fill
          priority
          sizes={CLUB_HEADER_BG_SIZES}
          className="object-cover"
        />
      </div>

      {/* 스크림 — 좌측 텍스트 가독성 확보(모바일은 상하 그라디언트로 전환) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-1 bg-[linear-gradient(90deg,var(--surface-hero)_0%,var(--surface-hero)_40%,color-mix(in_srgb,var(--surface-hero)_72%,transparent)_66%,color-mix(in_srgb,var(--surface-hero)_35%,transparent)_100%)] max-[620px]:bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-hero)_55%,transparent)_0%,color-mix(in_srgb,var(--surface-hero)_88%,transparent)_100%)]"
      />

      <Shell className="relative z-2 pb-10 pt-12">
        <div className="relative flex items-center gap-6 max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-4">
          {/* 크레스트 */}
          <span className="grid h-24 w-24 flex-none place-items-center rounded-lg bg-white max-[620px]:h-[72px] max-[620px]:w-[72px]">
            <UnitedShield
              size={64}
              className="max-[620px]:h-12 max-[620px]:w-12"
            />
          </span>

          {/* 구단명 · 닉네임 */}
          <div className="min-w-0">
            <Eyebrow className="text-[#e4e4e7]">구단 정보 · Club</Eyebrow>
            <h1
              id={CLUB_HEADER_HEADING_ID}
              className="mt-2 text-[38px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white max-[620px]:text-[28px]"
            >
              {identity.name}
            </h1>
            <div className="mt-1 text-sm text-[#d4d4d8]">{identity.en}</div>
            <div className="mt-3.5 flex flex-wrap gap-2">
              <Badge variant="soft">{identity.nickname}</Badge>
              <Badge>
                {ICON_HISTORY}
                Est. {identity.founded}
              </Badge>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
