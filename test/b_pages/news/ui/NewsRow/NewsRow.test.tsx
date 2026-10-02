import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { NewsRow } from '@pages/news/ui/NewsRow';

afterEach(cleanup);

const baseProps = {
  title: '회일룬 결승골',
  description: '후반 추가시간에 터진 극적인 결승골이 팬들을 열광시켰다.',
  link: 'https://news.example.com/a',
  date: '2025.05.18',
  source: '네이버 스포츠',
};

describe('NewsRow', () => {
  it('제목·발행일을 렌더하고 외부 원문 링크로 연결한다', () => {
    render(<NewsRow {...baseProps} />);

    expect(screen.getByRole('heading', { level: 3, name: baseProps.title })).toBeInTheDocument();
    expect(screen.getByText(baseProps.date)).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', baseProps.link);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('본문을 두 줄로 clamp해 노출한다(전문 렌더, CSS로 말줄임)', () => {
    render(<NewsRow {...baseProps} />);

    const body = screen.getByText(baseProps.description);
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass('line-clamp-2');
  });

  it('출처·구분점·발행일을 메타 줄에 렌더한다', () => {
    render(<NewsRow {...baseProps} />);

    expect(screen.getByText(baseProps.source)).toBeInTheDocument();
    expect(screen.getByText('·')).toBeInTheDocument();
    expect(screen.getByText(baseProps.date)).toBeInTheDocument();
  });

  it('source가 빈 문자열이면 구분점(·)도 렌더하지 않는다', () => {
    render(<NewsRow {...baseProps} source="" />);

    expect(screen.queryByText('·')).not.toBeInTheDocument();
    expect(screen.getByText(baseProps.date)).toBeInTheDocument();
  });

  it('포커스 링을 inset으로 그려 카드의 overflow-hidden에 잘리지 않는다', () => {
    render(<NewsRow {...baseProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus-visible:ring-inset');
    expect(link).not.toHaveClass('focus-visible:ring-offset-2');
  });
});
