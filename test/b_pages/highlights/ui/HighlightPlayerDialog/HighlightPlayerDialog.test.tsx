import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { HighlightPlayerDialog } from '@pages/highlights/ui/HighlightPlayerDialog';

afterEach(cleanup);

const baseProps = {
  title: 'Man Utd 0-3 Bournemouth | Highlights',
  embedUrl: 'https://www.youtube.com/embed/wwFPqhC51oY',
  onClose: vi.fn(),
};

const getIframe = () => screen.getByTitle(baseProps.title);

describe('HighlightPlayerDialog', () => {
  it('영상 제목을 이름으로 갖는 dialog를 렌더한다', async () => {
    render(<HighlightPlayerDialog {...baseProps} />);

    expect(await screen.findByRole('dialog', { name: baseProps.title })).toBeInTheDocument();
  });

  it('embedUrl에 autoplay=1을 붙여 iframe으로 재생한다', async () => {
    render(<HighlightPlayerDialog {...baseProps} />);
    await screen.findByRole('dialog');

    const iframe = getIframe();
    expect(iframe.tagName).toBe('IFRAME');
    expect(iframe).toHaveAttribute('src', `${baseProps.embedUrl}?autoplay=1`);
    expect(iframe).toHaveAttribute('allowfullscreen');
    expect(iframe.getAttribute('allow')).toContain('autoplay');
  });

  it('embedUrl에 쿼리가 이미 있으면 유지하고 autoplay만 추가한다', async () => {
    render(<HighlightPlayerDialog {...baseProps} embedUrl={`${baseProps.embedUrl}?rel=0`} />);
    await screen.findByRole('dialog');

    expect(getIframe()).toHaveAttribute('src', `${baseProps.embedUrl}?rel=0&autoplay=1`);
  });

  it('닫기 버튼을 누르면 onClose를 호출한다', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HighlightPlayerDialog {...baseProps} onClose={onClose} />);

    await user.click(await screen.findByRole('button', { name: '닫기' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('Escape 키를 누르면 onClose를 호출한다', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<HighlightPlayerDialog {...baseProps} onClose={onClose} />);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });
});
