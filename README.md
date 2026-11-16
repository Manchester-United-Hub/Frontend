# Manchester United Hub (manu-hub)

팬이 만든 맨체스터 유나이티드 정보 허브. 시즌·경기·선수·구단·기사·하이라이트를 제공하는 웹앱입니다.

## 시작하기

요구 사항: Node.js 24, pnpm 11

```bash
pnpm install
cp .env.example .env.local   # API_BASE_URL 값 채우기
pnpm dev                     # http://localhost:3000
```

환경변수는 [docs/architecture/env.md](docs/architecture/env.md)를 참고하세요.

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 빌드 (`standalone`) |
| `pnpm start` | 프로덕션 서버 |
| `pnpm test` | 테스트 (Vitest, 커버리지 포함) |
| `pnpm test:coverage` | 커버리지 |
| `pnpm lint` | 린트 (ESLint) |
| `pnpm exec tsc --noEmit` | 타입 검사 |

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · CVA · Headless UI · lucide-react · TanStack Query · zod · Vitest

자세한 내용: [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md)

## 구조

Feature-Sliced Design을 따릅니다. 의존 방향은 위 → 아래만 허용합니다.

```
src/
├── app/          Next.js 라우트 + BFF(app/api/v1) + providers
├── b_pages/      페이지 조합
├── c_widgets/    큰 UI 블록 (Navbar, Footer, Standing ...)
├── d_features/   데이터 조회·필터 (TanStack Query)
├── e_entities/   도메인 (matches, news, player, rank, seasonInfo, team)
└── f_shared/     공용 (ui, api, model, utils)
test/             src 미러 구조의 테스트
```

자세한 내용: [docs/architecture/folder-structure.md](docs/architecture/folder-structure.md)

## 문서

설계 결정과 코드 규칙은 [`docs/`](docs/README.md)에 있습니다.

| 영역 | 시작 문서 |
| --- | --- |
| 구조·기술 결정 | [overview](docs/architecture/overview.md), [data-flow](docs/architecture/data-flow.md), [rendering](docs/architecture/rendering.md) |
| 코드 규칙 | [naming](docs/convention/naming.md), [ui-component](docs/convention/ui-component.md), [test](docs/convention/test.md) |
| 협업 | [branch-strategy](docs/collaboration/branch-strategy.md), [commit](docs/collaboration/commit.md), [pr-flow](docs/collaboration/pr-flow.md) |
