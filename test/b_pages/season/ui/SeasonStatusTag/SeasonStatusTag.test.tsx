/**
 * SeasonStatusTag 전용 테스트(신규) — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * ST-06 신규 컴포넌트(src/b_pages/season/ui/SeasonStatusTag/SeasonStatusTag.tsx).
 * D-6가 확정한 라벨("개막 전"/"시즌 중")은 대상 모듈의 `SEASON_STATUS_LABEL`
 * 상수를 import해 기대값으로 삼지 않는다 — 그렇게 하면 그 상수 자체가
 * 검증되지 않으므로, 기대 문구를 이 파일에 리터럴로 고정한다.
 *
 * 검증 목적: upcoming→"개막 전", ongoing→"시즌 중" 두 상태 모두에서
 * 라벨 텍스트가 DOM에 그대로 노출되는가(색이 아니라 텍스트로 상태가
 * 전달되는가 — a11y, 스크린리더는 색을 읽지 못한다). `aria-hidden`으로
 * 감춰지지 않았는지도 함께 확인한다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SeasonStatusTag } from '@pages/season/ui/SeasonStatusTag';

afterEach(cleanup);

describe('SeasonStatusTag', () => {
  it('status="upcoming"이면 "개막 전" 텍스트가 DOM에 노출된다', () => {
    render(<SeasonStatusTag status="upcoming" />);

    const tag = screen.getByText('개막 전');
    expect(tag).toBeInTheDocument();
    expect(tag).not.toHaveAttribute('aria-hidden');
  });

  it('status="ongoing"이면 "시즌 중" 텍스트가 DOM에 노출된다', () => {
    render(<SeasonStatusTag status="ongoing" />);

    const tag = screen.getByText('시즌 중');
    expect(tag).toBeInTheDocument();
    expect(tag).not.toHaveAttribute('aria-hidden');
  });
});
