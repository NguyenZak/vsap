import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const font = Inter({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "VSAP Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={font.variable}>
      <body className="bg-mist-50">{children}</body>
    </html>
  );
}
