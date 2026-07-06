import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ArticleCard, NEWS_DEFAULT_IMAGE } from '@pages/newsArticle/ui/ArticleCard';

afterEach(cleanup);

const baseProps = {
  title: '회일룬 결승골',
  description: '후반 추가시간 결승골.',
  link: 'https://news.example.com/a',
  date: '2025.05.18',
};

describe('ArticleCard', () => {
  it('제목·본문·발행일을 렌더하고 외부 원문 링크로 연결한다', () => {
    render(<ArticleCard {...baseProps} />);

    expect(screen.getByRole('heading', { level: 3, name: '회일룬 결승골' })).toBeInTheDocument();
    expect(screen.getByText('후반 추가시간 결승골.')).toBeInTheDocument();
    expect(screen.getByText('2025.05.18')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', baseProps.link);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('imageUrl이 있으면 해당 사진을 사용한다', () => {
    render(<ArticleCard {...baseProps} imageUrl="https://img.example.com/p.jpg" />);

    expect(document.querySelector('img')).toHaveAttribute('src', 'https://img.example.com/p.jpg');
  });

  it('imageUrl이 없으면 기본 이미지를 사용한다', () => {
    render(<ArticleCard {...baseProps} />);

    expect(document.querySelector('img')).toHaveAttribute('src', NEWS_DEFAULT_IMAGE);
  });

  it('이미지 로딩 실패 시 기본 이미지로 폴백하고, 반복 실패에도 안전하다', () => {
    render(<ArticleCard {...baseProps} imageUrl="https://img.example.com/broken.jpg" />);
    const img = document.querySelector('img') as HTMLImageElement;

    fireEvent.error(img);
    fireEvent.error(img);

    expect(img).toHaveAttribute('src', NEWS_DEFAULT_IMAGE);
  });
});
