---
name: generate-docs
description: Use when the user asks to generate documentation, add comments, write JSDoc/TSDoc, create a README, or document functions, components, or types.
---

# Generate Docs

Analyze code and produce accurate, minimal documentation — TSDoc comments, README sections, or prop tables — without inventing behavior.

## When to Use

- "문서 작성해줘", "docs 만들어줘", "주석 추가해줘"
- "JSDoc 써줘", "TSDoc 추가해줘"
- "README 만들어줘", "컴포넌트 문서화해줘"
- "이 함수 설명해줘 (문서 형태로)"

**Don't document:** trivial getters/setters, self-explanatory one-liners, or internal-only code unless asked.

## Documentation Types

### TSDoc — Functions & Types
Use for exported functions, hooks, and complex types.

```ts
/**
 * 사용자 인증 토큰을 검증하고 페이로드를 반환합니다.
 *
 * @param token - JWT 액세스 토큰
 * @returns 디코딩된 페이로드, 유효하지 않으면 `null`
 * @throws {TokenExpiredError} 토큰이 만료된 경우
 */
export function verifyToken(token: string): Payload | null {}
```

### React Component Props
Use JSDoc on the props interface, not on the component itself.

```ts
interface ButtonProps {
  /** 버튼 라벨 텍스트 */
  label: string;
  /** 클릭 핸들러. 비동기 가능 */
  onClick: () => void | Promise<void>;
  /** 비활성화 여부 (기본값: false) */
  disabled?: boolean;
}
```

### README Section
Use when asked to document a module, feature, or whole project.

```markdown
## 기능명

한 문장 설명.

### 사용법

\`\`\`ts
// 최소 동작 예시
\`\`\`

### 주요 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
```

## Authoring Process

1. **읽기**: 대상 파일 전체를 읽고 실제 동작을 파악합니다.
2. **범위 결정**: 어떤 exports/props/hooks에 문서가 없는지 확인합니다.
3. **유형 선택**: 아래 참고 자료에서 맞는 템플릿을 선택합니다.
4. **작성**: 코드에서 직접 읽을 수 있는 내용만 씁니다. 추측하지 않습니다.
5. **검토**: 문서가 구현과 일치하는지 재확인합니다.

## Rules

- **한국어 설명**, 코드 식별자는 영어 그대로 유지
- 패키지 매니저는 **pnpm** 으로 통일 (`npm`, `yarn` 사용 금지)
- 타입이 이미 명확한 것은 중복 설명하지 않음 (`string` 타입에 "문자열" 설명 불필요)
- `@param`/`@returns` 설명은 타입 없이 작성 (TypeScript가 이미 표현)
- 없는 동작, 추측 사이드 이펙트, 미래 계획 작성 금지
- 존재하지 않는 파일에 README 생성 금지 — 먼저 대상 코드를 확인

## Common Mistakes

| 실수 | 올바른 방법 |
|------|------------|
| 타입 정보 중복 작성 | `@param token {string}` → `@param token` |
| 추측으로 설명 작성 | 코드 읽고 실제 동작만 기술 |
| 모든 함수에 JSDoc 추가 | export된 public API 위주로 작성 |
| 영어/한국어 혼용 설명 | 설명은 한국어, 식별자는 영어 |
| `npm run` 사용 | `pnpm` 으로 통일 |

## Reference Files

요청 유형에 따라 해당 참고 파일을 읽어 템플릿과 규칙을 적용합니다.

- **`references/code-execution.md`** — pnpm 스크립트, Docker, GitHub Actions 문서화 형식
- **`references/service-description.md`** — API Route, Hook, 유틸리티 서비스 문서화 형식
- **`references/architecture.md`** — 디렉토리 구조, 데이터 흐름, 배포 아키텍처 문서화 형식
