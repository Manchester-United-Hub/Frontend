import { NAV_ITEMS } from './model/configs';
import { BurgerButton, LogoBlock, NavLinkItem } from './ui';

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/86 backdrop-blur-[10px] backdrop-saturate-[1.4] border-b border-border">
      <div className="max-w-300 mx-auto px-6 flex items-center gap-7 h-16">
        <LogoBlock />
        <nav
          aria-label="주요 메뉴"
          className="hidden min-[861px]:flex items-center gap-0.5 ml-1.5"
        >
          {NAV_ITEMS.map((item) => (
            <NavLinkItem key={item.id} item={item} />
          ))}
        </nav>
        <span className="flex-1" aria-hidden="true" />
        {/* <div className="hidden min-[861px]:flex">
          <SearchBox />
        </div> */}
        <BurgerButton />
      </div>
    </header>
  );
}

export { Navbar };
