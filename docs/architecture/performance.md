# 성능

## 규칙

| 규칙 | 내용 |
| --- | --- |
| 이미지 | `next/image`를 쓴다. 외부 이미지 호스트는 `next.config.ts`의 `images.remotePatterns`에 등록한다 |
| 외부 이미지 호스트 | 와일드카드는 신뢰할 수 있는 도메인에만 쓴다. 공용 도메인(예: `*.r2.dev`)은 실제 호스트 하나만 정확히 등록한다 |
| 이미지 로딩 실패 | `handleImageError`로 기본 이미지로 1회만 교체한다 |
| 폰트 | `next/font`를 쓴다. Pretendard는 `next/font/local`로 `public/fonts/`에서 불러온다 |
| 첫 화면 데이터 | 서버에서 prefetch해 HTML에 포함한다 → [rendering](rendering.md#서버-데이터-조회-방식) |
| 서버 전용 코드 | 클라이언트 번들에 섞이지 않게 배럴에서 뺀다 → [folder-structure § 배럴](folder-structure.md#배럴-indexts) |

## 렌더링 최소화

- `useMemo`·`useCallback`·`React.memo`는 실제 비용이 있는 곳에만 쓴다. → [ui-component § 메모이제이션](../convention/ui-component.md#메모이제이션)

## 목표 지표 · 측정 도구

미정
