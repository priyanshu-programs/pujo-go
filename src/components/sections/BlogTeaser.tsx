import Link from "next/link";
import { STAGGER, stagger } from "@/lib/motion";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { blogIntro, posts } from "@/content/posts";
import { PostCover } from "@/components/ui/PostCover";

/**
 * Lead post (half cover / half content) plus three secondary cards.
 * Reads straight from the posts collection, so publishing a new post
 * re-orders this section automatically.
 */
export function BlogTeaser() {
  const [lead, ...rest] = posts;
  const secondary = rest.slice(0, 3);

  return (
    <section className="py-20 md:py-32">
      <div className="shell flex flex-col gap-16">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <Reveal className="flex-1">
            <h2 className="text-display-2 font-display text-ink">
              {blogIntro.title}
            </h2>
          </Reveal>
          <Reveal className="flex-1" delay={STAGGER}>
            <p className="max-w-[70%] text-body-lg text-muted">
              {blogIntro.body}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <Link
            href={`/blog/${lead.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-card border border-soft bg-surface lg:h-[520px] lg:flex-row"
          >
            <span
              aria-hidden="true"
              className="bg-card-glow pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-80"
            />
            <div className="relative h-[280px] w-full overflow-hidden lg:h-full lg:w-1/2">
              <PostCover
                angle={lead.coverAngle}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-6 top-6 lg:hidden">
                <Pill tone="light">Latest article</Pill>
              </span>
            </div>
            <div className="relative flex flex-1 flex-col justify-between gap-10 p-6 lg:p-10 lg:pt-20">
              <div className="flex flex-col gap-6">
                <span className="hidden lg:inline-flex">
                  <Pill>Latest article</Pill>
                </span>
                <h2 className="text-display-2 font-display text-ink">
                  {lead.title}
                </h2>
              </div>
              <span className="inline-flex w-fit items-center rounded-full border-2 border-accent bg-accent px-5 py-3 text-base font-bold text-white transition-transform duration-200 group-hover:scale-[1.03]">
                Read article
              </span>
            </div>
          </Link>
        </Reveal>

        <div className="grid grid-cols-cards gap-6">
          {secondary.map((post, i) => (
            <Reveal key={post.slug} delay={stagger(i)}>
              <Link
                href={`/blog/${post.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-card border border-soft bg-surface"
              >
                <span
                  aria-hidden="true"
                  className="bg-card-glow pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-80"
                />
                <div className="relative h-[241px] overflow-hidden">
                  <PostCover
                    angle={post.coverAngle}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="relative p-6">
                  <h3 className="text-display-3 font-display text-ink">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="flex justify-center">
          <ButtonLink href="/blog">All articles</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
