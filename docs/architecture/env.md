# 환경변수

## 파일

| 파일 | 용도 | 커밋 |
| --- | --- | --- |
| `.env.example` | 필요한 키 목록과 설명 (값은 비움) | O |
| `.env.local` | 로컬 개발 값 | X |

- `.gitignore`는 `.env*`를 무시하고 `!.env.example`만 예외로 둔다.
- 운영 값은 GitHub Secrets에 두고 Docker 빌드 인자로 넘긴다. → [ci](../collaboration/ci.md)
- `git worktree`로 새 작업 트리를 만들면 `.env.local`이 따라오지 않는다. 복사해 둬야 API 호출이 동작한다.

## 키

| 키 | 노출 | 용도 |
| --- | --- | --- |
| `API_BASE_URL` | 서버 전용 | 백엔드 주소. `serverFetcher`의 base URL |

## 브라우저 → 백엔드 호출

- 브라우저는 백엔드를 직접 호출하지 않는다. 같은 출처의 BFF(`/bff/v1/...`)를 호출하고, BFF가 `API_BASE_URL`로 백엔드를 호출한다. → [data-flow](data-flow.md)
- 따라서 백엔드 주소를 `NEXT_PUBLIC_`으로 노출하지 않는다.

## 접근 방식

- `f_shared/utils/env.ts`에서 zod 스키마로 검증한 뒤 `env`로 export한다.
- 코드에서 `process.env`를 직접 읽지 않는다.
- 테스트 환경 값은 `vitest.config.ts`의 `test.env`에 같은 키 이름으로 넣는다.

## 키 추가 절차

1. `.env.example`에 키와 설명 추가
2. `f_shared/utils/env.ts` 스키마에 추가
3. `vitest.config.ts`의 `test.env`에 테스트 값 추가
4. GitHub Secrets 등록 + `deploy.yml`의 빌드 인자 추가

현재 코드와 다른 부분은 [known-gaps](../known-gaps.md)에 있다.
