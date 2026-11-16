# 접근성

목표 기준(WCAG 레벨 등)은 미정이다. 아래는 현재 지키는 규칙이다.

## 시맨틱 태그

- 페이지 루트는 `<main>`으로 감싼다. 내비게이션은 `<nav>`, 푸터는 `<footer>`를 쓴다.
- 이동은 `<Link>`, 동작은 `<button>`을 쓴다. `<div onClick>`을 쓰지 않는다.

## 인터랙션

- 키보드·포커스·ARIA가 필요한 UI는 Headless UI로 만든다. → [ui-component § 인터랙션](ui-component.md#인터랙션-headless-ui)
- 포커스 표시를 제거하지 않는다. 버튼은 `focus-visible:ring`을 쓴다.

## ARIA

| 상황 | 규칙 |
| --- | --- |
| 아이콘만 있는 버튼 | `aria-label` 필수 |
| 현재 페이지 번호 | `aria-current="page"` |
| 외부 링크 (`target="_blank"`) | `rel="noreferrer"` |

## 이미지 alt

| 이미지 성격 | alt |
| --- | --- |
| 정보 전달 (선수 사진, 엠블럼) | 내용을 설명한다 |
| 장식 | `alt=""` (생략하지 않고 빈 문자열) |

## 색에만 의존 금지

- 승/무/패는 색(`win`·`draw`·`loss`)과 함께 텍스트를 표시한다.

## 동작 줄이기

- 애니메이션은 `motion-safe:`로 감싼다. → [style § 모션](style.md#모션)

## 페이지 공통

- `<html lang="ko">`

## 테스트

- 컴포넌트 테스트에서 role·aria 속성을 검증한다. → [test](test.md)
