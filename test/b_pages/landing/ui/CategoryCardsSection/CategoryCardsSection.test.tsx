/**
 * CategoryCardsSection 단위 테스트.
 *
 * 검증 목적:
 * - 컴포넌트가 무props(NAV_ITEMS 6건 고정 렌더)로 바뀌어, categories prop 기반 케이스는
 *   공개 API 소멸로 도달 불가하다 — 옛 "폴백 아이콘" 케이스(매핑에 없는 key 주입)는
 *   props로 임의 key를 주입할 경로 자체가 없어져 삭제한다.
 * - 한글·영문 라벨 6건 모두 렌더 (F-3: 무props)
 * - 카드 설명 텍스트 존재 (description은 여전히 렌더되는 살아있는 계약이므로 유지)
 * - ul[role=list] 직계 li 6개 (F-1: <li> 래핑 회귀 수정)
 * - 외부 링크(store)는 a[target="_blank"] + rel="noreferrer" + 고정 href, 내부 5건은 target 없음 (F-4)
 * - 섹션 aria-labelledby가 h2 id와 일치
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';

afterEach(cleanup);

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={String(href)} className={className}>
      {children}
    </a>
  ),
}));

import { CategoryCardsSection } from '@pages/landing/ui/CategoryCardsSection';

describe('CategoryCardsSection', () => {
  it('카테고리 6개 한글 이름 모두 렌더', () => {
    const { container } = render(<CategoryCardsSection />);
    const text = container.textContent ?? '';
    ['시즌', '선수', '구단', '하이라이트', '기사', '공식 Store'].forEach(
      (name) => {
        expect(text).toContain(name);
      }
    );
  });

  it('카테고리 6개 영문 이름 모두 렌더', () => {
    const { container } = render(<CategoryCardsSection />);
    const text = container.textContent ?? '';
    ['Season', 'Players', 'Club', 'Highlights', 'NEWS', 'STORE'].forEach(
      (en) => {
        expect(text).toContain(en);
      }
    );
  });

  it('카드 설명 텍스트 존재', () => {
    const { container } = render(<CategoryCardsSection />);
    expect(container.textContent).toContain('일정·결과·순위표를 한눈에 추적');
  });

  it('ul[role=list]의 직계 자식 li가 6개다', () => {
    const { container } = render(<CategoryCardsSection />);
    const list = container.querySelector('ul[role="list"]');
    expect(list).not.toBeNull();
    const items = list!.querySelectorAll(':scope > li');
    expect(items).toHaveLength(6);
  });

  it('외부 링크(store)는 a[target="_blank"]이고 href가 스토어 URL이다', () => {
    const { container } = render(<CategoryCardsSection />);
    const outerLink = container.querySelector('a[target="_blank"]');
    expect(outerLink).not.toBeNull();
    expect(outerLink).toHaveAttribute('href', 'https://store.manutd.com/ko-kr');
  });

  it('외부 링크에는 rel="noreferrer"가 붙어 referrer가 새지 않는다', () => {
    const { container } = render(<CategoryCardsSection />);
    const outerLink = container.querySelector('a[target="_blank"]');
    expect(outerLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('내부 카테고리 5개는 target 속성이 없다', () => {
    const { container } = render(<CategoryCardsSection />);
    const list = container.querySelector('ul[role="list"]');
    const innerLinks = list!.querySelectorAll('li > a:not([target])');
    expect(innerLinks).toHaveLength(5);
  });

  it('lg 뷰포트에서 카드 6개가 한 줄에 배치되도록 grid-cols-6를 적용한다', () => {
    const { container } = render(<CategoryCardsSection />);
    const list = container.querySelector('ul[role="list"]');
    expect(list).toHaveClass('lg:grid-cols-6');
  });

  it('섹션 aria-labelledby가 h2 id와 일치', () => {
    const { container } = render(<CategoryCardsSection />);
    const section = container.querySelector('section[aria-labelledby]');
    expect(section).not.toBeNull();
    const labelledBy = section!.getAttribute('aria-labelledby');
    const heading = container.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading).toHaveAttribute('id', labelledBy);
  });
});
