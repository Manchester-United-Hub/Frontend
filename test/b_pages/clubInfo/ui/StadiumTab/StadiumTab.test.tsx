/**
 * StadiumTab 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage).
 *
 * 검증 목적:
 * - 구장명·영문명·팩트 4종(label/value)·주소가 렌더되는가
 * - StadiumFactItem의 FACT_ICON_MAP에 없는 icon name을 주입했을 때 폴백 아이콘으로
 *   대체되어 크래시 없이 렌더되는가(StadiumFactItem.tsx:29 미도달 분기)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StadiumTab } from '@pages/clubInfo/ui/StadiumTab';
import { stadium } from '@pages/clubInfo/model/mockData';
import type { Stadium } from '@pages/clubInfo/model/types';

afterEach(cleanup);

describe('StadiumTab', () => {
  it('구장명·영문명·팩트 4종·주소를 렌더한다', () => {
    render(<StadiumTab stadium={stadium} />);

    expect(screen.getByRole('heading', { level: 3, name: stadium.name })).toBeInTheDocument();
    expect(screen.getByText(stadium.en)).toBeInTheDocument();

    stadium.facts.forEach((fact) => {
      expect(screen.getByText(fact.label)).toBeInTheDocument();
      expect(screen.getByText(fact.value)).toBeInTheDocument();
    });

    expect(screen.getByText(stadium.address)).toBeInTheDocument();
  });

  it('facts에 icon 매핑이 없는 항목이 있어도 폴백 아이콘으로 렌더되고 크래시 없다', () => {
    const stadiumWithUnknownIcon: Stadium = {
      ...stadium,
      facts: [{ icon: 'NotARealIcon', label: '테스트 팩트', value: '값123' }],
    };
    expect(() => render(<StadiumTab stadium={stadiumWithUnknownIcon} />)).not.toThrow();
    expect(screen.getByText('테스트 팩트')).toBeInTheDocument();
    expect(screen.getByText('값123')).toBeInTheDocument();
  });
});
