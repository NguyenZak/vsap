"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import "./globals.css";

// Errors in the [locale] layout itself (e.g. the CMS read failing): replaces the whole document.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = usePathname()?.startsWith("/en") ? "en" : "vi";
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={lang}>
      <head>
        <title>VSAP – Lỗi hệ thống · Server error</title>
        <meta name="robots" content="noindex" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <main className="flex-1">
          <ErrorScreen kind="500" reset={reset} digest={error.digest} standalone />
        </main>
      </body>
    </html>
  );
}
