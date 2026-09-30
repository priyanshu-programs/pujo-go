import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "filled" | "outline" | "light";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full px-5 py-3 text-base font-bold transition-transform duration-200 hover:scale-[1.03] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  // Primary: 2px accent border on an accent fill, white label.
  filled: "border-2 border-accent bg-accent text-white",
  outline: "border-2 border-ink bg-transparent text-ink hover:bg-ink/5",
  light: "border border-soft bg-blush text-ink",
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "filled",
  children,
  className = "",
  ...rest
}: ButtonLinkProps) {
  const external = href.startsWith("http");

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "filled",
  className = "",
  children,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
