import { Button } from '@shared/ui';
import { Menu } from 'lucide-react';

function BurgerButton() {
  return (
    <Button
      mode="icon"
      variant="ghost"
      aria-label="메뉴 열기"
      className="min-[861px]:hidden"
    >
      <Menu size={20} aria-hidden />
    </Button>
  );
}

export { BurgerButton };
