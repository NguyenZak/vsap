import { describe, expect, it } from "vitest";
import { parseMarkdown, parseInline, plainText, readingMinutes, safeHref } from "../markdown";
import { newPost } from "./collections";
import { defaultContent } from "./defaults";
import { inquiriesCsv, type Inquiry } from "./inquiry-format";
import { generatePassword, hashPassword, verifyPassword } from "./password";
import { formatDate, inLocale, isScheduled, postProblem, slugify, todayVN } from "./post-format";
import { can, permissionsOf, roles, USERNAME_RE } from "./roles";

describe("roles", () => {
  it("only admins manage accounts and read the audit log", () => {
    for (const r of roles) {
      expect(can(r, "users")).toBe(r === "admin");
      expect(can(r, "audit")).toBe(r === "admin");
    }
  });

  it("editors write drafts but cannot publish", () => {
    expect(can("editor", "content.write")).toBe(true);
    expect(can("editor", "content.publish")).toBe(false);
    expect(can("editor", "media.delete")).toBe(false);
    expect(can("editor", "inquiries")).toBe(false);
  });

  it("sales only sees quote requests", () => {
    expect(permissionsOf("sales")).toEqual(["inquiries"]);
  });

  it("publishing implies being able to write", () => {
    for (const r of roles) if (can(r, "content.publish")) expect(can(r, "content.write")).toBe(true);
  });

  it("rejects unknown roles and odd usernames", () => {
    expect(can(undefined, "content.read")).toBe(false);
    expect(can("root" as never, "content.read")).toBe(false);
    expect(USERNAME_RE.test("nguyen.van-a")).toBe(true);
    expect(USERNAME_RE.test("Nguyen")).toBe(false);
    expect(USERNAME_RE.test("ab")).toBe(false);
    expect(USERNAME_RE.test("a b c")).toBe(false);
  });
});

describe("passwords", () => {
  it("hashes with a random salt and verifies", async () => {
    const a = await hashPassword("correct horse battery");
    const b = await hashPassword("correct horse battery");
    expect(a).not.toBe(b);
    expect(a.startsWith("pbkdf2$100000$")).toBe(true);
    expect(await verifyPassword("correct horse battery", a)).toBe(true);
    expect(await verifyPassword("correct horse batterY", a)).toBe(false);
  });

  it("refuses malformed or over-expensive hashes", async () => {
    expect(await verifyPassword("x", "plain")).toBe(false);
    expect(await verifyPassword("x", "pbkdf2$99999999$AAAA$AAAA")).toBe(false);
  });

  it("generates readable random passwords", () => {
    const p = generatePassword(20);
    expect(p).toHaveLength(20);
    expect(p).not.toMatch(/[0O1l]/);
    expect(generatePassword()).not.toBe(generatePassword());
  });
});

describe("markdown", () => {
  it("parses headings, lists, quotes, images and rules", () => {
    const blocks = parseMarkdown("# Title\n\nPara one\nline two\n\n- a\n- b\n\n1. x\n\n> quoted\n\n![Alt](/media/x.webp \"Cap\")\n\n---");
    expect(blocks.map((b) => b.t)).toEqual(["h", "p", "ul", "ol", "quote", "img", "hr"]);
    expect(blocks[0]).toMatchObject({ t: "h", level: 2 });
    expect(blocks[1]).toMatchObject({ t: "p", c: [{ t: "text", v: "Para one" }, { t: "br" }, { t: "text", v: "line two" }] });
    expect(blocks[5]).toEqual({ t: "img", src: "/media/x.webp", alt: "Alt", caption: "Cap" });
  });

  it("parses inline marks and nested links", () => {
    expect(parseInline("a **b** *c* `d` [**e**](/contact)")).toEqual([
      { t: "text", v: "a " },
      { t: "strong", c: [{ t: "text", v: "b" }] },
      { t: "text", v: " " },
      { t: "em", c: [{ t: "text", v: "c" }] },
      { t: "text", v: " " },
      { t: "code", v: "d" },
      { t: "text", v: " " },
      { t: "link", href: "/contact", c: [{ t: "strong", c: [{ t: "text", v: "e" }] }] },
    ]);
  });

  it("drops unsafe links and images", () => {
    expect(safeHref("javascript:alert(1)")).toBeNull();
    expect(safeHref("//evil.example")).toBeNull();
    expect(safeHref("https://vsap.com.vn")).toBe("https://vsap.com.vn");
    expect(parseInline("[x](javascript:alert(1))")).toEqual([{ t: "text", v: "x" }, { t: "text", v: ")" }]);
    expect(parseMarkdown("![x](javascript:alert)")).toEqual([]);
    expect(JSON.stringify(parseMarkdown("![x](javascript:alert(1))"))).not.toMatch(/"t":"(img|link)"/);
    expect(parseMarkdown("<script>alert(1)</script>")).toEqual([{ t: "p", c: [{ t: "text", v: "<script>alert(1)</script>" }] }]);
  });

  it("gives plain text and reading time", () => {
    expect(plainText("## Hi\n\n**Bold** and [link](/x)\n\n- item")).toBe("Hi Bold and link item");
    expect(readingMinutes("word ".repeat(660))).toBe(3);
    expect(readingMinutes("")).toBe(1);
  });
});

describe("posts", () => {
  it("validates slugs and titles", () => {
    const p = { ...newPost("2026-01-01"), slug: "mua-dieu-2026" };
    expect(postProblem(p)).toBeNull();
    expect(postProblem({ ...p, slug: "Mua Dieu" })).toMatch(/Slug/);
    expect(postProblem({ ...p, title: { vi: "", en: "" } })).toMatch(/tiêu đề/);
  });

  it("slugifies Vietnamese titles", () => {
    expect(slugify("Mùa điều Bình Phước 2026: được giá!")).toBe("mua-dieu-binh-phuoc-2026-duoc-gia");
  });

  it("shows a post only in languages it has a title in", () => {
    const p = newPost("2026-01-01");
    expect(inLocale(p, "vi")).toBe(true);
    expect(inLocale(p, "en")).toBe(false);
  });

  it("schedules by Vietnam date", () => {
    // 2026-03-01 18:00 UTC is already 2 March in Vietnam.
    const now = Date.UTC(2026, 2, 1, 18);
    expect(todayVN(now)).toBe("2026-03-02");
    expect(isScheduled({ date: "2026-03-02" }, now)).toBe(false);
    expect(isScheduled({ date: "2026-03-03" }, now)).toBe(true);
  });

  it("formats dates per language", () => {
    expect(formatDate("2026-10-22", "en")).toBe("22 October 2026");
    expect(formatDate("2026-10-22", "vi")).toMatch(/22.*10.*2026/);
  });

  it("ships a News page and a news strip on the home page", () => {
    const c = defaultContent();
    expect(c.pages.news.path).toBe("/news");
    expect(c.pages.news.sections.some((s) => s.type === "posts")).toBe(true);
    expect(c.pages.home.sections.some((s) => s.type === "posts")).toBe(true);
    expect(c.ui.vi.nav.news).toBe("Tin tức");
    expect(c.ui.en.news.readMore).toBe("Read more");
  });
});

describe("inquiry CSV", () => {
  const base: Inquiry = {
    id: 7,
    created_at: Date.UTC(2026, 9, 22),
    status: "new",
    data: { name: "Lê, An", email: "an@example.com", message: 'Cần 2 container "W240"\nGiao tháng 12', product: "cashew" },
    locale: "vi",
    source: "/vi/contact",
    country: "VN",
    note: null,
    updated_at: null,
    updated_by: null,
  };

  it("quotes commas, quotes and newlines, with a BOM for Excel", () => {
    const csv = inquiriesCsv([base]);
    expect(csv.startsWith("﻿Mã,")).toBe(true);
    expect(csv).toContain('"Lê, An"');
    expect(csv).toContain('"Cần 2 container ""W240""\nGiao tháng 12"');
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("defuses spreadsheet formulas", () => {
    const csv = inquiriesCsv([{ ...base, data: { ...base.data, name: "=HYPERLINK(\"x\")" } }]);
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
  });
});
