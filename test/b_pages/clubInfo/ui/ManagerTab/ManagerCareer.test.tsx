/**
 * ManagerCareer 전용 테스트 — mgr-career h3 + ol(career-line) 경력선 렌더·접근성 검증.
 *
 * 검증 목적:
 * - ol이 h3 id를 aria-labelledby로 참조한다
 * - careers가 주어진 순서(매퍼가 최신순 정렬 — mapCoachToManager.test 소유)대로 팀·기간을 렌더한다
 * - 현직(now) 항목만 강조 스타일과 united-red dot을 갖는다
 * - careers가 비어 있으면 항목 없이 빈 목록을 렌더한다
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ManagerCareer } from '@pages/clubInfo/ui/ManagerTab/ManagerCareer';
import { MANAGER_FIXTURE } from '@test/fixtures/coach';

afterEach(cleanup);

const manager = MANAGER_FIXTURE;

describe('ManagerCareer', () => {
  it('h3와 ol이 aria-labelledby로 연결된다', () => {
    render(<ManagerCareer manager={manager} />);
    const heading = screen.getByRole('heading', { level: 3, name: '경력 · Career' });
    const list = screen.getByRole('list');
    expect(heading).toHaveAttribute('id');
    expect(list).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('careers를 주어진 순서대로 팀명과 기간을 함께 렌더한다', () => {
    render(<ManagerCareer manager={manager} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(manager.careers.length);
    items.forEach((item, i) => {
      expect(item).toHaveTextContent(manager.careers[i].team);
      expect(item).toHaveTextContent(manager.careers[i].period);
    });
  });

  it('현직(now) 항목만 강조 스타일과 united-red dot을 갖는다', () => {
    render(<ManagerCareer manager={manager} />);
    const items = screen.getAllByRole('listitem');
    items.forEach((item, i) => {
      const isNow = manager.careers[i].now;
      expect(item.classList.contains('font-semibold')).toBe(isNow);
      expect(item.querySelector('span[aria-hidden="true"]')?.classList.contains('bg-united-red')).toBe(isNow);
    });
  });

  it('careers가 비어 있으면 항목 없는 목록을 렌더한다', () => {
    render(<ManagerCareer manager={{ ...manager, careers: [] }} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
