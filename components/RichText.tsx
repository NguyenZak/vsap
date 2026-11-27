// Short CMS texts with inline formatting typed in Studio's rich text fields:
// **bold**, *italic* and [links](/contact). Rendered as React elements (never raw
// HTML) and only inline, so a text can sit inside any <p>, <dd> or <h3> and keep
// that element's size and colour.
import { Fragment, type ReactNode } from "react";
import { localHref } from "@/lib/cms/links";
import type { Locale } from "@/lib/locales";
import { parseInline, type Inline } from "@/lib/markdown";

function render(nodes: Inline[], locale: Locale): ReactNode[] {
  return nodes.map((n, i) => {
    switch (n.t) {
      case "text":
        return <Fragment key={i}>{n.v}</Fragment>;
      case "br":
        return <br key={i} />;
      case "code":
        return <code key={i}>{n.v}</code>;
      case "strong":
        return (
          <strong key={i} className="font-semibold">
            {render(n.c, locale)}
          </strong>
        );
      case "em":
        return <em key={i}>{render(n.c, locale)}</em>;
      case "link": {
        const external = /^https?:\/\//i.test(n.href);
        return (
          <a
            key={i}
            href={external ? n.href : localHref(n.href, locale)}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="underline decoration-current/40 underline-offset-4 transition hover:decoration-current"
          >
            {render(n.c, locale)}
          </a>
        );
      }
    }
  });
}

/** A rich text field's value; line breaks stay as typed for whitespace-pre-line parents. */
export function Rich({ text, locale }: { text: string; locale: Locale }) {
  if (!/[*`[]/.test(text)) return <>{text}</>;
  return <>{render(parseInline(text), locale)}</>;
}
