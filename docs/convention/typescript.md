# TypeScript

`tsconfig.json`은 `strict: true`다.

## 함수 선언 형태

| 대상 | 형태 | 예 |
| --- | --- | --- |
| 컴포넌트 | 함수 선언 | `function Navbar() { … }` |
| 훅 | 화살표 함수 | `const useNewsFeed = () => …` |
| 유틸·API·순수 로직 | 화살표 함수 | `const toMatchItem = (dto) => …` |
| 클래스가 꼭 필요한 경우 | 클래스 | `ErrorBoundary`, `Fetcher` |

- 컴포넌트 안의 헬퍼 함수도 화살표 함수로 쓴다.

## export

- 파일 끝에서 한 번에 export한다: `export { NewsPage };`, `export type { NewsItem };`
- 선언과 함께 export하지 않는다: `export const …` ✗, `export function …` ✗
- 예외: Next.js 특수 파일(`page.tsx` 등)의 `export default`, 라우트 세그먼트 설정(`export const revalidate`), Route Handler(`export async function GET`)

## 타입 안전

- `any`를 쓰지 않는다. `unknown`으로 받고 타입 가드·zod로 좁힌다.
- 서버 응답 타입은 직접 선언하지 않고 `z.infer<typeof XxxSchema>`로 만든다. → [data-flow](../architecture/data-flow.md#검증--변환)
- `as` 단언, `enum`, type/interface 선택 기준은 미정이다.

## 함수 인자

- 매개변수는 3개 이하로 둔다. 4개 이상이면 객체로 묶는다.
- 매직 넘버·문자열은 상수로 선언한다.
- 깊은 `if` 중첩 대신 조기 리턴한다.

현재 코드와 다른 부분은 [known-gaps](../known-gaps.md)에 있다.
