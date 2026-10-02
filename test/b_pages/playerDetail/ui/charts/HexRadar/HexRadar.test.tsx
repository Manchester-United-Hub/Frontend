/**
 * HexRadar 단위 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 필수 시나리오 #5: 차트 접근성(role=img + aria-label).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HexRadar } from '@pages/playerDetail/ui/charts/HexRadar';

afterEach(cleanup);

const DATA = [
  { k: '슈팅', v: 82 },
  { k: '패스', v: 88 },
  { k: '드리블', v: 80 },
  { k: '스피드', v: 74 },
  { k: '수비', v: 66 },
  { k: '피지컬', v: 75 },
];

describe('HexRadar', () => {
  it('role=img + 축별 라벨·값을 포함한 aria-label로 렌더된다', () => {
    render(<HexRadar data={DATA} />);
    const chart = screen.getByRole('img');
    expect(chart.tagName.toLowerCase()).toBe('svg');
    DATA.forEach((point) => {
      expect(chart).toHaveAccessibleName(new RegExp(`${point.k} ${point.v}`));
    });
  });

  it('6개 축 모두 라벨 텍스트를 렌더한다', () => {
    render(<HexRadar data={DATA} />);
    DATA.forEach((point) => {
      expect(screen.getByText(point.k)).toBeInTheDocument();
    });
  });

  it('GK 6축(반응·핸들링·킥력·위치선정·민첩성·공중장악)도 동일하게 렌더된다', () => {
    const gkData = [
      { k: '반응', v: 85 },
      { k: '핸들링', v: 82 },
      { k: '킥력', v: 86 },
      { k: '위치선정', v: 83 },
      { k: '민첩성', v: 84 },
      { k: '공중장악', v: 80 },
    ];
    render(<HexRadar data={gkData} />);
    gkData.forEach((point) => {
      expect(screen.getByText(point.k)).toBeInTheDocument();
    });
  });

  it('경계값: 7번째 이상 축(라벨 앵커 테이블 범위 밖)이 있어도 에러 없이 렌더되고, 초과 축은 라벨을 생략한다', () => {
    const overflowData = [
      { k: 'a', v: 50 },
      { k: 'b', v: 50 },
      { k: 'c', v: 50 },
      { k: 'd', v: 50 },
      { k: 'e', v: 50 },
      { k: 'f', v: 50 },
      { k: 'g', v: 50 },
    ];
    render(<HexRadar data={overflowData} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    // 처음 6개 라벨은 렌더되고, 7번째('g')는 HEX_LBL 앵커가 없어 생략된다.
    for (const point of overflowData.slice(0, 6)) {
      expect(screen.getByText(point.k)).toBeInTheDocument();
    }
    expect(screen.queryByText('g')).not.toBeInTheDocument();
  });
});
