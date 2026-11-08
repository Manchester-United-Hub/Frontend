/**
 * ManagerTab 조립 테스트 — mgr-detail 2열 그리드(좌: 직함·이름 + ManagerFacts / 우: ManagerPhoto + ManagerCareer)가
 * 올바른 서브컴포넌트로 조립되는지, 감독 API 실패(manager=null) 시 빈 상태를 렌더하는지 검증한다.
 * 각 서브컴포넌트의 상세 렌더·엣지 케이스는 ManagerFacts·ManagerCareer·ManagerPhoto 테스트가
 * 각자 소유한다(§code-conventions 컴포넌트 1:테스트 1).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ManagerTab } from '@pages/clubInfo/ui/ManagerTab';
import { MANAGER_FIXTURE } from '@test/fixtures/coach';

afterEach(cleanup);

const manager = MANAGER_FIXTURE;

describe('ManagerTab', () => {
  it('직함 뱃지와 영문 이름(h2)이 렌더된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(screen.getByText(manager.role)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: manager.name })).toBeInTheDocument();
  });

  it('ManagerFacts(감독 정보 5행)가 조립된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(screen.getByText('출생')).toBeInTheDocument();
    expect(screen.getByText(manager.born)).toBeInTheDocument();
  });

  it('사진 슬롯에 감독 사진이 이름 기반 alt로 렌더된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(screen.getByRole('img', { name: `${manager.name} 감독 사진` })).toBeInTheDocument();
  });

  it('사진이 없으면 사진 슬롯에 Silhouette 플레이스홀더가 렌더된다', () => {
    const { container } = render(<ManagerTab manager={{ ...manager, photo: null }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    // Silhouette은 fill="currentColor"로 렌더되어 stroke 기반인 lucide 아이콘(ManagerFacts)과 구분된다.
    const silhouette = container.querySelector('svg[aria-hidden="true"][fill="currentColor"]');
    expect(silhouette).not.toBeNull();
  });

  it('ManagerCareer(경력 · Career)가 조립된다', () => {
    render(<ManagerTab manager={manager} />);
    expect(screen.getByRole('heading', { level: 3, name: '경력 · Career' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(manager.careers.length);
  });

  it('manager가 null이면 감독 정보 대신 불러오기 실패 빈 상태(h3)를 렌더한다', () => {
    render(<ManagerTab manager={null} />);
    expect(
      screen.getByRole('heading', { level: 3, name: '감독 정보를 불러오지 못했어요' })
    ).toBeInTheDocument();
    expect(screen.getByText('잠시 후 다시 시도해 주세요.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '경력 · Career' })).not.toBeInTheDocument();
  });
});
