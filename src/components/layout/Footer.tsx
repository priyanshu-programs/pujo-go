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
  threads:
    "M138.62 128a53.54 53.54 0 0 1 13.1 1.63c-.57 8.21-3.34 15-8.11 19.61A23.89 23.89 0 0 1 127 156c-11.87 0-15-7.58-15-12.07C112 133 125.8 128 138.62 128Zm85.38 0c0 65.12-35.89 104-96 104s-96-38.88-96-104S67.89 24 128 24s96 38.88 96 104Zm-152 0c0-43.07 18.32-64 56-64 26.34 0 43 10.08 50.81 30.83a8 8 0 0 0 15-5.66C180.9 55.14 150.9 48 128 48c-26.1 0-45.52 8.7-57.72 25.86C60.8 87.19 56 105.4 56 128s4.8 40.81 14.28 54.14C82.48 199.3 101.9 208 128 208c24.45 0 39.82-8.8 48.41-16.18 10.76-9.25 17.19-21.89 17.19-33.82 0-14.3-6.59-26.79-18.56-35.17a54.16 54.16 0 0 0-7.77-4.5c-2.09-14.65-10-25.75-22.34-31.07-14.5-6.26-32.93-3.33-43.72 6.93a8 8 0 0 0 11 11.62c5.43-5.14 16.79-8 26.4-3.85a20.05 20.05 0 0 1 10.77 10.92 68.89 68.89 0 0 0-10.76-.85C113.53 112 96 125.15 96 143.93 96 160.2 109 172 127 172a40 40 0 0 0 27.75-11.29c4.7-4.59 10.11-12.2 12.17-24A25.55 25.55 0 0 1 177.6 158c0 13.71-15.76 34-49.6 34-37.68 0-56-20.93-56-64Z",
};

export function Footer() {
  return (
    <footer className="rounded-t-section relative flex h-screen max-h-screen flex-col overflow-hidden bg-gradient-to-b from-paper to-blush pt-8">
      <div className="relative z-10 shell flex flex-col gap-10">
        {/* Top row: wordmark + tagline + newsletter + socials on the left, nav columns on the right */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-sm flex-col gap-5">
            <Link href="/" aria-label="Pujo Go home" className="flex items-center gap-3">
              <Image
                src="/images/pujogo-logo.webp"
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
                  <svg viewBox="0 0 256 256" className="h-10 w-10 fill-current">
                    <path d={iconPaths[social.icon]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns and legal links share this wrapper, so both start on the same left edge */}
          <div className="flex flex-col items-start gap-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
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

            <ul className="flex flex-wrap items-center justify-start gap-4">
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
        </div>

        {/* Bottom row: copyright */}
        <p className="font-legal text-sm text-muted">
          2026 Pujogo, Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
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
