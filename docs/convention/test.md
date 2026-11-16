# 테스트

## 도구

| 도구 | 용도 | 파일명 |
| --- | --- | --- |
| Vitest (jsdom) | 단위·훅·컴포넌트 테스트 | `*.test.ts(x)` |
| Testing Library (`react`, `user-event`, `jest-dom`) | 컴포넌트 렌더·인터랙션 | |
| `@vitest/coverage-v8` | 커버리지 | |
| E2E | 미정 | |

## 위치: `test/`가 `src/`를 미러링

콜로케이션하지 않는다. 미러 규칙은 두 형태다.

| src | test |
| --- | --- |
| `src/{path}/{Name}.{ts,tsx}` | `test/{path}/{Name}.test.{ts,tsx}` |
| 실체를 가진 배럴 `src/{path}/{Name}/index.ts` | `test/{path}/{Name}.test.ts` (디렉토리 이름으로 미러) |

```
src/f_shared/ui/FilterSelect/FilterSelect.tsx  →  test/f_shared/ui/FilterSelect/FilterSelect.test.tsx
src/f_shared/api/configs/index.ts              →  test/f_shared/api/configs.test.ts
```

- `index.test.ts` 패턴은 쓰지 않는다.
- 공용 fixture는 `test/fixtures/`에 둔다.

### 미러 대상이 아닌 파일

`configs.ts`, `types.ts`, `{slice}/configs/**`, `**/schemas/**`는 테스트를 새로 쓰지 않는다. 타입 선언·상수 테이블을 테스트하면 동어반복이 되고, 기대값을 만들려고 그 상수를 import하는 순간 상수 자체는 검증되지 않는다.

### 미러 정합성 검사

src가 없는 테스트(고아)를 찾는다.

```bash
find test -name '*.test.ts' -o -name '*.test.tsx' | while read t; do rel=${t#test/}; base=${rel%.test.ts}; base=${base%.test.tsx}; ok=0; for c in "src/$base.ts" "src/$base.tsx" "src/$base/index.ts" "src/$base/index.tsx"; do [ -f "$c" ] && ok=1 && break; done; [ $ok -eq 0 ] && echo "ORPHAN: $t"; done
```

## 작성 규칙

- vitest globals를 쓰지 않는다. `describe`·`it`·`expect`를 `vitest`에서 import한다.
- 컴포넌트 테스트는 파일에서 `@testing-library/jest-dom/vitest`를 import해 matcher를 등록한다.
- `describe`는 대상 이름, `it`은 한국어로 동작을 쓴다: `it('label과 선택된 값을 렌더한다')`
- 컴포넌트마다 렌더·variant·접근성(role·aria)·엣지 케이스를 다룬다.

```ts
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(cleanup);
```

## 컴포넌트 1 : 테스트 파일 1

- 한 테스트 파일이 여러 컴포넌트의 테스트 스위트를 소유하지 않는다.
- 피검체가 아닌 컴포넌트를 기대값 비교용(오라클)으로 렌더하는 것은 괜찮다. (예: `StandingSkeleton.test.tsx`가 `StandingsTable`을 렌더해 구조를 비교)

## 테스트를 약화시키지 않는다

- 단언 완화, 기대값을 실제 출력에 맞춰 덮어쓰기, 케이스 삭제로 통과시키지 않는다.
- 원인이 src에 있으면 src를 고친다.

## 커버리지

- `coverage.enabled: true`라 `pnpm test` 실행 시 함께 측정된다. 범위는 `src/**/*.{ts,tsx}`이다.
- 제외: `**/index.ts`, `configs/**`, `types/**`, `assets/**`, `**/*.schema.ts`, `**/schemas/**` (`vitest.config.ts`)
- 임계값은 미정이다.
