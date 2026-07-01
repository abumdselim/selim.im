"use client";



import { useEffect, useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { NAV_LINKS } from "@/lib/navigation";

import { useScrollHeader } from "@/hooks/useScrollHeader";

import MobileNav from "@/components/MobileNav";



export default function Header() {

  const pathname = usePathname();

  const isSubpage = pathname !== "/";

  const scrollScrolled = useScrollHeader();

  const scrolled = isSubpage || scrollScrolled;

  const [menuOpen, setMenuOpen] = useState(false);



  useEffect(() => {

    document.body.classList.toggle("menu-open", menuOpen);

    return () => document.body.classList.remove("menu-open");

  }, [menuOpen]);



  const closeMenu = () => setMenuOpen(false);

  const toggleMenu = () => setMenuOpen((open) => !open);



  if (pathname.startsWith("/studio")) {
    return null;
  }



  return (

    <>

      <header

        className={`top-sticky-header${scrolled ? " scrolled" : ""}${isSubpage ? " always-visible" : ""}`}

        id="header"

      >

        <div className="header-inner">

          <Link href="/" className="top-logo">

            ABU MD. SELIM

          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">

            {NAV_LINKS.map((link) => (

              <a

                key={link.href}

                href={link.href}

                className={link.cta ? "nav-cta" : undefined}

              >

                {link.label}

              </a>

            ))}

          </nav>

          <button

            type="button"

            className={`hamburger${menuOpen ? " active" : ""}`}

            id="hamburger"

            aria-label={menuOpen ? "Close menu" : "Open menu"}

            aria-expanded={menuOpen}

            aria-controls="navMenu"

            onClick={toggleMenu}

          >

            <span />

            <span />

            <span />

          </button>

        </div>

      </header>

      <MobileNav isOpen={menuOpen} onClose={closeMenu} />

    </>

  );

}
