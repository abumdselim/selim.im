"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LOGO_URL } from "@/lib/constants";
import { navLinks } from "@/lib/constants-supplement";
import { BTN_NAV_CTA, NAV_LINK } from "@/lib/design-system";
import { GENERATED } from "@/lib/generated-assets";
import { InievoIcon } from "@/components/ui/InievoIcon";
import { useDesktopNavLayout } from "@/hooks/useDesktopNavLayout";

type NavbarProps = {
  navTheme?: "light" | "dark";
  solid?: boolean;
};

export function Navbar({ navTheme = "light", solid = false }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktopNav = useDesktopNavLayout();
  const navMode = solid ? "solid" : "scroll";
  const navClass = [
    "inievo-navbar fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
    solid ? "inievo-nav-solid bg-white" : "inievo-nav-scroll-mode",
  ].join(" ");

  const close = () => setMobileOpen(false);

  useEffect(() => {
    if (isDesktopNav) setMobileOpen(false);
  }, [isDesktopNav]);

  return (
    <header
      id="site-navbar"
      className={navClass}
      data-nav-theme={navTheme}
      data-nav-mode={navMode}
    >
      <div className="inievo-navbar-inner max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between relative">
        <Link href="/" onClick={close} className="shrink-0 z-10" scroll={true}>
          <Image
            src={LOGO_URL}
            alt="Inievo"
            width={140}
            height={40}
            className="h-10 w-auto object-contain"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = GENERATED.logo;
            }}
          />
        </Link>

        <nav className="inievo-nav-desktop-nav items-center gap-6 md:gap-8 xl:gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks().map(([label, href]) => (
            <Link key={href} href={href} onClick={close} className={NAV_LINK}>
              {label.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4 z-10">
          <div className="inievo-nav-desktop-cta shrink-0">
            <Link href="/contact" onClick={close} className={BTN_NAV_CTA}>
              Let&apos;s Talk
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inievo-nav-mobile-menu-btn inievo-nav-menu-btn items-center justify-center min-h-[44px] min-w-[44px] p-2 bg-transparent border-0 cursor-pointer rounded-lg hover:bg-slate-100/80 transition-colors text-slate-900"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <InievoIcon name={mobileOpen ? "x" : "menu"} size={30} />
          </button>
        </div>
      </div>

      {mobileOpen && !isDesktopNav && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl px-5 py-5 sm:px-6 sm:py-6 flex flex-col gap-0.5 z-40 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain">
          {navLinks().map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={`${NAV_LINK} !text-sm sm:!text-base text-slate-800 min-h-[50px] py-3 flex items-center border-b border-slate-100 w-full`}
            >
              {label.toUpperCase()}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={close}
            className="mt-5 inline-flex items-center justify-center min-h-[48px] w-full px-7 py-3 text-[15px] font-extrabold tracking-wide text-black bg-[#facc15] rounded-xl hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
          >
            Let&apos;s Talk
          </Link>
        </div>
      )}
    </header>
  );
}
