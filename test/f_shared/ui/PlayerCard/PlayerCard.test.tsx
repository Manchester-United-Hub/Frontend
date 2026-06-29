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
        photo={<img alt="브루누 사진" src="bruno.png" />}
      />
    );
    expect(screen.getByAltText('브루누 사진')).toBeInTheDocument();
  });
});
