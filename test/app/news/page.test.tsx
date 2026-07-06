import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import News from '@app/news/page';

afterEach(cleanup);

describe('news route page', () => {
  it('뉴스 기사 페이지(main + 제목 + 기사 목록)를 렌더한다', async () => {
    const { container } = render(<News />);

    expect(container.querySelector('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '기사' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0), {
      timeout: 2000,
    });
  });
});
