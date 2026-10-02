'use client';

/**
 * useRosterPageSize — 뷰포트 폭에 따라 한 페이지에 노출할 선수 카드 수를 반환한다(A-2/A-8).
 *
 * 브레이크포인트(1100·980)와 페이지 크기(10·8·6)는 이 모듈 상수 한 곳에만 둔다(S-11).
 * 훅과 RosterGrid는 같은 `min-width` 경계를 쓴다. 둘 중 하나만 `max-[]`/`max-width`로
 * 되돌리면 경계 1px에서 잘린 행이 생긴다(D-11). Tailwind v4는 `max-[Npx]`를
 * `not all and (min-width:Npx)`로 컴파일해 N을 배제하는데, JS `(max-width: Npx)`는 N을
 * 포함해 정확히 그 1px에서 어긋났다 — 그래서 양쪽을 `min-width`(둘 다 N을 포함) 문법으로
 * 통일한다(decision-1.md).
 *
 * useSyncExternalStore의 getSnapshot은 매 호출 동일 참조를 반환해야 한다. number는 primitive라
 * 이 요구를 자동 충족한다(S-12) — 객체·배열을 반환하면 매 렌더마다 새 참조가 생겨 무한 렌더
 * 루프가 난다.
 *
 * getServerSnapshot은 DESKTOP_ROSTER_PAGE_SIZE(10)를 반환한다(A-2 — revision 1의 6에서
 * 반전됐다). 서버가 실제 카드를 prefetch+hydration으로 렌더하게 되면서, 서버 스냅샷 값이
 * 첫 페인트에 보이는 카드 수를 직접 결정한다. 10을 쓰면 전이가 없는 구간이 PC가 되고,
 * 태블릿·모바일에서는 뒤쪽 잘라내기만 일어난다(자세한 근거는 plan.json A-2).
 */

import { useSyncExternalStore } from 'react';

const TABLET_MIN_WIDTH_PX = 980;
const DESKTOP_MIN_WIDTH_PX = 1100;

const MOBILE_ROSTER_PAGE_SIZE = 6;
const TABLET_ROSTER_PAGE_SIZE = 8;
const DESKTOP_ROSTER_PAGE_SIZE = 10;

const TABLET_QUERY = `(min-width: ${TABLET_MIN_WIDTH_PX}px)`;
const DESKTOP_QUERY = `(min-width: ${DESKTOP_MIN_WIDTH_PX}px)`;

const getSnapshot = (): number => {
  if (window.matchMedia(DESKTOP_QUERY).matches) return DESKTOP_ROSTER_PAGE_SIZE;
  if (window.matchMedia(TABLET_QUERY).matches) return TABLET_ROSTER_PAGE_SIZE;
  return MOBILE_ROSTER_PAGE_SIZE;
};

const getServerSnapshot = (): number => DESKTOP_ROSTER_PAGE_SIZE;

const subscribe = (onStoreChange: () => void): (() => void) => {
  const tabletQuery = window.matchMedia(TABLET_QUERY);
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);

  tabletQuery.addEventListener('change', onStoreChange);
  desktopQuery.addEventListener('change', onStoreChange);

  return () => {
    tabletQuery.removeEventListener('change', onStoreChange);
    desktopQuery.removeEventListener('change', onStoreChange);
  };
};

const useRosterPageSize = (): number =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export { useRosterPageSize };
