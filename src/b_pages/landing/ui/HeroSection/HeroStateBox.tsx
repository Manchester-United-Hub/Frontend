import { cloneElement, type ReactElement } from 'react';

import type { StateBoxProps } from '@shared/ui';

import { DARK_STATE_BOX, DARK_STATE_SHELL } from './styles';

export interface HeroStateBoxProps {
  /**
   * landing/ui/matchStates.tsx의 StateBox 상수(NEXT_MATCH_EMPTY_BOX·ERROR_BOX). 그 상수는
   * MatchStripSection(라이트 배경)과 공유되는 라이트 톤 기본값이라 여기서 직접 수정하지
   * 않고 cloneElement로 이 컴포넌트 범위에서만 className·headingLevel을 덧씌운다.
   */
  box: ReactElement<StateBoxProps>;
}

/**
 * Hero(다크 배경, `var(--surface-hero)`) 전용 StateBox 래퍼 (R-4, M4 + L7).
 *
 * - `FeaturedMatchPanelSkeleton`과 같은 다크 셸(border + `var(--footer-bg)`)로 감싸,
 *   로딩→empty/error 전환 시 패널 자리가 빈 공간처럼 보이지 않게 한다.
 * - StateBox(f_shared) 내부는 수정하지 않는다(D-7 승인 밖) — `className`으로
 *   `--muted`/`--muted-foreground`만 이 서브트리 범위에서 재정의해 WCAG AA 대비를 맞춘다
 *   (근거는 `styles.ts`의 `DARK_STATE_BOX` 주석 참조).
 * - `headingLevel={2}`로 지정해 Hero의 유일한 `h1`(`#hero-heading`) 바로 아래 단계를
 *   맞춘다(기존 기본값 h4는 h1→h4 스킵이었다, L7).
 */
export function HeroStateBox({ box }: HeroStateBoxProps) {
  return (
    <div className={DARK_STATE_SHELL} style={{ backgroundColor: 'var(--footer-bg)' }}>
      {cloneElement(box, { className: DARK_STATE_BOX, headingLevel: 2 })}
    </div>
  );
}
