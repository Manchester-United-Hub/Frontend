type BuiltinCacheProfile =
  | 'default'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'max';

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
