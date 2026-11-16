# UI 컴포넌트

## 공통 컴포넌트 (`f_shared/ui`)

- 폴더 단위로 둔다: `f_shared/ui/{Name}/{Name}.tsx` + `index.ts`
- 최상위 `f_shared/ui/index.ts`에서 재노출한다. 소비는 `@shared/ui`에서 한다.
- 표현형 컴포넌트(카드 등)는 도메인 타입(`e_entities`)을 import하지 않고 자체 props 인터페이스로 데이터를 받는다.

| 컴포넌트 | 용도 |
| --- | --- |
| `Button` | 버튼·링크 버튼 (`mode`: `default`·`link`·`submit`·`icon`) |
| `Badge`, `ResultBadge` | 라벨, 승·무·패 표시 |
| `Card`, `CategoryCard`, `MatchCard`, `PlayerCard` | 카드 |
| `Panel` (`PanelHead`) | 패널 제목 영역 |
| `Shell` | 페이지 셸 (`max-w-shell`) |
| `Eyebrow`, `BilingualLabel` | 소제목, 한/영 라벨 |
| `FilterSelect`, `SearchInput`, `SegmentedControl` | 필터·검색·전환 (Headless UI) |
| `Skeleton`, `StateBox`, `ErrorBoundary` | 로딩·빈 상태·에러 |
| `Crest`, `UnitedShield` | 엠블럼 |

## 페이지 전용 컴포넌트

- 한 페이지에서만 쓰는 컴포넌트는 `b_pages/[page]/ui/{Name}/`에 둔다.
- 여러 페이지에서 쓰면 `c_widgets` 또는 `f_shared/ui`로 올린다.

## 컴포넌트 작성

- 함수 선언으로 쓴다. → [typescript § 함수 선언 형태](typescript.md#함수-선언-형태)
- **인라인 핸들러 금지**: `onClick`·`onChange`·`onSubmit` 등에 화살표 함수를 JSX에 직접 쓰지 않는다. named 함수로 추출해 전달한다.
- props가 3단계 이상 전달되면 Context API 등으로 전환을 검토한다. → [state-management](../architecture/state-management.md)

```tsx
function Pager({ page, onPageChange }: PagerProps) {
  const handlePrevClick = () => onPageChange(page - 1);

  return <button onClick={handlePrevClick}>이전</button>;
}
```

## variant: CVA + cn

- variant는 `cva`로 정의한다.
- 클래스 병합은 항상 `cn()`을 쓴다. `className`은 `cn()`의 **마지막 인자**로 넘겨 호출자가 우선하게 한다.

```tsx
const classes = cn(buttonVariants({ variant, size }), className);
```

## 인터랙션: Headless UI

- 드롭다운·콤보박스·모달·탭·디스클로저 등 동작이 있는 UI는 `@headlessui/react`로 만든다.
- 키보드·포커스·ARIA를 DOM·상태로 직접 다시 구현하지 않는다.

## 아이콘: lucide-react

- 모든 아이콘은 lucide-react를 쓴다. 컴포넌트에서 직접 import한다: `import { Search } from 'lucide-react'`
- 아이콘을 감싸는 배럴을 만들지 않는다. (트리셰이킹)
- 호출자가 넣는 아이콘은 `icon?: ReactNode` 슬롯으로 받는다. 컴포넌트가 특정 아이콘에 고정되지 않게 한다.
- 컴포넌트 자체의 글리프(예: `SearchInput`의 돋보기)는 lucide-react를 직접 쓴다.

## 메모이제이션

- `useMemo`·`useCallback`·`React.memo`는 효과가 있는 곳에만 쓴다.

| 쓸 때 | 예 |
| --- | --- |
| 큰 배열의 필터·정렬·평탄화 | `usePlayerListFilters`의 `results` |
| 훅이 반환하는 콜백 (소비자의 의존성 배열에 들어감) | `useNewsFeed`의 `fetchNextPage` |
| 같은 props로 자주 다시 렌더되는 목록 아이템 | `React.memo` |

- 원시값 계산, 한 번만 쓰는 핸들러에는 쓰지 않는다.
