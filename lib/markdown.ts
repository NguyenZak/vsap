// A small, safe Markdown subset for news posts. It parses to a tree that React
// renders as elements (never raw HTML), and only lets through http(s), mailto,
// tel and on-site links, so a post can't inject scripts.
//
// Supported: ## / ### / #### headings, paragraphs (single line breaks kept),
// **bold**, *italic*, `code`, [links](url), images on their own line
// ![alt](src "caption"), "- " and "1. " lists, "> " quotes and --- rules.

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong" | "em"; c: Inline[] }
  | { t: "code"; v: string }
  | { t: "link"; href: string; c: Inline[] }
  | { t: "br" };

export type Block =
  | { t: "h"; level: 2 | 3 | 4; c: Inline[] }
  | { t: "p"; c: Inline[] }
  | { t: "ul" | "ol"; items: Inline[][] }
  | { t: "quote"; c: Inline[] }
  | { t: "img"; src: string; alt: string; caption: string }
  | { t: "hr" };

export function safeHref(url: string): string | null {
  const u = url.trim();
  return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(u) ? u : null;
}

const safeSrc = (url: string) => (/^(https?:\/\/|\/(?!\/))/i.test(url.trim()) ? url.trim() : null);

const INLINE = /`([^`]+)`|\*\*(.+?)\*\*|\*(?!\s)(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(s: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of s.matchAll(INLINE)) {
    if (m.index > last) out.push({ t: "text", v: s.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: "code", v: m[1] });
    else if (m[2] !== undefined) out.push({ t: "strong", c: parseInline(m[2]) });
    else if (m[3] !== undefined) out.push({ t: "em", c: parseInline(m[3]) });
    else {
      const href = safeHref(m[5]);
      out.push(href ? { t: "link", href, c: parseInline(m[4]) } : { t: "text", v: m[4] });
    }
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ t: "text", v: s.slice(last) });
  return out;
}

/** Lines joined with soft breaks, as typed. */
function lines(ls: string[]): Inline[] {
  return ls.flatMap((l, i) => (i ? [{ t: "br" } as Inline, ...parseInline(l)] : parseInline(l)));
}

const IMG = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;

export function parseMarkdown(src: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { t: "ul" | "ol"; items: Inline[][] } | null = null;
  let quote: string[] = [];

  const flush = () => {
    if (para.length) blocks.push({ t: "p", c: lines(para) });
    if (list) blocks.push(list);
    if (quote.length) blocks.push({ t: "quote", c: lines(quote) });
    para = [];
    list = null;
    quote = [];
  };

  for (const raw of src.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^(#{1,4})\s+(.+)$/))) {
      flush();
      // The post title is the page's h1, so "#" starts at h2.
      blocks.push({ t: "h", level: Math.min(4, Math.max(2, m[1].length)) as 2 | 3 | 4, c: parseInline(m[2]) });
    } else if (/^(-{3,}|\*{3,})$/.test(line)) {
      flush();
      blocks.push({ t: "hr" });
    } else if ((m = line.match(IMG))) {
      flush();
      const src = safeSrc(m[2]);
      if (src) blocks.push({ t: "img", src, alt: m[1], caption: m[3] ?? "" });
    } else if ((m = line.match(/^(?:[-*+]|(\d+)[.)])\s+(.+)$/))) {
      const t = m[1] ? "ol" : "ul";
      if (para.length || quote.length || (list && list.t !== t)) flush();
      list ??= { t, items: [] };
      list.items.push(parseInline(m[2]));
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      if (para.length || list) flush();
      quote.push(m[1]);
    } else {
      if (list || quote.length) flush();
      para.push(line);
    }
  }
  flush();
  return blocks;
}

/** Text without Markdown markers, e.g. for a description fallback. */
export function plainText(src: string) {
  return src
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]+/g, "")
    .replace(/^\s*(?:[-+]|\d+[.)])\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Minutes to read at ~220 words a minute (at least 1). */
export const readingMinutes = (src: string) => Math.max(1, Math.round(plainText(src).split(" ").filter(Boolean).length / 220));
