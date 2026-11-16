# CI / 배포

## 로컬: Husky

| 훅 | 실행 |
| --- | --- |
| `commit-msg` | 커밋 헤더 정규식 검사 → [commit](commit.md#헤더) |
| `pre-push` | `pnpm lint` → `pnpm test` (테스트 파일이 있을 때) → `pnpm build`. 하나라도 실패하면 push 중단 |

## 검증 명령

| 대상 | 명령 |
| --- | --- |
| 타입 | `pnpm exec tsc --noEmit` |
| 린트 | `pnpm exec eslint <경로>` (전체: `pnpm lint`) |
| 테스트 | `pnpm test` |
| 빌드 | `pnpm build` |

## GitHub Actions: CI

`.github/workflows/ci.yml` — `main`·`dev` 대상 PR에서 실행한다.

환경: ubuntu, Node 24, pnpm (`--frozen-lockfile`)

| 단계 | 명령 |
| --- | --- |
| Lint | `pnpm lint` |
| Type check | `pnpm tsc --noEmit` |
| Unit tests | `pnpm test` |

- `next build`는 CI에서 돌리지 않는다. 로컬 `pre-push`에서 확인한다.

## 배포

`.github/workflows/deploy.yml` — `main`에 push(= PR 머지)되면 실행한다.

```
build (lint · tsc · test)
  → docker-build-push  Docker 이미지 빌드 → Docker Hub push (:latest, :커밋SHA)
  → deploy             EC2에 SSH 접속 → docker compose pull + up -d manu-front
```

- 이미지는 `Dockerfile`의 멀티 스테이지 빌드(`deps` → `builder` → `runner`)로 만든다. Next.js `output: 'standalone'`을 쓴다.
- `API_BASE_URL`은 빌드 인자(`--build-arg`)로 넘긴다. → [env](../architecture/env.md)

### GitHub Secrets

| 키 | 용도 |
| --- | --- |
| `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` | Docker Hub 로그인 |
| `API_BASE_URL` | 백엔드 주소 (빌드 인자) |
| `EC2_HOST`, `EC2_USERNAME`, `EC2_PRIVATE_KEY` | EC2 SSH 접속 |

## Netlify

- 저장소에 `netlify.toml`이 있고, `next.config.ts`는 `NETLIFY` 환경에서 `standalone`을 끈다.
- 실제로 쓰는지, 지울지는 미정이다.
