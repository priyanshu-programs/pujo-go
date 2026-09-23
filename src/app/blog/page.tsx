import type { Metadata } from "next";
import { STAGGER, stagger } from "@/lib/motion";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PostCover } from "@/components/ui/PostCover";
import { Cta } from "@/components/sections/Cta";
import { blogIntro, posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "The PujoGo Journal",
  description: blogIntro.body,
};

export default function BlogIndexPage() {
  return (
    <>
      <section className="rounded-b-section bg-gradient-to-b from-surface to-blush pb-20 pt-navbar-lg">
        <div className="shell flex flex-col gap-4">
          <Reveal>
            <h1 className="text-display-1 font-display text-ink">
              {blogIntro.title}
            </h1>
          </Reveal>
          <Reveal delay={STAGGER}>
            <p className="max-w-lede text-body-lg text-muted">
              {blogIntro.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell grid grid-cols-cards gap-6">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={stagger(i % 3)}>
              <Link
                href={`/blog/${post.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-card border border-soft bg-surface"
              >
                <span
                  aria-hidden="true"
                  className="bg-card-glow pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-80"
                />
                <div className="relative h-[220px] overflow-hidden">
                  <PostCover
                    angle={post.coverAngle}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="relative flex flex-1 flex-col gap-3 p-6">
                  <time
                    dateTime={post.date}
                    className="text-base text-muted"
                  >
                    {post.dateLabel}
                  </time>
                  <h3 className="text-display-3 font-display text-ink">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Cta />
    </>
  );
}
