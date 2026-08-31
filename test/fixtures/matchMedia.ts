/**
 * window.matchMedia 테스트 픽스처(S-15) — jsdom에 matchMedia가 없어 뷰포트 시뮬레이션
 * 인프라를 신설한다. useRosterPageSize(및 이를 소비하는 모든 컴포넌트) 테스트가 이 파일
 * 하나만 쓴다 — 파일별로 window.matchMedia를 개별 스텁하지 않는다.
 *
 * 지원 범위: `(min-width: Npx)`·`(max-width: Npx)`를 파싱하고, 그 외 형태는 조용히 false를
 * 반환하지 않고 throw한다 — 인식 못 한 쿼리에 false를 반환하면 "모든 폭에서 데스크톱"이라는
 * 그럴듯한 오답을 만들 수 있기 때문이다(D-11, decision-1.md). `addEventListener`/
 * `removeEventListener('change', ...)`만 지원한다 — 레거시 `addListener`/`removeListener`
 * 폴백은 넣지 않는다(대상 브라우저가 표준 API를 지원한다는 전제, plan.json assumptions).
 *
 * 사용법:
 * - installMatchMedia(width)로 초기 뷰포트 폭을 설정하고 window.matchMedia를 스텁한다.
 * - setViewportWidth(width)로 폭을 바꾸면 이미 등록된 리스너가 실제로 호출돼 런타임 전환을
 *   재현한다.
 * - 각 테스트 파일은 afterEach에서 restoreMatchMedia()로 원래 window.matchMedia를 복원한다.
 * - 같은 쿼리 문자열에 대한 MediaQueryList는 installMatchMedia 세션 동안 싱글턴으로 캐시된다 —
 *   테스트가 훅 내부와 동일한 인스턴스를 `window.matchMedia(query)`로 다시 얻어
 *   addEventListener/removeEventListener 호출 여부를 직접 검증할 수 있게 하기 위함이다.
 */

import { vi } from 'vitest';

type ChangeListener = (event: MediaQueryListEvent) => void;

const MIN_WIDTH_PATTERN = /\(min-width:\s*(\d+)px\)/;
const MAX_WIDTH_PATTERN = /\(max-width:\s*(\d+)px\)/;

let currentWidth = 0;
let queryListCache = new Map<string, MediaQueryList>();
let listenersByQuery = new Map<string, Set<ChangeListener>>();
let originalMatchMedia: typeof window.matchMedia | undefined;
let installed = false;

const matchesQuery = (query: string, width: number): boolean => {
  const min = MIN_WIDTH_PATTERN.exec(query);
  if (min?.[1]) return width >= Number(min[1]);

  const max = MAX_WIDTH_PATTERN.exec(query);
  if (max?.[1]) return width <= Number(max[1]);

  throw new Error(`지원하지 않는 미디어 쿼리다: ${query} (min-width/max-width만 파싱한다)`);
};

const createMediaQueryList = (query: string): MediaQueryList => {
  const addEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type !== 'change') return;
      const set = listenersByQuery.get(query) ?? new Set();
      set.add(listener as ChangeListener);
      listenersByQuery.set(query, set);
    },
  );

  const removeEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject) => {
      if (type !== 'change') return;
      listenersByQuery.get(query)?.delete(listener as ChangeListener);
    },
  );

  return {
    media: query,
    get matches() {
      return matchesQuery(query, currentWidth);
    },
    addEventListener,
    removeEventListener,
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
    onchange: null,
  } as unknown as MediaQueryList;
};

const getOrCreateMediaQueryList = (query: string): MediaQueryList => {
  const cached = queryListCache.get(query);
  if (cached) return cached;

  const created = createMediaQueryList(query);
  queryListCache.set(query, created);
  return created;
};

/** width의 초기 뷰포트로 window.matchMedia를 스텁한다. */
const installMatchMedia = (width: number): void => {
  currentWidth = width;
  queryListCache = new Map();
  listenersByQuery = new Map();
  originalMatchMedia = window.matchMedia;
  installed = true;

  window.matchMedia = ((query: string) =>
    getOrCreateMediaQueryList(query)) as typeof window.matchMedia;
};

/** 뷰포트 폭을 바꾸고, 등록된 모든 'change' 리스너를 실제로 호출해 전환을 재현한다. */
const setViewportWidth = (width: number): void => {
  if (!installed) {
    throw new Error('installMatchMedia를 먼저 호출해야 setViewportWidth를 쓸 수 있다.');
  }

  currentWidth = width;

  listenersByQuery.forEach((listeners, query) => {
    const event = {
      matches: matchesQuery(query, width),
      media: query,
    } as MediaQueryListEvent;

    listeners.forEach((listener) => listener(event));
  });
};

/** window.matchMedia를 원래 상태(jsdom 기본값 — 존재하지 않음)로 복원한다. */
const restoreMatchMedia = (): void => {
  if (originalMatchMedia) {
    window.matchMedia = originalMatchMedia;
  } else {
    delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia;
  }

  originalMatchMedia = undefined;
  queryListCache = new Map();
  listenersByQuery = new Map();
  installed = false;
};

export { installMatchMedia, setViewportWidth, restoreMatchMedia };
