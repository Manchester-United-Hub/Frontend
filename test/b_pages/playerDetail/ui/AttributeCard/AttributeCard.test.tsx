/**
 * AttributeCard 단위 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * AttributeBarList(내부 서브컴포넌트)도 이 파일에서 함께 검증한다.
 *
 * 검증 목적:
 * - OVR 배지 렌더
 * - HexRadar가 role=img로 렌더(차트 접근성, 필수 시나리오 #5)
 * - 능력치 항목 수만큼 바 리스트 렌더 + getAttrLevel 색상 분기(high/mid/low)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { AttributeCard } from '@pages/playerDetail/ui';

afterEach(cleanup);

const RADAR = [
  { k: '슈팅', v: 83 }, // high (>=80)
  { k: '패스', v: 72 }, // mid (65<=v<80)
  { k: '드리블', v: 85 }, // high
  { k: '스피드', v: 90 }, // high
  { k: '수비', v: 42 }, // low (<65)
  { k: '피지컬', v: 75 }, // mid
];

describe('AttributeCard', () => {
  it('OVR 값을 배지로 렌더한다', () => {
    render(<AttributeCard radar={RADAR} ovr={78} />);
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText('OVR')).toBeInTheDocument();
  });

  it('HexRadar를 role=img + aria-label로 렌더한다(차트 접근성, 필수 시나리오 #5)', () => {
    render(<AttributeCard radar={RADAR} ovr={78} />);
    const chart = screen.getByRole('img', { name: /능력치 육각형/ });
    expect(chart).toBeInTheDocument();
    expect(chart.tagName.toLowerCase()).toBe('svg');
    RADAR.forEach((point) => {
      expect(chart).toHaveAccessibleName(new RegExp(`${point.k} ${point.v}`));
    });
  });

  it('능력치 항목 6개 모두 라벨·수치를 바 리스트로 렌더한다', () => {
    render(<AttributeCard radar={RADAR} ovr={78} />);
    RADAR.forEach((point) => {
      expect(screen.getAllByText(point.k).length).toBeGreaterThan(0);
    });
    // 수치는 HexRadar(svg text)와 AttributeBarList 양쪽에 렌더되므로 2회 이상 등장.
    expect(screen.getAllByText('83').length).toBeGreaterThanOrEqual(2);
  });

  it('getAttrLevel 분기 — high/mid/low 값이 서로 다른 색 토큰으로 렌더된다(AttributeBarList)', () => {
    const { container } = render(<AttributeCard radar={RADAR} ovr={78} />);
    // AttributeBarList의 값 라벨은 style.color로 토큰을 직접 적용한다.
    const highValue = Array.from(container.querySelectorAll('span')).find((el) => el.textContent === '83');
    const midValue = Array.from(container.querySelectorAll('span')).find((el) => el.textContent === '72');
    const lowValue = Array.from(container.querySelectorAll('span')).find((el) => el.textContent === '42');

    expect(highValue).toBeDefined();
    expect(midValue).toBeDefined();
    expect(lowValue).toBeDefined();
    expect(highValue?.style.color).toBe('var(--united-red)');
    expect(midValue?.style.color).toBe('var(--foreground)');
    expect(lowValue?.style.color).toBe('var(--muted-foreground)');
  });
});
