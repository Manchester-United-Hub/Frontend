/**
 * MatchStripGrid 단위 테스트.
 *
 * 검증 목적:
 * - recent(past)·next(next) 카드 2장 렌더
 * - recent는 스코어, next는 VS 표기
 * - next.time 유무에 따른 날짜 문자열 분기
 * - next.countdown 유무에 따른 Badge 분기
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { MatchStripGrid } from '@pages/landing/ui/MatchStripSection/MatchStripGrid';
import { recentMatch, nextMatch } from '@pages/landing/model/mockData';
import type { MatchItem } from '@pages/landing/model/types';

afterEach(cleanup);

describe('MatchStripGrid', () => {
  it('최근 경기·다음 경기 카드를 함께 렌더한다', () => {
    const { container } = render(
      <MatchStripGrid recent={recentMatch} next={nextMatch} />
    );

    expect(container.textContent).toContain('최근 경기');
    expect(container.textContent).toContain('다음 경기');
    expect(container.textContent).toContain('에버턴');
    expect(container.textContent).toContain('리버풀');
  });

  it('최근 경기는 스코어를, 다음 경기는 VS를 표기한다', () => {
    const { container } = render(
      <MatchStripGrid recent={recentMatch} next={nextMatch} />
    );

    expect(container.textContent).toContain('2–1');
    expect(container.textContent).toContain('VS');
  });

  it('next.time이 있으면 날짜 뒤에 시간을 붙인다', () => {
    const { container } = render(
      <MatchStripGrid recent={recentMatch} next={nextMatch} />
    );

    expect(container.textContent).toContain('5월 18일 (일) 23:30 KST');
  });

  it('next.countdown이 있으면 카운트다운 Badge를 렌더한다', () => {
    const { container } = render(
      <MatchStripGrid recent={recentMatch} next={nextMatch} />
    );

    expect(container.textContent).toContain('D-3');
  });

  it('next.time·countdown이 없으면 날짜만 표기하고 Badge를 렌더하지 않는다', () => {
    const nextWithoutTime: MatchItem = {
      variant: 'next',
      tag: '다음 경기',
      competition: '프리미어리그 · 33R',
      home: { code: 'MUN', name: '맨체스터 유나이티드', highlight: true },
      away: { code: 'ARS', name: '아스널' },
      venue: '에미레이츠',
      date: '5월 25일 (일)',
    };

    const { container } = render(
      <MatchStripGrid recent={recentMatch} next={nextWithoutTime} />
    );

    expect(container.textContent).toContain('5월 25일 (일)');
    expect(container.textContent).not.toContain('KST');
    expect(container.textContent).not.toContain('D-3');
  });
});
