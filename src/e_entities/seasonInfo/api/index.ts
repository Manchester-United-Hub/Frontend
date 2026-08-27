export * from './client';

// server 세그먼트는 의도적으로 재노출하지 않는다 — 실 백엔드 origin을 호출하는 server-only
// 코드가 클라이언트 배럴을 통해 브라우저 청크에 섞이는 것을 막는다(rank 엔티티와 동일).
