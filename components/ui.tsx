import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Variant = "sun" | "white" | "dark" | "glass";

const button: Record<Variant, string> = {
  sun: "bg-sun-400 text-forest-950 hover:bg-sun-500",
  white: "bg-white text-ink-900 hover:bg-mist-100",
  dark: "bg-forest-900 text-white hover:bg-forest-800",
  glass: "border border-white/70 text-white hover:bg-white/10",
};

/** Pill button link; the yellow one carries the small ↗ arrow like the mockup. */
export function Button({
  href,
  children,
  variant = "sun",
  arrow = variant === "sun",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${button[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />}
    </Link>
  );
}

/** Small rounded label with a green dot ("• About Agrovia"). */
export function Tag({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "glass" }) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
        tone === "glass" ? "border-white/30 bg-white/15 text-white backdrop-blur-md" : "border-leaf-500/30 bg-leaf-500/10 text-forest-900"
      }`}
    >
      <span className={`size-1.5 rounded-full ${tone === "glass" ? "bg-sun-400" : "bg-leaf-500"}`} />
      {children}
    </p>
  );
}

/** Sans first line + italic serif second line, the headline pattern of the design. */
export function Title({
  title,
  accent,
  as: As = "h2",
  className = "",
}: {
  title: string;
  accent?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <As className={`heading ${className}`}>
      {title}
      {accent && (
        <>
          {" "}
          <span className="accent title-accent block text-[1.1em] leading-[1]">{accent}</span>
        </>
      )}
    </As>
  );
}
