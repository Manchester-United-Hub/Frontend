import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ArticleRow } from '@pages/newsArticle/ui/ArticleRow';

afterEach(cleanup);

const baseProps = {
  title: '회일룬 결승골',
  description: '후반 추가시간에 터진 극적인 결승골이 팬들을 열광시켰다.',
  link: 'https://news.example.com/a',
  date: '2025.05.18',
};

describe('ArticleRow', () => {
  it('제목·발행일을 렌더하고 외부 원문 링크로 연결한다', () => {
    render(<ArticleRow {...baseProps} />);

    expect(screen.getByRole('heading', { level: 3, name: baseProps.title })).toBeInTheDocument();
    expect(screen.getByText(baseProps.date)).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', baseProps.link);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('본문 발췌를 20자로 잘라 렌더한다', () => {
    render(<ArticleRow {...baseProps} />);

    const excerpt = baseProps.description.slice(0, 20);
    expect(screen.getByText(excerpt)).toBeInTheDocument();
    expect(screen.queryByText(baseProps.description)).not.toBeInTheDocument();
  });
});
