# Code Execution Documentation

실행 가능한 코드(스크립트, CLI, pnpm 명령어, Docker 등)를 문서화할 때 사용하는 형식과 규칙.

---

## 문서 구성 순서

1. **한 줄 설명** — 이 명령/스크립트가 무엇을 하는가
2. **사전 조건** — 필요한 환경, 의존성, 권한
3. **실행 명령** — 복사해서 바로 쓸 수 있는 코드 블록
4. **주요 옵션** — 자주 바꾸는 인자/플래그만 (전체 나열 금지)
5. **출력 예시** — 성공 시 어떻게 보이는지 (선택)
6. **에러 처리** — 흔한 실패 원인과 해결법 (선택)

---

## 템플릿

### pnpm 스크립트

```markdown
## 개발 명령어

**사전 조건:** Node.js 20+, `.env.local` 설정 완료

\`\`\`bash
pnpm install        # 의존성 설치
pnpm dev            # 개발 서버 (localhost:3000)
pnpm build          # 프로덕션 빌드
pnpm lint           # ESLint + Prettier 검사
\`\`\`

**주요 환경 변수:**

| 변수 | 필수 | 설명 |
|------|------|------|
| `DATABASE_URL` | ✓ | PostgreSQL 연결 문자열 |
| `NEXTAUTH_SECRET` | ✓ | 세션 암호화 키 |
| `NEXT_PUBLIC_API_URL` | - | 외부 API 기본 URL |
```

### Docker / Docker Compose

```markdown
## Docker 실행

\`\`\`bash
# 이미지 빌드
docker build -t my-app .

# 컨테이너 실행 (포트 3000)
docker run -p 3000:3000 --env-file .env my-app

# Compose로 전체 스택 실행
docker compose up -d
\`\`\`

**빌드 인자:**

| ARG | 기본값 | 설명 |
|-----|--------|------|
| `NODE_ENV` | `production` | 빌드 환경 |

> 주의: `.env` 파일은 이미지에 포함되지 않습니다. 런타임에 `--env-file`로 주입하세요.
```

### GitHub Actions / CI

```markdown
## CI 파이프라인

`.github/workflows/ci.yml` — PR 생성 시 자동 실행.

| 단계 | 설명 |
|------|------|
| `lint` | ESLint + TypeScript 타입 검사 |
| `test` | 단위 테스트 |
| `build` | Next.js 프로덕션 빌드 |
| `deploy` | AWS ECR 푸시 → ECS 배포 (`main` 브랜치 한정) |

**필요한 Repository Secrets:**

\`\`\`
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
ECR_REPOSITORY
\`\`\`
```

---

## 커밋 작성 규칙

코드 실행 관련 변경 시 커밋 타입 선택:

| 변경 유형 | 타입 | 예시 |
|-----------|------|------|
| 새 스크립트 추가 | `Chore` | `Chore: add build script to package.json #12` |
| Dockerfile 수정 | `Chore` | `Chore: update node base image to 20-alpine #15` |
| CI 파이프라인 변경 | `Chore` | `Chore: add deploy step to github actions #8` |
| 환경 변수 추가 | `Chore` | `Chore: add resend api key env variable #20` |

> 형식: `Type: lowercase message #이슈번호`

---

## 규칙

- 명령어는 **항상 코드 블록**으로 감싼다 — 인라인 코드(`` ` ``) 단독 사용 금지
- 패키지 매니저는 **pnpm** 으로 통일 (`npm`, `yarn` 사용 금지)
- 환경 변수는 테이블로 정리하고 필수/선택 여부 명시
- 보안상 민감한 값(실제 키, 패스워드)은 절대 기록하지 않음 — `<YOUR_KEY>` 형태로 표시
- 멀티 스텝 명령은 번호 대신 개별 코드 블록으로 분리
