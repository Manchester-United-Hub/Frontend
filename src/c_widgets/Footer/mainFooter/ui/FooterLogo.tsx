// 방패는 공용 BrandShield로 렌더 (Navbar 로고와 공유)
import { BrandShield } from '@shared/ui';

function FooterLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[34px] h-[34px] flex-none grid place-items-center">
        <BrandShield />
      </span>
      <span className="flex flex-col leading-none gap-[3px]">
        <span className="text-[13px] font-extrabold tracking-[0.02em] text-white">
          MANCHESTER UNITED
        </span>
        <span className="text-[10px] font-bold tracking-[0.34em] text-[var(--united-red)]">
          FC&nbsp;HUB
        </span>
      </span>
    </div>
  );
}

export { FooterLogo };
