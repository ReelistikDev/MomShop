"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-provider";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon } from "@/components/icons";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      {/* Announcement strip — scrolls away */}
      <div className="bg-twilight text-cream/95">
        <Container>
          <p className="flex items-center justify-center gap-2.5 py-2 text-center text-[0.72rem] font-medium uppercase tracking-[0.16em]">
            <span>Handmade with love</span>
            <HeartIcon className="h-3 w-3 text-heart" />
            <span className="hidden sm:inline">New shop opening soon</span>
          </p>
        </Container>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-line bg-cream/85 shadow-soft backdrop-blur-md"
            : "border-b border-transparent bg-cream/60 backdrop-blur-sm"
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
            {/* Left: mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="-ml-2 rounded-full p-2 text-ink transition-colors hover:bg-shell lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon />
            </button>

            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5 lg:flex-1"
              aria-label={`${BRAND.name} home`}
            >
              <Logo
                variant="mark"
                priority
                sizes="56px"
                className="h-11 w-11 lg:h-14 lg:w-14"
              />
              <span className="font-serif text-xl tracking-tight text-ink lg:text-[1.4rem]">
                {BRAND.name}
              </span>
            </Link>

            {/* Center nav (desktop) */}
            <nav className="hidden items-center gap-8 lg:flex">
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative text-[0.95rem] text-stone transition-colors hover:text-ink",
                      active && "text-ink"
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-oak-dark transition-transform duration-300",
                        active && "scale-x-100"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Cart */}
            <div className="flex items-center justify-end gap-2 lg:flex-1">
              <button
                type="button"
                onClick={openCart}
                className="relative rounded-full p-2 text-ink transition-colors hover:bg-shell"
                aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              >
                <BagIcon />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sage px-1 text-[0.62rem] font-semibold text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] overflow-hidden lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-0 top-0 origin-top bg-cream px-6 pb-8 pt-5 shadow-lift transition-all duration-300",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2.5">
              <Logo variant="mark" sizes="44px" className="h-11 w-11" />
              <span className="font-serif text-xl text-ink">{BRAND.name}</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full p-2 text-ink hover:bg-shell"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line py-4 font-serif text-2xl text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
