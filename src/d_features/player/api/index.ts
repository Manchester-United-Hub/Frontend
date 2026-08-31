export * from './playerKeys';
export * from './playerQueries';
export * from './rosterListQuery';
export * from './usePlayerList';
export * from './usePlayerProfile';
export * from './usePlayerStatistics';

// getPlayerRoster·playerServerQueries는 의도적으로 재노출하지 않는다 — 실 백엔드 origin을
// 호출하는 server-only 코드('use cache'·next/cache)가 클라이언트 훅 배럴을 통해 브라우저
// 청크에 섞이는 것을 막는다(news·rank/seasonInfo 엔티티와 동일, AD-1/S-6). 소비는
// app/players/page.tsx가 '@features/player/api/playerServerQueries' 딥 경로로 직접 import한다.
