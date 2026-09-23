/**
 * Blog cover art. The source uses photography; rather than hotlink the
 * template author's images we render a soft dark-to-red gradient with a
 * red bloom, keeping the clone self-contained.
 */
export function PostCover({
  angle = 150,
  className = "",
}: {
  angle?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 block ${className}`}
      style={{
        background: `
          radial-gradient(120% 80% at 20% 0%, rgba(254,0,0,0.5), transparent 60%),
          linear-gradient(${angle}deg, #1a1a1a, #fe0000)
        `,
      }}
    />
  );
}
