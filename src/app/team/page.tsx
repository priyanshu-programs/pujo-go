import type { Metadata } from "next";
import Image from "next/image";
import { STAGGER } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/sections/Cta";
import { teamHeader, teamMembers } from "@/content/team";
import { SocialIcon } from "@/components/ui/SocialIcon";

export const metadata: Metadata = {
  title: "Team",
  description: teamHeader.lede,
};

export default function TeamPage() {
  return (
    <>
      {/* Site gradient language (blush wash + the legal pages' red bloom up
          top). Fades back to paper at the bottom so it melts into the CTA below
          with no hard edge. */}
      <section className="relative overflow-hidden bg-[linear-gradient(to_bottom,var(--color-paper)_0%,var(--color-surface)_25%,var(--color-blush)_60%,var(--color-paper)_100%)] pb-16 pt-[13rem] md:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 26.25rem at 85% 0%, rgba(254,0,0,0.22), transparent), radial-gradient(ellipse 50% 23.75rem at 0% 45%, rgba(58,13,13,0.9), transparent)",
          }}
        />
        <div className="shell relative flex flex-col gap-4 md:gap-5">
          <h1 className="sr-only">{teamHeader.title}</h1>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {teamMembers.map((m, i) => (
              <li key={m.name}>
              <Reveal delay={(i % 3) * STAGGER}>
                <article
                  aria-labelledby={`member-${i}`}
                  // Tooltip shown by CustomCursor on hover: real handle, else name.
                  data-cursor-label={m.handle && m.handle !== "@handle" ? m.handle : m.name}
                  className="group relative isolate aspect-[4/5] overflow-hidden rounded-card bg-gradient-to-b from-soft to-surface">
                  {m.image && (
                    <Image
                      src={m.image}
                      alt=""
                      fill
                      sizes="(min-width: 1600px) 26.25vw, (min-width: 1200px) 420px, (min-width: 480px) 50vw, 100vw"
                      // Slow, long-tail ease (expo-out) for a soft, premium zoom.
                      // `isolate` on the card keeps the rounded clip crisp in Safari.
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"
                  />
                  {(m.linkedin || m.instagram) && (
                    <div className="absolute right-4 top-4 z-10 flex gap-2">
                      {(
                        [
                          ["linkedin", "LinkedIn", m.linkedin],
                          ["instagram", "Instagram", m.instagram],
                        ] as const
                      )
                        .filter(([, , href]) => href)
                        .map(([icon, label, href], j) => (
                          <a
                            key={icon}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${m.name} on ${label}`}
                            data-cursor-label={label}
                            // Hidden until the card is hovered or focused; always shown
                            // on touch screens. Same expo-out ease as the photo zoom.
                            style={{ transitionDelay: `${j * 60}ms` }}
                            className="flex size-10 translate-y-1 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-[0_8px_24px_-6px_rgba(254,0,0,0.6)] transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
                          >
                            <SocialIcon name={icon} className="size-[1.125rem]" />
                          </a>
                        ))}
                    </div>
                  )}
                  <div className="absolute inset-x-5 bottom-5 flex flex-col items-start gap-2">
                  <h2 id={`member-${i}`} className="text-xl font-bold text-ink">
                    {m.name}
                  </h2>
                  <ul aria-label="Roles" className="flex flex-wrap gap-2">
                    {m.roles.map((r) => (
                      <li
                        key={r}
                        className="rounded-md bg-black/50 px-2.5 py-1 text-xs text-ink backdrop-blur"
                      >
                        #{r}
                      </li>
                    ))}
                  </ul>
                  </div>
                </article>
              </Reveal>
              </li>
            ))}
          </ul>

        </div>
      </section>

      <Cta />
    </>
  );
}
