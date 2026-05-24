# Architecture Documentation

프로젝트 전체 구조, 컴포넌트 관계, 데이터 흐름을 문서화할 때의 형식과 규칙.

---

## 문서 구성 순서

1. **프로젝트 개요** — 기술 스택과 핵심 목적 한 문단
2. **디렉토리 구조** — 트리 형식, 주요 폴더만 주석 포함
3. **데이터 흐름** — 요청→처리→응답 순서
4. **주요 모듈 설명** — 각 레이어의 책임
5. **외부 의존성** — 연동 서비스, 인프라 목록
6. **환경별 차이** — dev / staging / prod 구성 차이 (있을 경우)

---

## 템플릿

### 기술 스택 테이블

```markdown
## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS 4 |
| 패키지 매니저 | pnpm |
| 인증 | NextAuth.js v5 |
| DB | PostgreSQL (Prisma ORM) |
| 배포 | AWS ECS (Fargate) + ECR |
| CI/CD | GitHub Actions |
```

### 디렉토리 구조

```markdown
## 디렉토리 구조

\`\`\`
src/
├── app/                  # Next.js App Router 페이지·레이아웃
│   ├── (auth)/           # 인증 필요 없는 라우트 그룹
│   ├── (dashboard)/      # 인증 필요한 라우트 그룹
│   └── api/              # Route Handlers (서버 API)
├── components/           # 공유 UI 컴포넌트
│   ├── ui/               # 원자 컴포넌트 (버튼, 인풋 등)
│   └── features/         # 도메인별 복합 컴포넌트
├── lib/                  # 서버 전용 유틸리티·서비스
│   ├── db.ts             # Prisma 클라이언트 싱글턴
│   └── auth.ts           # NextAuth 설정
├── hooks/                # 클라이언트 전용 커스텀 훅
├── types/                # 전역 TypeScript 타입 정의
└── styles/               # 전역 CSS (Tailwind 기본 레이어)
\`\`\`
```

### 데이터 흐름

```markdown
## 요청 흐름

### 페이지 요청 (Server Component)

\`\`\`
브라우저 → Next.js Server → [미들웨어: 인증 확인]
  → Server Component (데이터 fetch)
  → Prisma → PostgreSQL
  → HTML 스트리밍 응답
\`\`\`

### API 요청 (Route Handler)

\`\`\`
클라이언트 → POST /api/... → 인증 세션 확인
  → 요청 검증 (Zod)
  → 비즈니스 로직
  → DB 쿼리 (Prisma)
  → JSON 응답
\`\`\`
```

### 레이어 책임 테이블

```markdown
## 레이어 책임

| 레이어 | 위치 | 책임 |
|--------|------|------|
| **Pages** | `app/**/page.tsx` | 라우팅, 레이아웃, 데이터 fetch 진입점 |
| **Components** | `components/` | UI 렌더링, 사용자 인터랙션 |
| **Hooks** | `hooks/` | 클라이언트 상태·사이드이펙트 캡슐화 |
| **Services** | `lib/` | 비즈니스 로직, 외부 API 연동 |
| **DB** | `lib/db.ts` | 데이터 접근, 트랜잭션 |
| **Types** | `types/` | 공유 타입, DTO 정의 |
```

### 배포 아키텍처

```markdown
## 인프라 구성

\`\`\`
GitHub Actions (CI/CD)
  └── docker build → ECR (이미지 레지스트리)
        └── ECS Fargate (컨테이너 실행)
              ├── ALB (로드 밸런서, HTTPS)
              └── RDS PostgreSQL (데이터베이스)
\`\`\`

| 환경 | 브랜치 | 트리거 |
|------|--------|--------|
| Production | `main` | PR merge |
| Staging | `develop` | PR merge |
```

### 외부 의존성

```markdown
## 외부 서비스

| 서비스 | 용도 | 환경 변수 |
|--------|------|-----------|
| AWS ECR | 컨테이너 이미지 저장 | `AWS_ACCESS_KEY_ID`, `AWS_REGION` |
| AWS ECS | 컨테이너 실행 | `ECR_REPOSITORY` |
| Sentry | 에러 모니터링 | `SENTRY_DSN` |
```

---

## 브랜치 전략

```markdown
## 브랜치 구조

| 브랜치 | 용도 | 네이밍 |
|--------|------|--------|
| `main` | 프로덕션 배포 | - |
| `develop` | 스테이징 통합 | - |
| `feature/*` | 새 기능 개발 | `feature/작업_내용` |
| `fix/*` | 버그 수정 | `fix/수정_내용` |

**PR 제목 형식:** `[FE/feature] 작업 내용` 또는 `[BE/fix] 수정 내용`
```

---

## Mermaid 다이어그램 예시

```markdown
\`\`\`mermaid
graph TD
  Browser -->|HTTP| Middleware
  Middleware -->|인증 통과| ServerComponent
  Middleware -->|미인증| LoginPage
  ServerComponent -->|Prisma| DB[(PostgreSQL)]
  ServerComponent -->|HTML| Browser
\`\`\`
```

---

## 규칙

- 다이어그램은 **ASCII** 또는 **Mermaid** 사용 — 외부 이미지 링크 금지 (링크 깨짐 위험)
- 디렉토리 트리는 **주요 폴더만** — 모든 파일 나열 금지 (유지보수 불가)
- 실제 코드와 다른 아키텍처 기술 금지 — 코드를 먼저 읽고 작성
- "향후 추가 예정", "TODO" 등 미래 계획은 아키텍처 문서에 기재하지 않음
- 환경별 차이(dev/prod)는 명확히 분리해서 표기
