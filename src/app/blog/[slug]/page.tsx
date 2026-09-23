import type { Metadata } from "next";
import { stagger } from "@/lib/motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { PostCover } from "@/components/ui/PostCover";
import { getPost, getRelatedPosts, posts } from "@/content/posts";
import type { BodyBlock } from "@/content/posts";

type Params = { slug: string };

/** Every post is statically generated at build time. */
export function generateStaticParams(): Params[] {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

/** Renders one typed body block. Keeps the post body free of raw HTML. */
function Block({ block }: { block: BodyBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <h3 className="text-display-3 font-display text-ink">{block.text}</h3>
      );
    case "h3":
      return (
        <h3 className="text-display-3 pt-4 font-display text-ink">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="flex list-disc flex-col gap-3 pl-6">
          {block.items.map((item) => (
            <li key={item} className="text-body-lg text-muted">
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="flex list-decimal flex-col gap-3 pl-6">
          {block.items.map((item) => (
            <li key={item} className="text-body-lg text-muted">
              {item}
            </li>
          ))}
        </ol>
      );
    default:
      return <p className="text-body-lg text-muted">{block.text}</p>;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);

  return (
    <>
      <article>
        <header className="rounded-b-section bg-gradient-to-b from-surface to-blush pb-16 pt-navbar-lg">
          <div className="shell">
            <div className="mx-auto flex max-w-column flex-col gap-5">
              <time dateTime={post.date} className="text-eyebrow text-muted">
                {post.dateLabel}
              </time>
              <h1 className="text-display-1 font-display text-ink">
                {post.title}
              </h1>
            </div>
          </div>
        </header>

        <div className="shell py-16">
          <div className="mx-auto flex max-w-column flex-col gap-6">
            {post.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </div>
      </article>

      <section className="py-16 md:py-24">
        <div className="shell flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-display-2 font-display text-ink">Learn more</h2>
            <p className="text-body-lg text-muted">
              Discover more from the latest posts.
            </p>
          </div>

          <div className="grid grid-cols-cards gap-6">
            {related.map((item, i) => (
              <Reveal key={item.slug} delay={stagger(i)}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-card border border-soft bg-surface"
                >
                  <span
                    aria-hidden="true"
                    className="bg-card-glow pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-80"
                  />
                  <div className="relative h-[220px] overflow-hidden">
                    <PostCover
                      angle={item.coverAngle}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="relative flex flex-1 flex-col gap-3 p-6">
                    <time dateTime={item.date} className="text-base text-muted">
                      {item.dateLabel}
                    </time>
                    <h3 className="text-display-3 font-display text-ink">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
