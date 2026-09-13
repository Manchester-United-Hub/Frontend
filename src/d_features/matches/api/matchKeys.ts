/**
 * 파라미터 없는 상수 키(D-7·D-10) — 클라이언트는 season을 모르므로 키에 파라미터가 들어갈
 * 여지 자체를 없앤다. 서버(matchServerQueries)·클라이언트(matchQueries)가 이 키를 그대로
 * 공유해야 SSR prefetch로 dehydrate된 데이터를 CSR hydrate가 재사용한다.
 */
const matchKeys = {
  all: ['matches'] as const,
  landing: () => [...matchKeys.all, 'landing'] as const,
};

export { matchKeys };
