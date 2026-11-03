"use client";

import Image from "next/image";
import Link from "next/link";
import {
  footerColumns,
  legalLinks,
  siteConfig,
  socialLinks,
} from "@/content/site";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer() {
  return (
    <footer className="rounded-t-section relative flex min-h-[43.75rem] flex-col overflow-hidden bg-gradient-to-b from-paper to-blush pt-8 pb-[48vw] lg:pb-[32vw]">
      {/* One grid so the nav columns and the legal links share the right-hand column:
          the auto-width column is as wide as the legal row, and the nav columns start at
          its left edge, so their left margin matches "Privacy Policy". */}
      <div className="relative z-10 shell grid gap-10 lg:grid-cols-[1fr_auto]">
          <div className="flex max-w-sm flex-col gap-5 lg:items-start">
            <Link href="/" aria-label="Pujo Go home" className="flex items-center gap-3">
              <Image
                src="/Images/logo/logo.png"
                alt=""
                width={1182}
                height={1181}
                sizes="(min-width: 1600px) 2.125vw, 34px"
                className="size-[2.125rem] rounded-full"
              />
              <span className="font-jakarta text-3xl font-black uppercase leading-none tracking-tighter text-ink">
                PUJO <span className="text-accent">GO</span>
              </span>
            </Link>

            <p className="text-base text-muted/80">{siteConfig.tagline}</p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center text-ink transition-transform duration-200 hover:scale-105"
                >
                  <SocialIcon name={social.icon} className="h-10 w-10" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16 lg:justify-self-start">
            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h2 className="text-eyebrow text-ink">{column.title}</h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-base text-muted/80 transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row: copyright on the left, legal links on the same line on the right */}
          <p className="font-legal text-sm text-muted lg:self-center">
            © {new Date().getFullYear()} PujoGo. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:self-center">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-legal text-sm text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
      </div>

      {/* Grounding image: bleeds full-width, absolutely pinned to the footer's bottom edge
          so it always reaches the true bottom of the page. Sized by its own aspect ratio
          (not object-cover) so the illustration is never cropped. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 w-full">
        <Image
          src="/Images/footer-image.avif"
          alt=""
          width={1808}
          height={870}
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>
    </footer>
  );
}
