# 스타일

## 기본

- 스타일은 Tailwind CSS v4 유틸리티 클래스로 작성한다.
- Tailwind 설정은 `tailwind.config.*`가 아닌 CSS `@theme`에서 한다.
- 조건부 클래스와 병합은 `cn()`을 쓴다. → [ui-component § variant](ui-component.md#variant-cva--cn)

## 디자인 토큰

```
f_shared/ui/tokens/colors.css      # :root CSS 변수 (색)
f_shared/ui/tokens/typography.css  # :root CSS 변수 (폰트·타입 스케일)
  → app/globals.css에서 import → @theme inline으로 Tailwind에 노출
```

- **raw hex를 쓰지 않는다.** 색은 토큰 클래스로 쓴다: `bg-united-red`, `text-muted-foreground`, `bg-win`
- 필요한 색은 `colors.css`에 변수를 추가하고 `globals.css`의 `@theme inline`에 등록한다.
- hex 외 임의값(`px-[22px]`, `text-[15px]`)의 허용 범위는 미정이다.

| 그룹 | 토큰 |
| --- | --- |
| 기본 (shadcn Zinc 기반) | `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring` (+ `-foreground`) |
| 브랜드 | `united-red`, `united-red-ink`, `united-red-soft` |
| 경기 결과 | `win`, `draw`, `loss` |
| 레이아웃 | `max-w-shell` (1200px) |

## 모션

- hover 전환·애니메이션은 `motion-safe:`를 붙여 `prefers-reduced-motion`을 존중한다.

```tsx
<div className="motion-safe:transition-transform motion-safe:hover:-translate-y-0.5" />
```

## 다크 모드

- 지금은 지원하지 않는다. `colors.css`에 다크 값 세트(`[data-theme='dark']`)만 정의돼 있다.
- 지원 방식은 미정이다.

## 반응형

- 접두사 없는 클래스 = 모바일, 큰 화면은 `md:`, `lg:`로 덮어쓴다. breakpoint는 Tailwind 기본값을 쓴다.
