/**
 * ManagerTab 조립 테스트 — mgr-detail 2열 그리드(좌: 직함·이름 + ManagerFacts / 우: mgr-shot + ManagerCareer)가
 * 올바른 서브컴포넌트로 조립되는지 검증한다. 각 서브컴포넌트의 상세 렌더·엣지 케이스는
 * ManagerFacts.test.tsx·ManagerCareer.test.tsx가 각자 소유한다(§code-conventions 컴포넌트 1:테스트 1).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ManagerTab } from '@pages/clubInfo/ui/ManagerTab';
import { manager } from '@pages/clubInfo/model/mockData';

afterEach(cleanup);

describe('ManagerTab', () => {
  it('직함 뱃지·이름·영문명이 렌더된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(screen.getByText(manager.role)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: manager.name })).toBeInTheDocument();
    expect(screen.getByText(manager.en)).toBeInTheDocument();
  });

  it('ManagerFacts(감독 정보 5행)가 조립된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(screen.getByText('출생')).toBeInTheDocument();
    expect(screen.getByText(manager.born)).toBeInTheDocument();
  });

  it('mgr-shot 사진 슬롯에 Silhouette 플레이스홀더가 렌더된다', () => {
    const { container } = render(<ManagerTab manager={manager} />);
    // Silhouette은 fill="currentColor"로 렌더되어 stroke 기반인 lucide 아이콘(ManagerFacts)과 구분된다.
    const silhouette = container.querySelector('svg[aria-hidden="true"][fill="currentColor"]');
    expect(silhouette).not.toBeNull();
  });

  it('ManagerCareer(경력 · Career)가 조립된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(screen.getByRole('heading', { level: 3, name: '경력 · Career' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });
});
