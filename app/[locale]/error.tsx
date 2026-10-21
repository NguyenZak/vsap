"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";

// Errors thrown while rendering a page; the header and footer from the layout stay up.
export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  // A client component can't export metadata; the server-rendered title is still the page's own.
  useEffect(() => {
    document.title = `${document.documentElement.lang === "en" ? "Something went wrong" : "Đã có lỗi xảy ra"} | VSAP`;
  }, []);

  return (
    <>
      <meta name="robots" content="noindex" />
      <ErrorScreen kind="500" reset={reset} digest={error.digest} />
    </>
  );
}
