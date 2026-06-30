// Man United shield mark + wordmark — reproduced from design-ref components.jsx Logo
// 방패 SVG는 공용 UnitedShield 컴포넌트로 통합 (Navbar 로고와 중복 제거)
import { UnitedShield } from '@shared/ui';

function FooterLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[34px] h-[34px] flex-none grid place-items-center">
        <UnitedShield />
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
