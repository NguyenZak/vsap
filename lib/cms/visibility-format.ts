// Pure part of lib/cms/visibility.ts (no Cloudflare imports, so it is unit-testable).

export type Visibility = {
  /** false = visitors see "Coming soon". */
  public: boolean;
  updatedAt: number | null;
  updatedBy: string | null;
};

/** The stored value, read leniently: anything but an explicit `public: false` is public. */
export function parseVisibility(raw: unknown, updatedAt: number | null = null): Visibility {
  const v = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  return { public: v.public !== false, updatedAt, updatedBy: typeof v.updatedBy === "string" ? v.updatedBy : null };
}
