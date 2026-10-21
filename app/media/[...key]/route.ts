import { getMediaObject } from "@/lib/cms/store";

/** Public URL for files uploaded through the CMS media library (stored in R2). */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.map(decodeURIComponent).join("/");
  if (!key || key.includes("..")) return new Response("Not found", { status: 404 });
  const obj = await getMediaObject(key).catch(() => null);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("ETag", obj.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  // Uploaded SVGs must not run scripts when opened directly.
  headers.set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; img-src data:");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(obj.body, { headers });
}
