import Link from "next/link";
import { legalLinks } from "@/content/site";
import styles from "./LegalPage.module.css";

export function LegalPage({ content, path }: { content: string; path: string }) {
  return (
    <section className={styles.page}>
      <div className="shell">
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <Link href="/" className={styles.home}>← Back to home</Link>
            <nav aria-label="Legal pages" className={styles.navigation}>
              {legalLinks.filter((link) => link.href !== "/cookies").map((link) => (
                <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          {/* Static, sanitized content transcribed from the supplied policy documents. */}
          <article className={styles.document} dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </section>
  );
}
