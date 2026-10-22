// Renders the news Markdown subset (lib/markdown.ts) as React elements, so
// nothing a post contains is ever injected as raw HTML.
import { Fragment } from "react";
import { localHref } from "@/lib/cms/links";
import type { Locale } from "@/lib/locales";
import { parseMarkdown, type Inline } from "@/lib/markdown";
import { srcSetFor } from "@/lib/responsive";

function Inlines({ nodes, locale }: { nodes: Inline[]; locale: Locale }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.t) {
          case "text":
            return <Fragment key={i}>{n.v}</Fragment>;
          case "br":
            return <br key={i} />;
          case "code":
            return (
              <code key={i} className="rounded bg-mist-100 px-1.5 py-0.5 font-mono text-[0.9em] text-ink-900">
                {n.v}
              </code>
            );
          case "strong":
            return (
              <strong key={i} className="font-semibold text-ink-900">
                <Inlines nodes={n.c} locale={locale} />
              </strong>
            );
          case "em":
            return (
              <em key={i}>
                <Inlines nodes={n.c} locale={locale} />
              </em>
            );
          case "link": {
            const external = /^https?:\/\//i.test(n.href);
            return (
              <a
                key={i}
                href={external ? n.href : localHref(n.href, locale)}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="font-medium text-forest-600 underline decoration-sun-500 decoration-2 underline-offset-4 hover:text-forest-900"
              >
                <Inlines nodes={n.c} locale={locale} />
              </a>
            );
          }
        }
      })}
    </>
  );
}

/** Article body. Site links like /contact get the current language prefix. */
export function Markdown({ source, locale }: { source: string; locale: Locale }) {
  const blocks = parseMarkdown(source);
  return (
    <div className="space-y-6 text-base leading-[1.8] text-ink-600 sm:text-[1.0625rem]">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h": {
            const Tag = `h${b.level}` as "h2" | "h3" | "h4";
            const size = { 2: "pt-6 text-3xl sm:text-4xl", 3: "pt-4 text-2xl", 4: "pt-2 text-xl" }[b.level];
            return (
              <Tag key={i} className={`heading scroll-mt-28 text-forest-900 ${size}`}>
                <Inlines nodes={b.c} locale={locale} />
              </Tag>
            );
          }
          case "p":
            return (
              <p key={i}>
                <Inlines nodes={b.c} locale={locale} />
              </p>
            );
          case "ul":
          case "ol": {
            const List = b.t;
            return (
              <List key={i} className={`space-y-2 pl-6 ${b.t === "ul" ? "list-disc marker:text-forest-600" : "list-decimal marker:font-medium marker:text-forest-600"}`}>
                {b.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    <Inlines nodes={item} locale={locale} />
                  </li>
                ))}
              </List>
            );
          }
          case "quote":
            return (
              <blockquote key={i} className="accent border-l-2 border-sun-500 py-1 pl-6 text-2xl leading-snug text-forest-900">
                <Inlines nodes={b.c} locale={locale} />
              </blockquote>
            );
          case "img":
            return (
              <figure key={i} className="py-2">
                <img
                  src={b.src}
                  srcSet={srcSetFor(b.src)}
                  sizes={srcSetFor(b.src) ? "(min-width: 768px) 48rem, 100vw" : undefined}
                  alt={b.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full rounded-2xl bg-mist-100 object-cover"
                />
                {b.caption && <figcaption className="mt-2 text-center text-sm text-ink-400">{b.caption}</figcaption>}
              </figure>
            );
          case "hr":
            return <hr key={i} className="border-mist-200" />;
        }
      })}
    </div>
  );
}
