# PR 플로우

브랜치 종류·이름·머지 방식은 [branch-strategy](branch-strategy.md)를 따른다.

## 기본 플로우

```
이슈 생성 → 작업 브랜치 생성 → 작업·커밋 → PR (→ dev) → CI 통과 → 머지
```

1. 이슈를 먼저 만든다.
2. `dev`에서 작업 브랜치를 만든다. 동시에 여러 작업을 하면 `git worktree`로 분리한다.
3. 커밋은 [commit](commit.md) 규칙을 따른다.
4. PR을 만든다. 제목 형식: `[작업성격] 작업한 내용 (한글)`
   - 예: `[Feature] 랜딩 경기 일정 실 API 연결`, `[FIX] 구단 페이지 디자인 반영`, `[DESIGN] 뉴스 페이지 디자인 변경 요소 적용`
5. CI를 통과하고 리뷰 지적을 처리하면 머지한다. → [code-review](code-review.md), [ci](ci.md)

## 템플릿

| 종류 | 파일 |
| --- | --- |
| PR | [`.github/pull_request_template.md`](../../.github/pull_request_template.md) |
| 이슈 (작업) | [`.github/ISSUE_TEMPLATE/progress.md`](../../.github/ISSUE_TEMPLATE/progress.md) |
| 이슈 (버그) | [`.github/ISSUE_TEMPLATE/bug.md`](../../.github/ISSUE_TEMPLATE/bug.md) |

- PR 본문 체크리스트의 "테스트 통과"에는 실행한 검증 결과(tsc, eslint, vitest 건수, build)를 함께 적는다.

## 릴리스

1. `dev`에서 `release/x.y.z` 브랜치를 만든다.
2. 릴리스 마감 수정만 이 브랜치에 추가한다.
3. `main`으로 PR을 만든다. 제목: `[Release] x.y.z`
4. Merge commit으로 머지한다. `main` push로 배포가 실행된다. → [ci § 배포](ci.md#배포)
5. `main`을 `dev`에 머지해 마감 수정을 반영한다.

## 긴급 수정 (hotfix)

1. 이슈를 만들고 `main`에서 `hotfix/설명` 브랜치를 만든다.
2. 수정에 필요한 최소 변경만 포함한다.
3. `main`으로 PR → 머지 후, `main` → `dev` PR로 같은 수정을 반영한다.
