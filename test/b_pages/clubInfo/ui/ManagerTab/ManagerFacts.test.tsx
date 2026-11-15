/**
 * ManagerFacts 전용 테스트 — mgr-facts dl 5행(출생·출생지·부임·계약 기간·국적) 렌더·접근성 검증.
 *
 * 검증 목적:
 * - 5행이 라벨 순서대로(출생/출생지/부임/계약 기간/국적) dt/dd 구조로 렌더된다
 * - 각 dd 값이 manager 데이터와 일치한다
 * - 국적 행의 dd는 국가명 텍스트만 렌더한다(API에 국가 코드가 없어 FlagSwatch 미렌더 — 설계 D-10)
 * - API null 값("-")도 그대로 렌더된다
 * - dt 아이콘은 장식 요소로 aria-hidden 처리된다(svg[aria-hidden])
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ManagerFacts } from '@pages/clubInfo/ui/ManagerTab/ManagerFacts';
import { MANAGER_FIXTURE } from '@test/fixtures/coach';

afterEach(cleanup);

const manager = MANAGER_FIXTURE;
const FACT_LABELS = ['출생', '출생지', '부임', '계약 기간', '국적'];

describe('ManagerFacts', () => {
  it('5행이 라벨 순서대로 dt/dd 구조로 렌더된다', () => {
    const { container } = render(<ManagerFacts manager={manager} />);
    const dts = container.querySelectorAll('dt');
    expect(dts).toHaveLength(FACT_LABELS.length);
    dts.forEach((dt, i) => {
      expect(dt).toHaveTextContent(FACT_LABELS[i]);
    });
  });

  it('출생·출생지·부임·계약 기간 dd 값이 manager 데이터와 일치한다', () => {
    render(<ManagerFacts manager={manager} />);
    expect(screen.getByText(manager.born)).toBeInTheDocument();
    expect(screen.getByText(manager.birthplace)).toBeInTheDocument();
    expect(screen.getByText(manager.appointed)).toBeInTheDocument();
    expect(screen.getByText(manager.contract)).toBeInTheDocument();
  });

  it('국적 행의 dd는 국기 스와치 없이 국가명만 렌더한다', () => {
    const { container } = render(<ManagerFacts manager={manager} />);
    const dds = container.querySelectorAll('dd');
    const nationalityDd = dds[FACT_LABELS.indexOf('국적')];
    expect(nationalityDd).toHaveTextContent(manager.nationality);
    expect(nationalityDd.querySelector('span[aria-hidden="true"]')).toBeNull();
  });

  it('API에서 null이던 값("-")도 각 dd에 그대로 렌더된다', () => {
    const { container } = render(
      <ManagerFacts
        manager={{ ...manager, born: '-', birthplace: '-', appointed: '-', contract: '-', nationality: '-' }}
      />
    );
    container.querySelectorAll('dd').forEach((dd) => {
      expect(dd).toHaveTextContent(/^-$/);
    });
  });

  it('dt 아이콘은 장식 요소로 aria-hidden 처리된다', () => {
    const { container } = render(<ManagerFacts manager={manager} />);
    const icons = container.querySelectorAll('dt svg[aria-hidden="true"]');
    expect(icons).toHaveLength(FACT_LABELS.length);
  });
});
