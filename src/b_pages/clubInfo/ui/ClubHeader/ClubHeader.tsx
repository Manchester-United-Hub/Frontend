import { Award, History } from 'lucide-react';

import type { ClubIdentity } from '../../model/types';
import { Badge, Button, Eyebrow, Shell, UnitedShield } from '@shared/ui';
import { DARK_OUTLINE } from './styles';

/* ── 헤더 전용 아이콘 (모듈 스코프 호이스팅) ─────────────────────────── */

const ICON_AWARD = <Award size={16} aria-hidden="true" />;
// 알림 기능 임시 비활성화 (원복 시 Bell import·아래 상수·버튼 주석 해제)
// const ICON_BELL = <Bell size={16} aria-hidden="true" />;
const ICON_HISTORY = <History size={13} aria-hidden="true" />;

const CLUB_HEADER_HEADING_ID = 'club-header-heading';

/* ── 컴포넌트 ─────────────────────────────────────────────────────── */

export interface ClubHeaderProps {
  identity: ClubIdentity;
}

/**
 * 구단 아이덴티티 헤더 — 배경 사진 슬롯 + 스크림, 크레스트, 구단명·닉네임, 창단연도
 * 워터마크, 액션 2개(명예의 전당/구단 소식 받기, 정적 JSX — ctas 모델 필드 없음).
 * 서버 컴포넌트(상태 없음). design-ref `club.jsx`의 `ClubHeader`가 정답지.
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
      className="relative isolate overflow-hidden border-b border-border bg-[#0b0b0d]"
    >
      {/* 배경 사진 슬롯 — 실제 사진 자산 준비 전 플레이스홀더 */}
      <div
        role="img"
        aria-label={`${identity.name} 팀 사진`}
        className="absolute inset-0 z-0 bg-linear-to-br from-[#1a1a1d] to-[#0b0b0d]"
      />

      {/* 스크림 — 좌측 텍스트 가독성 확보(모바일은 상하 그라디언트로 전환) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-1 bg-[linear-gradient(90deg,rgba(11,11,13,0.94)_0%,rgba(11,11,13,0.80)_44%,rgba(11,11,13,0.42)_100%)] max-[620px]:bg-[linear-gradient(180deg,rgba(11,11,13,0.55)_0%,rgba(11,11,13,0.88)_100%)]"
      />

      <Shell className="relative z-2 pb-10 pt-12">
        <div className="relative flex items-center gap-6 max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-4">
          {/* 창단연도 워터마크 */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[-30px] top-1/2 -translate-y-1/2 select-none text-[240px] font-extrabold leading-none tracking-[-0.02em] text-white/[0.06]"
          >
            {identity.founded}
          </span>

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

          {/* 액션 — model에 ctas 없음: club.jsx처럼 정적 JSX로 직접 작성 */}
          <div className="ml-auto flex gap-2.5 max-[620px]:ml-0">
            <Button mode="default" variant="outline" className={DARK_OUTLINE}>
              {ICON_AWARD}
              명예의 전당
            </Button>
            {/* 알림 버튼 임시 비활성화
            <Button mode="default" variant="red">
              {ICON_BELL}
              구단 소식 받기
            </Button>
            */}
          </div>
        </div>
      </Shell>
    </section>
  );
}
