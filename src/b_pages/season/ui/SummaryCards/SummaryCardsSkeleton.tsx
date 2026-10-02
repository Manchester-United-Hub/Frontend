import { Fragment } from 'react';

import { Card, Shell, Skeleton } from '@shared/ui';

const SKELETON_ARIA_LABEL = '시즌 요약 정보를 불러오는 중';
const SKELETON_CARD_COUNT = 4;

/**
 * SummaryCard 자리표시자 1장 — 아이콘 38x38 정사각 + 라벨/값/보조텍스트 3줄
 * 구조를 Skeleton 블록으로 흉내낸다(MatchesSkeleton·StandingSkeleton과 동일하게
 * 정적이므로 모듈 스코프 상수로 호이스팅 — code-conventions §6).
 * Card padding="md"를 그대로 소비해 실제 카드와 padding이 어긋나지 않게 한다(S-12).
 */
const SKEL_CARD = (
  <li>
    <Card padding="md" className="flex items-start gap-3">
      <Skeleton className="h-[38px] w-[38px] flex-none rounded-md" />
      {/*
        슬롯 높이(26 / 20.69 / 16px)는 SummaryCard의 실제 line box를 CDP(playwright
        chromium, getBoundingClientRect 좌표 차)로 실측한 값이다(decision-3 §3.1,
        측정일 2026-08-16, 폭 375/800/1280 동일값 — 줄바꿈 없음).
        계산값이 아니다 — BilingualLabel이 inline-flex라 라벨줄의 line box는
        text-[11px]의 상속 line-height(24px)와 일치하지 않는다(실측 26px).
        막대(h-3/h-4/h-3)는 시각 요소이고 레이아웃은 슬롯이 잡는다.
        ⚠️ SummaryCard의 타이포 클래스를 바꾸면 이 값들이 조용히 거짓이 된다 —
        자동 게이트가 없다(F-16: 치수 단일 출처화).
      */}
      <div className="flex-1">
        <div className="flex h-[26px] items-center">
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="mt-[3px] flex h-[20.69px] items-center">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-[3px] flex h-4 items-center">
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Card>
  </li>
);

/**
 * SummaryCardsSkeleton — SummaryPanel(Suspense) 로딩 상태. SummaryCards.tsx의
 * ul 그리드 클래스를 그대로 복사해 데이터 도착 시 레이아웃이 튀지 않게 한다(S2-5).
 * role="status" aria-live="polite"로 로딩 중임을 알리고, 실제로 읽힐 텍스트(sr-only)를
 * 안에 둔다 — aria-label은 영역의 "이름"일 뿐 live region 알림의 "내용"이 아니다.
 * 시각적 자리표시자는 aria-hidden 래퍼로 감싸 접근성 트리에서 제외한다.
 */
export function SummaryCardsSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label={SKELETON_ARIA_LABEL}>
      <span className="sr-only">{SKELETON_ARIA_LABEL}</span>
      <div aria-hidden>
        <Shell>
          <ul
            role="list"
            className="grid grid-cols-1 gap-3.5 pb-2 pt-7 min-[620px]:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
              <Fragment key={index}>{SKEL_CARD}</Fragment>
            ))}
          </ul>
        </Shell>
      </div>
    </div>
  );
}
