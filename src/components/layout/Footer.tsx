"use client";

import Image from "next/image";
import Link from "next/link";
import {
  footerColumns,
  legalLinks,
  siteConfig,
  socialLinks,
} from "@/content/site";

const iconPaths: Record<string, string> = {
  instagram:
    "M176 24H80a56.06 56.06 0 0 0-56 56v96a56.06 56.06 0 0 0 56 56h96a56.06 56.06 0 0 0 56-56V80a56.06 56.06 0 0 0-56-56Zm-48 152a48 48 0 1 1 48-48 48.05 48.05 0 0 1-48 48Zm60-96a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm-28 48a32 32 0 1 1-32-32 32 32 0 0 1 32 32Z",
  facebook:
    "M232 128a104.16 104.16 0 0 1-91.55 103.26 4 4 0 0 1-4.45-4V152h24a8 8 0 0 0 8-8.53 8.17 8.17 0 0 0-8.25-7.47H136v-24a16 16 0 0 1 16-16h16a8 8 0 0 0 8-8.53 8.17 8.17 0 0 0-8.27-7.47H152a32 32 0 0 0-32 32v24H96a8 8 0 0 0-8 8.53 8.17 8.17 0 0 0 8.27 7.47H120v75.28a4 4 0 0 1-4.44 4 104.15 104.15 0 0 1-91.49-107.19c2-54 45.74-97.9 99.78-100A104.12 104.12 0 0 1 232 128Z",
  twitter:
    "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3l13.31 17.403Z",
};

export function Footer() {
  return (
    <footer className="rounded-t-section relative flex min-h-[700px] flex-col overflow-hidden bg-gradient-to-b from-paper to-blush pt-8 pb-[48vw] lg:pb-[32vw]">
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
                sizes="34px"
                className="size-[34px] rounded-full"
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
                  <svg viewBox={social.icon === "twitter" ? "0 0 24 24" : "0 0 256 256"} className="h-10 w-10 fill-current">
                    <path d={iconPaths[social.icon]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16 lg:justify-self-start">
            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h5 className="text-eyebrow text-ink">{column.title}</h5>
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
