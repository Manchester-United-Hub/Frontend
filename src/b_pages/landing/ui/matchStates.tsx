import { AlertTriangle, Inbox } from 'lucide-react';

import { StateBox } from '@shared/ui';

/**
 * 랜딩 매치 상태 박스 상수 — HeroSection(FeaturedMatchContainer)과 MatchStripSection이
 * 공유한다(High-1 재작업, D-11). 같은 사실("다음 경기가 없다" 등)은 두 섹션이 같은 문구로
 * 말한다 — 신규 마크업 없이 기존 StateBox(@shared/ui)만 조합한다.
 *
 * ⚠️ Hero(다크 배경) 전용 시각 교정(className·headingLevel)은 R-4(ui-developer)가 후행으로
 * 이 파일 또는 FeaturedMatchContainer.tsx에서 처리한다 — 여기서는 손대지 않는다.
 */

/** 스트립의 next 슬롯 + Hero 패널 슬롯에서 next===null일 때 렌더. */
export const NEXT_MATCH_EMPTY_BOX = (
  <StateBox
    variant="empty"
    icon={<Inbox size={22} aria-hidden />}
    title="다음 경기 일정이 아직 없어요"
    description="다음 일정이 확정되면 여기에 표시됩니다."
  />
);

/** 스트립의 recent 슬롯에서 recent===null일 때 렌더(개막 전). */
export const RECENT_MATCH_EMPTY_BOX = (
  <StateBox
    variant="empty"
    icon={<Inbox size={22} aria-hidden />}
    title="최근 경기 기록이 없어요"
    description="시즌 개막 전이라 아직 기록이 없어요."
  />
);

/** 스트립 status='empty'(recent·next 둘 다 null)일 때 렌더. */
export const MATCHES_EMPTY_BOX = (
  <StateBox
    variant="empty"
    icon={<Inbox size={22} aria-hidden />}
    title="예정된 경기가 없어요"
    description="시즌 휴식기입니다. 일정이 확정되면 여기에 표시됩니다."
  />
);

/** 스트립·Hero 양쪽의 error 분기에서 렌더. */
export const ERROR_BOX = (
  <StateBox
    variant="error"
    icon={<AlertTriangle size={22} aria-hidden />}
    title="경기 정보를 불러오지 못했어요"
    description="일시적인 연결 문제입니다. 사용자 탓이 아니에요 — 잠시 후 다시 시도해 주세요."
  />
);
