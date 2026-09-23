"use client";
import { DHAK } from "@/lib/motion";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { PlayStoreIcon } from "@/components/ui/StoreIcons";
import { navCta, navLinks } from "@/content/site";

/**
 * Fixed floating navbar.
 *
 * The hover effect reproduces the source exactly: each link renders its label
 * twice inside an overflow-hidden box. On hover the original slides up and out
 * while its duplicate rises from below to take its place.
 */
function SlideLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative flex h-10 items-center justify-center overflow-hidden px-5 font-jakarta text-[17px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="relative block">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-[140%]">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-[140%] transition-transform duration-300 ease-out group-hover:translate-y-0"
        >
          {label}
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Turn glassy as soon as the page has scrolled at all.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // GSAP Appear Animation ("The Dhak Beat" sync)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (prefersReduced.matches) return;

      const from = { opacity: 0, y: -20, scale: 0.95 };
      const to = { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" };

      const tl = gsap.timeline({ delay: 0.2 });

      // All elements hit at the same beat — no stagger
      if (logoRef.current) tl.fromTo(logoRef.current, { ...from }, { ...to }, 0);
      if (linksContainerRef.current) tl.fromTo(linksContainerRef.current, { ...from }, { ...to }, 0);
      if (ctaRef.current) tl.fromTo(ctaRef.current, { ...from }, { ...to }, 0);
      if (triggerRef.current) tl.fromTo(triggerRef.current, { ...from }, { ...to }, 0);
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 pt-0 transition-colors duration-300 md:pt-4 ${
        scrolled ? "bg-black/30 backdrop-blur-lg backdrop-saturate-150" : "bg-transparent"
      }`}
    >
      <nav className="shell flex h-[68px] items-center justify-between gap-6 md:h-[66px]">
        <Link
          ref={logoRef}
          href="/#hero"
          aria-label="Pujo Go home"
          className="flex h-control items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/pujogo-logo.webp"
            alt=""
            width={1182}
            height={1181}
            sizes="34px"
            loading="eager"
            fetchPriority="high"
            className="size-[34px] rounded-full"
          />
          <span className="font-jakarta text-2xl font-bold tracking-tight text-white">
            PUJO <span className="text-accent">GO</span>
          </span>
        </Link>

        {/* Desktop links — the source shows these from 810px up */}
        <div ref={linksContainerRef} className="hidden items-center gap-4 lg:flex">
          {navLinks.map((link) => (
            <SlideLink key={link.href} {...link} />
          ))}
        </div>

        <Link
          ref={ctaRef}
          href={navCta.href}
          className="hidden h-control items-center gap-2.5 rounded-full bg-accent px-7 font-jakarta text-[15px] font-semibold text-white shadow-[0_10px_26px_-4px_rgba(254,0,0,0.35)] transition-transform duration-200 hover:scale-[1.03] lg:inline-flex"
        >
          <PlayStoreIcon className="size-icon shrink-0" />
          {navCta.label}
        </Link>

        {/* Mobile trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-control w-control flex-col items-center justify-center gap-[7px] rounded-full border border-soft bg-surface lg:hidden"
        >
          <span
            className={`block h-[3px] w-6 rounded-sm bg-ink transition-transform duration-300 ${
              open ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[3px] w-6 rounded-sm bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={DHAK}
            className="mx-4 rounded-card border border-soft bg-surface p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] lg:hidden"
          >
            <ul className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-jakarta text-2xl font-bold text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={navCta.href}
              onClick={() => setOpen(false)}
              className="mt-8 flex h-control w-full items-center justify-center gap-2.5 rounded-full bg-accent font-jakarta text-[15px] font-semibold text-white"
            >
              <PlayStoreIcon className="size-icon shrink-0" />
              {navCta.label}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
