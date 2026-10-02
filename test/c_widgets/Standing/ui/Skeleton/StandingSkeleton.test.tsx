/**
 * StandingSkeleton 컴포넌트 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6 / S-15).
 *
 * 이 파일이 없던 동안 무슨 일이 있었나(F-26):
 * 이 컴포넌트는 원래 StandingsTab의 클라이언트 isLoading 분기로 렌더됐고 그 경로로
 * 테스트에 닿아 있었다. 1차 ST-05(S-6)가 그 분기를 제거하고 스켈레톤을 SeasonPage의
 * SSR Suspense fallback으로 옮기면서 (1) 잘못된 DOM 중첩(<table> 없는 <thead>/<tr>)의
 * 위험도가 "클라이언트 경고"에서 "SSR 하이드레이션 에러"로 올라갔고 (2) 동시에 그것을
 * 관측할 유일한 렌더 경로가 사라져 Functions 커버리지가 0%가 됐다. 두 변화가 서로를
 * 가렸다. 이 파일은 그 관측 수단을 되돌린다.
 *
 * [F-30] 이 컴포넌트는 원래 Shell+PanelHead 안에서 렌더됐는데(git show 9d15068),
 * 1차 ST-05가 Suspense fallback 슬롯으로 옮기며 그 컨테이너 밖으로 꺼내 레이아웃
 * 점프(가로 24px + 세로)가 발생했다(decision-5/D-21). 이 파일에 "콘텐츠 짝 등가성"
 * describe 블록을 추가해 Shell·PanelHead·표 컨테이너가 StandingsTab과 같은지 검증한다.
 *
 * 검증 목적:
 * - T1·T2 로딩 알림 계약(role=status·aria-live·sr-only 텍스트)
 * - T3 표 구조 계약(<table>/<thead>/<tbody>) — 실패 시 원인이 바로 읽히는 정적 단언
 * - T4 [주 게이트] SSR HTML을 브라우저 파서에 통과시킨 DOM이 클라이언트 렌더 DOM과
 *      같은 구조인가 = 하이드레이션 계약. 결함의 정의를 직접 잰다
 * - T5 실제 StandingsTable과 헤더 구조가 동일한가 = 레이아웃 점프 방지(S2-5)의 가로축
 * - T6 렌더 중 React 경고가 0건인가 (넓은 그물. 주 게이트는 T4)
 * - T7 시각적 자리표시자가 접근성 트리에서 제외되는가
 * - T8(신규, F-30) 콘텐츠 짝(StandingsTab) 등가성 — Shell·PanelHead·표 컨테이너
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import '@testing-library/jest-dom/vitest';

import { StandingSkeleton } from '@widgets/Standing/ui/Skeleton';
import { StandingsTable } from '@entities/rank/ui/StandingsTable';
import { StandingsTab } from '@widgets/Standing/ui/StandingsTab';

const SKELETON_ARIA_LABEL = '시즌 순위표를 불러오는 중';
const SEASON = '2025/26';

// 리터럴로 고정한다. 대상 모듈의 상수를 import해 기대값으로 쓰면 상수 자체가 검증되지
// 않는다(상수를 20 → 3으로 바꿔도 테스트가 따라간다).
const EXPECTED_ROW_COUNT = 20;
const EXPECTED_HEADER_CELL_COUNT = 11;
const EXPECTED_SHAPE = 'table:1 thead:1 tbody:1 tr:21 th:11';

const shapeOf = (root: HTMLElement) =>
  ['table', 'thead', 'tbody', 'tr', 'th']
    .map((tag) => `${tag}:${root.querySelectorAll(tag).length}`)
    .join(' ');

afterEach(cleanup);

describe('StandingSkeleton', () => {
  it('T1 role=status·aria-live=polite·aria-label로 로딩 중임을 알린다', () => {
    render(<StandingSkeleton season={SEASON} />);

    const status = screen.getByRole('status', { name: SKELETON_ARIA_LABEL });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('T2 live region 안에 실제로 읽을 알림 텍스트(sr-only)가 존재한다', () => {
    render(<StandingSkeleton season={SEASON} />);

    expect(screen.getByText(SKELETON_ARIA_LABEL)).toBeInTheDocument();
  });

  it('T3 thead·tbody를 갖춘 단일 table로 렌더한다 (F-26 회귀 방지)', () => {
    const { container } = render(<StandingSkeleton season={SEASON} />);

    const tables = container.querySelectorAll('table');
    expect(tables).toHaveLength(1);

    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');
    expect(thead?.parentElement?.tagName).toBe('TABLE');
    expect(tbody?.parentElement?.tagName).toBe('TABLE');
    expect(container.querySelectorAll('tbody > tr')).toHaveLength(
      EXPECTED_ROW_COUNT
    );
    expect(container.querySelectorAll('thead th')).toHaveLength(
      EXPECTED_HEADER_CELL_COUNT
    );
  });

  it('T4 SSR HTML을 브라우저 파서에 통과시켜도 클라이언트 렌더와 같은 구조가 나온다 (하이드레이션 계약)', () => {
    // SSR은 HTML "문자열"로 나가고 브라우저 파서가 그것을 DOM으로 만든다. table 밖의
    // thead·tr은 이 단계에서 밀려나거나(foster parenting) 버려지므로, 파싱 결과가
    // 클라이언트 트리와 달라진다 — 그것이 하이드레이션 에러의 정의다.
    const parsed = document.createElement('div');
    parsed.innerHTML = renderToStaticMarkup(<StandingSkeleton season={SEASON} />);

    const { container } = render(<StandingSkeleton season={SEASON} />);

    expect(shapeOf(parsed)).toBe(shapeOf(container));
    expect(shapeOf(parsed)).toBe(EXPECTED_SHAPE);
  });

  it('T5 실제 StandingsTable과 헤더 셀 개수·문구가 같다 (S2-5 가로축 레이아웃 점프 방지)', () => {
    const skeleton = render(<StandingSkeleton season={SEASON} />);
    const skeletonHeaders = Array.from(
      skeleton.container.querySelectorAll('thead th')
    ).map((th) => th.textContent);
    cleanup();

    const table = render(<StandingsTable season="2026-27" standings={[]} />);
    const tableHeaders = Array.from(
      table.container.querySelectorAll('thead th')
    ).map((th) => th.textContent);

    expect(skeletonHeaders).toEqual(tableHeaders);
    expect(skeletonHeaders).toHaveLength(EXPECTED_HEADER_CELL_COUNT);
  });

  it('T6 렌더 중 React 경고(console.error)가 발생하지 않는다', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      render(<StandingSkeleton season={SEASON} />);
      const messages = errorSpy.mock.calls.map((args) => String(args[0]));
      expect(messages).toEqual([]);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('T7 시각적 자리표시자는 aria-hidden 래퍼로 감싸져 접근성 트리에서 제외된다', () => {
    const { container } = render(<StandingSkeleton season={SEASON} />);

    const hiddenWrapper = container.querySelector('[aria-hidden]');
    expect(hiddenWrapper).toBeInTheDocument();
    expect(hiddenWrapper?.querySelector('table')).toBeInTheDocument();
  });

  describe('콘텐츠 짝 등가성 (decision-5 §1-(1)(2) — Shell·PanelHead·표 컨테이너)', () => {
    it('StandingsTab과 같은 h2·설명 문구·Shell className·table/스크롤러 className을 렌더한다', () => {
      const { container: skeletonContainer } = render(
        <StandingSkeleton season={SEASON} />
      );
      const skeletonShell = skeletonContainer.querySelector('.max-w-shell');
      if (!skeletonShell) throw new Error('skeleton Shell not found');
      const skeletonHead = within(skeletonShell.children[0] as HTMLElement);

      const skeletonShellClassName = skeletonShell.className;
      const skeletonHeading = skeletonHead.getByRole('heading', {
        level: 2,
        hidden: true,
      }).textContent;
      const skeletonDescription = skeletonShell.children[0].querySelector(
        'p'
      )?.textContent;
      const skeletonScroller = skeletonShell.children[1] as HTMLElement;
      const skeletonScrollerClassName = skeletonScroller.className;
      const skeletonTableClassName =
        skeletonScroller.querySelector('table')?.className;

      cleanup();

      const { container: contentContainer } = render(
        <StandingsTab season={SEASON} standings={[]} />
      );
      const contentShell = contentContainer.querySelector('.max-w-shell');
      if (!contentShell) throw new Error('content Shell not found');
      const contentHead = within(contentShell.children[0] as HTMLElement);
      const contentScroller = contentShell.children[1] as HTMLElement;

      expect(contentShell.className).toBe(skeletonShellClassName);
      expect(contentHead.getByRole('heading', { level: 2 }).textContent).toBe(
        skeletonHeading
      );
      expect(contentShell.children[0].querySelector('p')?.textContent).toBe(
        skeletonDescription
      );
      expect(contentScroller.className).toBe(skeletonScrollerClassName);
      expect(contentScroller.querySelector('table')?.className).toBe(
        skeletonTableClassName
      );
    });
  });
});
