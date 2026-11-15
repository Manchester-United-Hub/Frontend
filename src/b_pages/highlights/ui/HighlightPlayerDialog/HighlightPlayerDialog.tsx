'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';

import { Button } from '@shared/ui';

const AUTOPLAY_PARAM = 'autoplay';
const YOUTUBE_IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

// 사용자가 재생 버튼을 눌러 연 모달이라 한 번 더 누르지 않아도 재생되게 한다.
const toAutoplayUrl = (embedUrl: string): string => {
  const url = new URL(embedUrl);
  url.searchParams.set(AUTOPLAY_PARAM, '1');
  return url.toString();
};

interface HighlightPlayerDialogProps {
  title: string;
  embedUrl: string;
  onClose: () => void;
}

function HighlightPlayerDialog({ title, embedUrl, onClose }: HighlightPlayerDialogProps) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-foreground/70" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl overflow-hidden rounded-lg bg-card shadow-lg">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <DialogTitle className="line-clamp-1 text-base font-bold">{title}</DialogTitle>
            <Button mode="icon" variant="ghost" aria-label="닫기" onClick={onClose}>
              <X size={18} aria-hidden="true" />
            </Button>
          </div>

          <div className="aspect-video bg-foreground">
            <iframe
              src={toAutoplayUrl(embedUrl)}
              title={title}
              allow={YOUTUBE_IFRAME_ALLOW}
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export { HighlightPlayerDialog };
export type { HighlightPlayerDialogProps };
