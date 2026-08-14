import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { NewsHeadSection } from '@pages/news/ui/NewsHeadSection';

afterEach(cleanup);

describe('NewsHeadSection', () => {
  it('제목과 에이브로우 문구를 렌더한다', () => {
    render(<NewsHeadSection />);

    expect(screen.getByRole('heading', { level: 1, name: '기사' })).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
  });
});
