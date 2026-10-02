/**
 * ManagerCareer 전용 테스트 — mgr-career h3 + ol(career-line) 경력선 렌더·접근성 검증.
 *
 * 검증 목적:
 * - ol이 h3 id를 aria-labelledby로 참조한다
 * - prevClubs가 역순(toReversed)으로 렌더되고, 마지막에 now 항목("맨체스터 유나이티드")이 append된다
 * - now 항목만 기간("2026.01 – 현재")을 함께 렌더한다
 * - 원본 prevClubs 배열은 변이되지 않는다(toReversed)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ManagerCareer } from '@pages/clubInfo/ui/ManagerTab/ManagerCareer';
import { manager } from '@pages/clubInfo/model/mockData';

afterEach(cleanup);

describe('ManagerCareer', () => {
  it('h3와 ol이 aria-labelledby로 연결된다', () => {
    render(<ManagerCareer manager={manager} />);
    const heading = screen.getByRole('heading', { level: 3, name: '경력 · Career' });
    const list = screen.getByRole('list');
    expect(heading).toHaveAttribute('id');
    expect(list).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('prevClubs가 역순으로 렌더되고 now 항목이 마지막에 append된다', () => {
    render(<ManagerCareer manager={manager} />);
    const items = screen.getAllByRole('listitem');
    const expectedOrder = [...manager.prevClubs.toReversed(), '맨체스터 유나이티드'];
    expect(items).toHaveLength(expectedOrder.length);
    items.forEach((item, i) => {
      expect(item).toHaveTextContent(expectedOrder[i]);
    });
  });

  it('now 항목만 기간 텍스트를 함께 렌더한다', () => {
    render(<ManagerCareer manager={manager} />);
    const items = screen.getAllByRole('listitem');
    const nowItem = items[items.length - 1];
    expect(nowItem).toHaveTextContent('2026.01 – 현재');
    items.slice(0, -1).forEach((item) => {
      expect(item).not.toHaveTextContent('현재');
    });
  });

  it('원본 prevClubs 배열은 변이되지 않는다', () => {
    const before = [...manager.prevClubs];
    render(<ManagerCareer manager={manager} />);
    expect(manager.prevClubs).toEqual(before);
  });
});
