import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { siteConfig } from "@/content/site";

// Manrope is footer legal text only.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-manrope",
  display: "swap",
});

// Plus Jakarta Sans is the site-wide typeface: headings, body copy, and the
// hero/navbar. Replaces Outfit (display) and self-hosted Satoshi (body).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta-src",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PujoGo",
    template: "%s – PujoGo",
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jakarta.variable}`}
    >
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <SmoothScroll />
        <CustomCursor />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
