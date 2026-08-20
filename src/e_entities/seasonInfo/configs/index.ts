// 서버 전용. 클라이언트 모듈에서 import 금지.
// S-10 매직값 상수화 + decision-1.md §5(ST-04) 신규 지정.

// Next 16.2.4 내장 cacheLife 프로파일 이름 전체 집합
// (출처: node_modules/next/dist/server/config-shared.js:136-172).
// cacheLife의 인자 타입은 `CacheLifeProfiles | (string & {})`이라 임의 문자열도 tsc를
// 통과한다. 이 유니온 + satisfies가 그 탈출구를 호출부에서 막는다(decision-2 §2.1).
// next.config.ts에 커스텀 프로파일을 추가하면 이름을 여기에도 추가한다 — 누락 시
// 런타임 폭발이 아니라 컴파일 에러로 드러난다.
type BuiltinCacheProfile =
  | 'default'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'max';

// 'hours' = stale 300s / revalidate 3600s / expire 86400s → 요구사항 3의 "ISR 1h".
// as const satisfies: 리터럴 타입을 유지하면서 집합 membership만 검사한다.
const SEASON_CACHE_PROFILE = 'hours' as const satisfies BuiltinCacheProfile;

// 시즌 조회 실패 시 폴백 시즌 시작연도 (A-8 — app/season/page.tsx 인라인 로직에서 이관됨).
const FALLBACK_SEASON_START_YEAR = 2026;

// 시즌 조회 실패 시 폴백 진행 상태 (미개막으로 간주).
const FALLBACK_SEASON_STARTED = false;

// S-3c 복구 경로(read{X}Fresh) 진입 시 남기는 고정 접두사 경고 로그. R-3b의 유일한 관측 훅.
const RECOVERY_LOG_PREFIX = '[season-cache-recovery]';

// 조회는 성공했으나 DTO→DAO 변환이 실패한 경우의 접두사(decision-2 §3).
// RECOVERY_LOG_PREFIX("캐시 계층 고장" 신호, R-3b)와 반드시 구분한다.
const CONVERT_LOG_PREFIX = '[season-data-convert]';

export {
  SEASON_CACHE_PROFILE,
  FALLBACK_SEASON_START_YEAR,
  FALLBACK_SEASON_STARTED,
  RECOVERY_LOG_PREFIX,
  CONVERT_LOG_PREFIX,
};
