/**
 * EmptyTab 전용 테스트 — QA 커버리지 갭 메우기(qa-coverage).
 *
 * 검증 목적:
 * - "{label} 준비 중이에요" 타이틀 + StateBox description + 알림 받기 버튼 렌더
 * - EMPTY_ICON_MAP에 없는 icon name을 주입했을 때 폴백 아이콘으로 대체되어
 *   크래시 없이 렌더되는가(EmptyTab.tsx:40 미도달 분기)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { EmptyTab } from '@pages/clubInfo/ui/EmptyTab';
import { emptyTabCopy } from '@pages/clubInfo/model/mockData';
import type { EmptyTabCopy } from '@pages/clubInfo/model/types';

afterEach(cleanup);

describe('EmptyTab', () => {
  it('"{label} 준비 중이에요" 제목·설명·알림 받기 버튼을 렌더한다', () => {
    render(<EmptyTab label="하이라이트" copy={emptyTabCopy.highlights} />);

    expect(screen.getByRole('heading', { name: '하이라이트 준비 중이에요' })).toBeInTheDocument();
    expect(screen.getByText(emptyTabCopy.highlights.desc)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /업데이트되면 알림 받기/ })).toBeInTheDocument();
  });

  it('copy.icon이 매핑에 없으면 폴백 아이콘으로 대체되어 크래시 없이 렌더된다', () => {
    const unknownCopy: EmptyTabCopy = { icon: 'NotARealIcon', desc: '설명 텍스트' };
    expect(() => render(<EmptyTab label="테스트탭" copy={unknownCopy} />)).not.toThrow();
    expect(screen.getByRole('heading', { name: '테스트탭 준비 중이에요' })).toBeInTheDocument();
    expect(screen.getByText('설명 텍스트')).toBeInTheDocument();
  });
});
