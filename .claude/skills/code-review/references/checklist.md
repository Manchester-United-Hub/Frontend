# Code Review Checklist

Apply each section to the files in scope. Skip sections that are irrelevant to the change.

---

## Correctness

- [ ] Logic matches the stated intent (commit message, PR description, issue)
- [ ] Edge cases handled: empty arrays, null/undefined, zero, negative numbers
- [ ] Async operations awaited; Promise rejections caught or propagated
- [ ] No race conditions in concurrent state updates (React: stale closures, batching)
- [ ] Conditional branches are exhaustive — no unhandled case that silently does nothing
- [ ] Data mutated only where mutation is intended; no unintended aliasing
- [ ] Return values checked where the caller must act on them

---

## Security

### General
- [ ] No secrets, tokens, or credentials in source code or committed files
- [ ] User input sanitized before use in: SQL queries, shell commands, file paths, HTML
- [ ] No path traversal risk (`../` in user-supplied paths)
- [ ] Dependencies added are widely used, maintained, and not known-malicious

### Next.js / React
- [ ] `dangerouslySetInnerHTML` not introduced; if present, source is trusted and sanitized
- [ ] `eval()` / `new Function()` not used
- [ ] Server Actions validate and authenticate caller before mutating data
- [ ] API routes check authentication/authorization before returning sensitive data
- [ ] `NEXT_PUBLIC_` env vars contain no secrets (they are bundled into client JS)
- [ ] Server-only env vars (API keys, DB credentials) never passed to Client Components as props

### Docker / CI
- [ ] No secrets hardcoded in `Dockerfile` or GitHub Actions YAML
- [ ] `ARG` / `ENV` in Dockerfile that carry secrets are not in final image layer
- [ ] GitHub Actions secrets referenced as `${{ secrets.NAME }}` not interpolated into `run:` as plain strings (injection risk)

---

## Performance

- [ ] No N+1 queries or fetch loops inside render / request handlers
- [ ] Large datasets paginated or streamed, not loaded into memory at once
- [ ] Heavy computations memoized (`useMemo`, `useCallback`) only where re-render cost is real
- [ ] Images use `next/image` with explicit `width`/`height` or `fill`
- [ ] Fonts loaded via `next/font`, not manual `<link>` tags
- [ ] Dynamic imports (`next/dynamic`) used for large client-only components
- [ ] No blocking synchronous `fs` / `child_process` calls in request paths

---

## Maintainability

- [ ] Names (variables, functions, components) clearly describe what they are/do
- [ ] No dead code, commented-out blocks, or unused imports
- [ ] Functions are focused — one responsibility, short enough to understand at a glance
- [ ] Complex logic has a single non-obvious comment explaining *why*, not *what*
- [ ] Magic numbers extracted to named constants
- [ ] No duplication that would require two updates to fix one bug

---

## TypeScript

- [ ] No untyped `any` without a comment explaining why it's unavoidable
- [ ] `as` casts justified — not used to silence an error without understanding it
- [ ] Non-null assertions (`!`) justified — not used to silence "possibly undefined"
- [ ] Props interfaces / types defined for all components
- [ ] Return types declared for exported functions and API handlers
- [ ] `unknown` used instead of `any` for truly unknown external data, then narrowed

---

## React / Next.js Patterns

- [ ] Client Components (`"use client"`) used only when browser APIs or hooks are needed
- [ ] No async/await inside `useEffect` without cleanup (memory leak risk)
- [ ] `key` props on list items are stable unique IDs, not array indexes
- [ ] Forms use controlled inputs or a form library — no mixing
- [ ] Error boundaries / `error.tsx` files present for routes that can fail
- [ ] `loading.tsx` / Suspense boundaries for async Server Components
- [ ] Route handlers in `app/api/` follow the `export async function GET/POST/...` convention

---

## Style & Conventions

- [ ] ESLint passes with no new warnings suppressed without explanation
- [ ] Prettier formatting consistent (enforced by pre-push hook, but verify in diff)
- [ ] Tailwind class ordering follows project convention (e.g., `prettier-plugin-tailwindcss`)
- [ ] File names: components PascalCase, utilities/hooks camelCase, routes kebab-case
- [ ] Commit message follows Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)

---

## Tests (if applicable)

- [ ] New behavior covered by tests
- [ ] Tests test behavior, not implementation details
- [ ] No tests skipped (`skip`, `only`, `xit`) left behind accidentally
- [ ] Test file lives next to source file or in `__tests__/` following project convention

---

## 프론트엔드 코드 품질

좋은 프론트엔드 코드는 **변경하기 쉬운** 코드. 아래 기준으로 추가 검토.

### 가독성 (Readability)

- [ ] 같이 실행되지 않는 코드가 한 함수/컴포넌트에 섞여 있지 않은지
- [ ] 구현 상세가 적절히 추상화되어 있는지 (함수명만 보고 역할을 이해할 수 있는지)
- [ ] 복잡한 조건식에 의미 있는 이름이 붙어 있는지 (`isEligible`, `hasPermission` 등)
- [ ] 코드가 위에서 아래로 자연스럽게 읽히는지 (시점 이동 최소화)
- [ ] 삼항 연산자가 중첩되거나 복잡하지 않은지
- [ ] 비교 조건이 왼쪽에서 오른쪽으로 자연스럽게 읽히는지 (`user.age >= 18`, not `18 <= user.age`)

### 예측 가능성 (Predictability)

- [ ] 이름이 다른 스코프의 변수/함수와 겹쳐 혼란을 주지 않는지 (shadowing 주의)
- [ ] 같은 종류의 함수/훅은 반환 타입이 일관되는지
- [ ] 숨은 로직 없음 — 함수가 이름과 다른 부수 효과를 일으키지 않는지

### 응집도 (Cohesion)

- [ ] 함께 수정되는 파일들이 같은 디렉토리/모듈에 있는지
- [ ] 폼 필드 정의, 유효성 검사, 초기값이 분산되지 않고 한 곳에 응집되어 있는지

### 결합도 (Coupling)

- [ ] 컴포넌트가 하나의 책임만 가지는지 (상태 관리 + UI + API 호출이 한 곳에 섞이지 않는지)
- [ ] Props Drilling 없음 — 3단계 이상 props가 내려가면 Context 또는 컴포넌트 분리 고려
- [ ] 트레이드오프: 응집도가 깨질 위험이 있다면 중복 코드를 허용하는 것이 나을 수 있음
