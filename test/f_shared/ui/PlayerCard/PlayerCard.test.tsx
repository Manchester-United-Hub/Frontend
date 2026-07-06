import type { Route } from 'next';
import Image from 'next/image';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { PlayerCard } from '@shared/ui';

afterEach(cleanup);

describe('PlayerCard', () => {
  it('이름·영문명·포지션을 렌더한다', () => {
    render(
      <PlayerCard name="브루누" nameEn="Bruno" position="MF" status="active" />
    );
    expect(screen.getByText('브루누')).toBeInTheDocument();
    expect(screen.getByText('Bruno')).toBeInTheDocument();
    expect(screen.getByText('MF')).toBeInTheDocument();
  });

  it('status=active는 "현역", retired는 "은퇴"를 표시한다', () => {
    const { rerender } = render(
      <PlayerCard name="A" nameEn="A" position="FW" status="active" />
    );
    expect(screen.getByText('현역')).toBeInTheDocument();
    rerender(<PlayerCard name="A" nameEn="A" position="FW" status="retired" />);
    // "은퇴" 표식은 우상단 Badge가 전담(하단 상태행은 dot+재임 기간만 표시해 중복 방지 — L1 rework).
    expect(screen.getByText('은퇴')).toBeInTheDocument();
  });

  it('photo가 없으면 실루엣 svg(aria-hidden)를 렌더한다', () => {
    const { container } = render(
      <PlayerCard name="A" nameEn="A" position="FW" status="active" />
    );
    expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });

  it('photo 노드를 주면 실루엣 대신 해당 노드를 렌더한다', () => {
    render(
      <PlayerCard
        name="브루누"
        nameEn="Bruno"
        position="MF"
        status="active"
        photo={<Image alt="브루누 사진" src="/bruno.png" width={100} height={100} />}
      />
    );
    expect(screen.getByAltText('브루누 사진')).toBeInTheDocument();
  });

  it('meta가 있으면 함께 표시한다', () => {
    render(
      <PlayerCard
        name="A"
        nameEn="A"
        position="MF"
        status="active"
        meta="2020–현재"
      />
    );
    expect(screen.getByText('· 2020–현재')).toBeInTheDocument();
  });

  it('number가 있으면 포지션 배지에 병기하고 워터마크 숫자를 aria-hidden으로 렌더한다', () => {
    render(
      <PlayerCard name="브루누" nameEn="Bruno" position="MF" status="active" number={8} />
    );
    expect(screen.getByText('MF · 8')).toBeInTheDocument();
    const watermark = screen.getAllByText('8').find(
      (el) => el.getAttribute('aria-hidden') === 'true'
    );
    expect(watermark).toBeDefined();
  });

  it('number가 없으면 포지션 배지·워터마크 병기를 렌더하지 않는다', () => {
    render(<PlayerCard name="A" nameEn="A" position="FW" status="active" />);
    expect(screen.getByText('FW')).toBeInTheDocument();
    expect(screen.queryByText(/FW ·/)).toBeNull();
  });

  it('status=retired면 우상단 은퇴 Badge를 렌더하고, 하단 상태행에는 "은퇴" 단어를 중복 표시하지 않는다', () => {
    render(<PlayerCard name="A" nameEn="A" position="FW" status="retired" />);
    expect(screen.getAllByText('은퇴')).toHaveLength(1);
  });

  it('status=retired + meta(재임 기간)면 하단 상태행이 dot과 함께 meta(연도)를 표시한다', () => {
    render(
      <PlayerCard
        name="A"
        nameEn="A"
        position="FW"
        status="retired"
        meta="2004–2017"
      />
    );
    expect(screen.getByText('2004–2017')).toBeInTheDocument();
    expect(screen.queryByText('· 2004–2017')).toBeNull();
    expect(screen.getAllByText('은퇴')).toHaveLength(1);
  });

  it('status=active면 은퇴 Badge를 렌더하지 않는다', () => {
    render(<PlayerCard name="A" nameEn="A" position="FW" status="active" />);
    expect(screen.getAllByText('현역')).toHaveLength(1);
    expect(screen.queryByText('은퇴')).toBeNull();
  });

  it('flag+nationality가 있으면 국적 메타 행을 렌더한다', () => {
    render(
      <PlayerCard
        name="브루누"
        nameEn="Bruno"
        position="MF"
        status="active"
        nationality="포르투갈"
        flag={<span aria-hidden="true">🇵🇹</span>}
      />
    );
    expect(screen.getByText('포르투갈')).toBeInTheDocument();
    expect(screen.getByText('🇵🇹')).toHaveAttribute('aria-hidden', 'true');
  });

  it('nationality만 있고 flag가 없으면 국적 메타 행을 렌더하지 않는다', () => {
    render(
      <PlayerCard name="A" nameEn="A" position="FW" status="active" nationality="잉글랜드" />
    );
    expect(screen.queryByText('잉글랜드')).toBeNull();
  });

  it('href가 있으면 카드 전체가 링크(next/link)로 렌더된다', () => {
    render(
      <PlayerCard
        name="브루누"
        nameEn="Bruno"
        position="MF"
        status="active"
        href={'/player/details' as Route}
      />
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', '/player/details');
  });

  it('href가 없으면 링크가 아닌 div로 렌더된다', () => {
    render(<PlayerCard name="A" nameEn="A" position="FW" status="active" />);
    expect(screen.queryByRole('link')).toBeNull();
  });
});
