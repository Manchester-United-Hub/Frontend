// app/highlights/page.tsx의 revalidate(300)와 같은 수명이어야 hydrate된 데이터를 바로 재조회하지 않는다.
const HIGHLIGHT_LIST_STALE_TIME_MS = 300_000;

// 서버 prefetch와 클라이언트 조회가 같은 queryKey를 써야 하므로 페이지 크기를 한 곳에서 정한다. 3열 그리드 3줄.
const HIGHLIGHT_LIST_PAGE_SIZE = 9;

export { HIGHLIGHT_LIST_STALE_TIME_MS, HIGHLIGHT_LIST_PAGE_SIZE };
