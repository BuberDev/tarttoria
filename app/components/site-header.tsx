"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";

type Contact = {
  phoneHref: string;
};

type NavItem = {
  label: string;
  href: string;
};

type SiteHeaderProps = {
  contact: Contact;
  navItems: NavItem[];
};

export function SiteHeader({ contact, navItems }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) setIsOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 text-white transition-all duration-500 ease-in-out",
          scrolled
            ? "border-b border-white/10 bg-[#171615]/92 shadow-lg backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <nav
          className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-3 px-4 pr-16 sm:px-6 lg:h-24 lg:px-8"
          aria-label="Glowna nawigacja"
        >
          <a
            href="#start"
            className="group flex min-w-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b46f]"
            onClick={close}
          >
            <span className="shrink-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <Image
                src="/logo-white.png"
                alt="Tarttoria"
                width={1291}
                height={624}
                className="h-14 w-auto object-contain lg:h-16"
                priority
              />
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-white/80 transition-colors duration-200 hover:text-[#d9b46f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b46f]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={contact.phoneHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d9b46f]/45 px-4 py-2.5 text-sm font-bold text-[#d9b46f] transition duration-200 hover:border-[#d9b46f] hover:bg-[#d9b46f]/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b46f]"
            >
              <Phone className="size-4" />
              Zadzwoń
            </a>
            <a
              href="#kontakt"
              className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-white px-5 py-2.5 text-sm font-bold text-[#171615] shadow-[0_8px_24px_rgba(23,22,21,0.22)] transition duration-200 hover:bg-[#f2e6d2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b46f]"
            >
              Zamów / Kontakt
            </a>
          </div>

          <button
            type="button"
            className="absolute right-4 top-1/2 z-[70] flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-[8px] border border-[#d9b46f]/45 bg-[#2b2926] shadow-[0_8px_24px_rgba(23,22,21,0.34)] transition duration-200 hover:bg-[#38322c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b46f] sm:right-6 lg:hidden"
            aria-label={isOpen ? "Zamknij menu" : "Otworz menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
            onClick={() => setIsOpen((value) => !value)}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
                  isOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
                  isOpen ? "scale-x-0 opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${
                  isOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      <div
        aria-hidden="true"
        onClick={close}
        className={[
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out lg:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu nawigacyjne"
        className={[
          "fixed right-0 top-0 z-[65] flex h-full w-[min(320px,85vw)] flex-col border-l border-white/10 bg-[#171615]/96 shadow-[-24px_0_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-transform duration-400 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <a href="#start" onClick={close} className="shrink-0">
            <Image
              src="/logo-white.png"
              alt="Tarttoria"
              width={1291}
              height={624}
              className="h-14 w-auto object-contain"
            />
          </a>
          <button
            type="button"
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/15 text-white/70 transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b46f]"
            aria-label="Zamknij menu"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M2 2l12 12M14 2L2 14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Menu mobilne" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 rounded-[8px] px-4 py-3.5 text-base font-semibold text-white/78 transition-colors duration-150 hover:bg-white/8 hover:text-[#d9b46f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9b46f]"
                  onClick={close}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9b46f]/70" aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mx-4 my-4 h-px bg-white/8" />

          <div className="flex flex-col gap-3 px-1">
            <a
              href={contact.phoneHref}
              className="flex items-center justify-center gap-2 rounded-[8px] border border-[#d9b46f]/40 px-4 py-3.5 text-sm font-bold text-[#d9b46f] transition hover:border-[#d9b46f] hover:bg-[#d9b46f]/12"
              onClick={close}
            >
              <Phone className="size-4" />
              Zadzwoń teraz
            </a>
            <a
              href="#kontakt"
              className="flex items-center justify-center rounded-[8px] bg-white px-4 py-3.5 text-sm font-bold text-[#171615] shadow-[0_8px_24px_rgba(23,22,21,0.30)] transition hover:bg-[#f2e6d2]"
              onClick={close}
            >
              Zamów / Kontakt
            </a>
          </div>
        </nav>

        <div className="border-t border-white/8 px-5 py-4">
          <p className="text-center text-xs text-white/42">
            Tarttoria · Nowy Sącz
          </p>
        </div>
      </div>
    </>
  );
}
