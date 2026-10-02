import Image from 'next/image';
import { cn } from '@shared/utils';

const BRAND_SHIELD_SRC = '/brand/mu-hub-stage-shield.svg';
const BRAND_SHIELD_WIDTH = 240;
const BRAND_SHIELD_HEIGHT = 256;
const DEFAULT_CLASS_NAME = 'h-[34px] w-auto';

interface BrandShieldProps {
  className?: string;
}

function BrandShield({ className }: BrandShieldProps) {
  return (
    <Image
      src={BRAND_SHIELD_SRC}
      width={BRAND_SHIELD_WIDTH}
      height={BRAND_SHIELD_HEIGHT}
      alt=""
      aria-hidden="true"
      unoptimized
      className={cn(DEFAULT_CLASS_NAME, className)}
    />
  );
}

export { BrandShield };
export type { BrandShieldProps };
