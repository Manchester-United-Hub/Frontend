/** 다크 배경 위 outline 버튼 override — Hero 영역(HeroSection·FeaturedMatchPanel) 공용 */
export const DARK_OUTLINE = 'bg-transparent text-white border-[#3f3f46]';

/**
 * 다크 히어로 위 StateBox(f_shared) 대비 교정 (R-4, M4).
 *
 * StateBox 내부는 `bg-muted`/`text-muted-foreground`를 하드코딩하는데, 이 두 유틸리티는
 * Tailwind `@theme inline`을 통해 각각 `--muted`/`--muted-foreground` CSS 커스텀
 * 프로퍼티를 그대로 참조한다(app/globals.css). f_shared 내부는 수정하지 않고(D-7 승인 밖),
 * 호출자 className(StateBox.tsx의 cn() 마지막 인자 병합)으로 이 두 값만 이 서브트리
 * 범위에서 재정의해 대비를 맞춘다.
 *
 * 값은 새 색을 만들지 않고 이 Hero 다크 팔레트에서 이미 반복 사용 중인 값을 그대로
 * 재사용한다 — `#27272a`는 FeaturedMatchPanel·FeaturedMatchPanelSkeleton의 border,
 * `#a1a1aa`는 HeroSection·FeaturedMatchPanel의 보조 텍스트와 각각 동일한 값이다.
 * (참고: colors.css의 `:root[data-theme='dark']` 블록도 --muted/--muted-foreground를
 * 같은 값(rgb(39,39,42)/rgb(161,161,170))으로 선언하지만, 그 블록은 --destructive도 함께
 * 다크 배경용 값(rgb(127,29,29))으로 바꿔 StateBox error variant의 아이콘(`text-destructive`)
 * 대비를 오히려 악화시킨다 — 그래서 `.dark` 클래스를 통째로 스코프하지 않고 이 두 프로퍼티만
 * 개별 재정의한다. "다크 배경 전용 muted 토큰"은 이 레포에 별도로 존재하지 않는다.)
 */
export const DARK_STATE_BOX =
  '[--muted:#27272a] [--muted-foreground:#a1a1aa] text-white';

/** StateBox를 감싸는 다크 셸 — FeaturedMatchPanelSkeleton과 동일 톤(border + footer-bg). */
export const DARK_STATE_SHELL =
  'rounded-xl border border-[#27272a] p-6 shadow-md';
