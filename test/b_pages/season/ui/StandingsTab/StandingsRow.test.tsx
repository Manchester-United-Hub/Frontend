/**
 * StandingsRow 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: utd 행 강조(배경·팀명 굵게), 득실차 부호/색 분기(양수=win·음수=
 * united-red), 승점 렌더, 최근 5경기 폼 배지 5개, zone별 posbar 색
 * (ucl→bg-win·releg→bg-united-red·uel/conf→raw hex style·''→투명).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StandingsRow } from '@pages/season/ui/StandingsTab/StandingsRow';
import { standings } from '@pages/season/model';
import type { Standing } from '@pages/season/model';

afterEach(cleanup);

function renderRow(standing: Standing) {
  return render(
    <table>
      <tbody>
        <StandingsRow standing={standing} />
      </tbody>
    </table>
  );
}

describe('StandingsRow', () => {
  it('utd 행은 강조 배경 클래스, 팀명은 굵게 렌더된다', () => {
    const mun = standings.find((s) => s.utd)!;
    const { container } = renderRow(mun);
    expect(container.querySelector('tr')).toHaveClass('bg-united-red/6');
    expect(screen.getByText(mun.nm)).toHaveClass('font-bold');
  });

  it('utd가 아닌 행은 팀명이 font-medium(굵지 않음)으로 렌더된다', () => {
    const other = standings.find((s) => !s.utd)!;
    renderRow(other);
    expect(screen.getByText(other.nm)).toHaveClass('font-medium');
  });

  it('득실차가 양수면 "+" 부호와 win 색으로 렌더된다', () => {
    const positive = standings.find((s) => s.gf - s.ga > 0)!;
    renderRow(positive);
    const gd = positive.gf - positive.ga;
    expect(screen.getByText(`+${gd}`)).toHaveClass('text-win');
  });

  it('득실차가 음수면 united-red 색으로 렌더된다(부호는 숫자 자체의 "-")', () => {
    const negative = standings.find((s) => s.gf - s.ga < 0)!;
    renderRow(negative);
    const gd = negative.gf - negative.ga;
    expect(screen.getByText(`${gd}`)).toHaveClass('text-united-red');
  });

  it('득실차가 0이면 색상 강조 클래스 없이 렌더된다(gf===ga, mock 데이터에는 없는 방어 케이스)', () => {
    const evenGoalDiff: Standing = { ...standings[0], gf: 30, ga: 30 };
    renderRow(evenGoalDiff);
    const gdCell = screen.getByText('0');
    expect(gdCell.className).not.toMatch(/text-win|text-united-red/);
  });

  it('승점을 렌더한다', () => {
    const standing = standings[0];
    renderRow(standing);
    expect(screen.getByText(String(standing.pts))).toBeInTheDocument();
  });

  it('최근 5경기 폼 배지 5개를 렌더한다', () => {
    const standing = standings[0];
    renderRow(standing);
    const formList = screen.getByRole('list', { name: '최근 5경기 결과' });
    expect(within(formList).getAllByRole('img')).toHaveLength(5);
  });

  it('zone=ucl(챔피언스리그)은 posbar가 bg-win 클래스를 갖는다', () => {
    const uclStanding = standings.find((s) => s.zone === 'ucl')!;
    const { container } = renderRow(uclStanding);
    expect(container.querySelector('span.absolute')).toHaveClass('bg-win');
  });

  it('zone=releg(강등권)는 posbar가 bg-united-red 클래스를 갖는다', () => {
    const relegStanding = standings.find((s) => s.zone === 'releg')!;
    const { container } = renderRow(relegStanding);
    expect(container.querySelector('span.absolute')).toHaveClass('bg-united-red');
  });

  it('zone=""(무존)은 posbar에 배경 클래스/style이 없다(투명)', () => {
    const noZoneStanding = standings.find((s) => s.zone === '')!;
    const { container } = renderRow(noZoneStanding);
    const posbar = container.querySelector('span.absolute')!;
    expect(posbar.className).not.toMatch(/bg-/);
    expect(posbar).not.toHaveAttribute('style');
  });

  it('zone=uel/conf는 raw hex 인라인 style로 렌더된다(대응 토큰 부재)', () => {
    const uelStanding = standings.find((s) => s.zone === 'uel')!;
    const { container } = renderRow(uelStanding);
    expect(container.querySelector('span.absolute')).toHaveStyle({ backgroundColor: '#2a6fdb' });
  });
});
