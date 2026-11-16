# 상태 관리

상태를 어디에 둘지에 대한 규칙은 이 문서에서만 정의한다. 다른 문서는 이 문서를 링크한다.

## 판단표

새 상태를 추가할 때 위에서부터 확인하고, 처음 해당하는 행을 따른다.

| 이 값은... | 둘 곳 | 작성법 |
| --- | --- | --- |
| 서버에서 온 데이터 | TanStack Query | [rendering](rendering.md#서버-데이터-조회-방식), [query](../convention/query.md) |
| 한 컴포넌트 안에서만 씀 | `useState` | — |
| 여러 컴포넌트가 함께 쓰는 UI 상태 (필터, 페이지, 뷰 전환) | 커스텀 훅 (`d_features/[domain]/model/useXxx`) | 예: `usePlayerListFilters`, `useMatchFilters` |
| props로 3단계 이상 전달됨 | Context API (또는 적합한 상태 라이브러리를 제안) | — |

- 지금은 전역 상태 라이브러리를 쓰지 않는다.
- 파생값은 상태로 두지 않고 렌더 중에 계산한다. (예: `usePlayerListFilters`의 `results`, `pageResults`)
- 필터·페이지를 URL `searchParams`에 둘지는 미정이다. 지금은 새로고침하면 초기화된다.
