# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# 프로젝트: Manchester United Hub (manu-hub)

> 팬이 만든 맨체스터 유나이티드 정보 허브(시즌·경기·선수·구단·기사·하이라이트). 위 행동지침에 더해 이 프로젝트의 도메인·아키텍처·컨벤션을 따른다.

## 기술 스택

- Next.js 16 (App Router) · React 19 · TypeScript(strict, `any` 금지)
- 스타일: Tailwind CSS v4 + class-variance-authority(CVA) + clsx + tailwind-merge(`cn`)
- **UI 인터랙션: @headlessui/react** — 드롭다운·콤보박스·모달·탭·디스클로저 등 동작이 있는 UI는 **Headless UI 기반으로 구현한다(기본 원칙)**. 직접 DOM/상태로 키보드·포커스·ARIA를 재구현하지 않는다.
- **아이콘: lucide-react** — 모든 아이콘은 lucide-react를 사용한다. 컴포넌트에서 직접 import(`import { Search } from 'lucide-react'`)해 Next의 import 최적화(트리셰이킹)를 활용한다. 별도 배럴로 감싸지 않는다.
- 데이터: @tanstack/react-query · zod
- 테스트: vitest + @testing-library/react

## 아키텍처 — FSD (Feature-Sliced Design)

레이어(의존 방향: **위 → 아래만** 허용):

`b_pages` → `c_widgets` → `d_features` → `e_entities` → `f_shared`

- 상위 레이어만 하위를 import한다. **하위는 상위를 import하지 않는다.** 특히 `f_shared`는 어떤 상위 레이어도 import 금지.
- 경로 별칭: `@app`(app) · `@pages`(b_pages) · `@widgets`(c_widgets) · `@features`(d_features) · `@entities`(e_entities) · `@shared`(f_shared) · `@test`(test)

## 공통 UI 컴포넌트 (`f_shared/ui`)

- 폴더 단위: `f_shared/ui/{Name}/{Name}.tsx` + `index.ts` 배럴. 최상위 `f_shared/ui/index.ts`에서 재노출 → 소비는 `@shared/ui`.
- variant는 CVA로 정의, `className`은 `cn()`의 **마지막 인자**로 받아 호출자 우선 병합.
- **아이콘 디커플링**: 호출자가 주입하는 아이콘은 `icon?: ReactNode` 슬롯으로 받는다(컴포넌트가 특정 아이콘에 고정되지 않게). 컴포넌트 본질적 글리프는 lucide-react를 직접 사용.
- 디자인 토큰: `f_shared/ui/tokens/{colors,typography}.css` → `app/globals.css`의 `@theme inline`으로 Tailwind에 노출(`bg-united-red`·`text-muted-foreground`·`bg-win/draw/loss` 등). **raw hex 금지, 토큰 사용.**
- 모션: hover·애니메이션은 `motion-safe:`로 `prefers-reduced-motion`을 존중한다.
- 표현형 컴포넌트(카드 등)는 도메인 타입(`e_entities`)을 import하지 않고 **자체 props 인터페이스**로 데이터를 받는다.

## 코드 작성 컨벤션

### 함수 선언 형태

- 유틸·API·훅: **화살표 함수** (`const useX = () => …`)
- 순수 로직 함수: **화살표 함수**
- 컴포넌트: **함수 선언** (`function Navbar() { … }`)

### 함수 분리 기준

- **응집도·결합도** 기준으로 나눈다. 함께 바뀌는 것은 모으고, 관심사가 다르면 분리.
- **최대한 순수 함수** 형태(입력→출력, 부수효과 없음).
- 한 함수는 **하나의 관심사**만 다룬다.

### 컴포넌트 내부

- **인라인 핸들러 금지**: `onChange`·`onSubmit`·`onClick` 등에 화살표를 JSX에 직접 쓰지 말고 named 함수로 추출해 전달한다.
- **Props Drilling 3단 이상**이면 Context API 등 전역 상태 관리로 전환을 제시한다(적합한 라이브러리가 있으면 사용).
- **렌더링 최소화**: `useMemo`·`useCallback`·`React.memo`를 적절히 사용한다.

### 클린 코드 원칙

> 기반: [clean-code-typescript](https://738.github.io/clean-code-typescript/)

- **단일 책임(SRP)**: 하나의 함수·클래스는 하나의 작업만 수행한다.
- **의도 드러내는 이름**: 축약하지 말고 명확한 명사(`userAge`·`totalPrice`). 함수는 동작이므로 동사형(`getUser`·`calculateTotal`).
- **불필요한 주석 금지**: 코드가 스스로 목적을 설명한다. 의미 없는 주석은 쓰지 않는다.
- **매개변수 3개 이하**: 4개 이상이면 객체로 묶어 전달한다.
- **매직 넘버·문자열 제거**: 상수로 선언한다.
- **조기 리턴**: 깊은 `if` 중첩 대신 조건 불충족 시 즉시 `return`해 코드를 평평하게 유지한다.

## 테스트

- 위치: `test/`가 `src/` 구조를 미러링(`test/f_shared/ui/...`). 콜로케이션 아님.
- vitest globals 미사용 → `describe/it/expect`를 `vitest`에서 명시 import. 컴포넌트 테스트는 파일에서 `@testing-library/jest-dom/vitest`를 import해 matcher 등록.
- 컴포넌트별 렌더·variant·접근성(role·aria)·엣지 케이스를 커버한다.

## 커밋

- `commit-message-generator` 스킬 형식을 따른다: 헤더 `타입: 영어 소문자 설명 #이슈번호`(50자 이내), 바디 한글 `## 설명` / `## 추가 내용` / `## 변경 내용` / `## 관련 이슈`.
- **원자적 커밋**(하나의 논리 변경). husky commit-msg 컨벤션 검사를 통과해야 한다.

## 검증 명령

- 타입: `pnpm exec tsc --noEmit`
- 린트: `pnpm exec eslint <경로>`
- 테스트: `pnpm test` (vitest)
