export * from './newsKeys';
export * from './newsInfiniteQueryOptions';
export * from './newsQueries';
export * from './useNewsInfiniteList';

// newsServerQueries는 의도적으로 재노출하지 않는다 — 실 백엔드 origin을 호출하는
// server-only 코드가 클라이언트 훅 배럴을 통해 브라우저 청크에 섞이는 것을 막는다(AD-1/S-6).
// 소비는 src/app/news/page.tsx가 '@features/news/api/newsServerQueries' 딥 경로로 직접 import한다.
