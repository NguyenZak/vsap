"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole, UserRound } from "lucide-react";
import { api } from "./api";

export function LoginForm({ configured }: { configured: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-forest-950 p-4">
      <img src="/images/highlands.webp" alt="" className="absolute inset-0 size-full object-cover opacity-30" />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            await api.login(username, password);
            const next = new URLSearchParams(location.search).get("next");
            location.href = next && next.startsWith("/admin") ? next : "/admin";
          } catch (err) {
            setError((err as Error).message);
            setBusy(false);
          }
        }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
      >
        <img src="/logo.svg" alt="VSAP" className="h-12 w-auto" />
        <h1 className="mt-6 text-xl font-medium text-ink-900">Đăng nhập VSAP Studio</h1>
        <p className="mt-1 text-sm text-ink-600">Quản lý nội dung website.</p>
        {!configured && (
          <p className="mt-4 rounded-lg bg-sun-500/10 px-3 py-2 text-xs text-ink-900">
            Chưa cấu hình mật khẩu quản trị. Đặt secret <code className="font-mono">ADMIN_PASSWORD</code> (xem README).
          </p>
        )}
        <label className="mt-6 block">
          <span className="text-xs font-medium text-ink-900">Tên đăng nhập</span>
          <span className="relative mt-1 block">
            <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              required
              placeholder="admin"
              className="w-full rounded-lg border border-mist-200 py-2.5 pr-3 pl-9 text-sm outline-none placeholder:text-ink-400 focus:border-forest-600 focus:ring-2 focus:ring-lime-300/50"
            />
          </span>
        </label>
        <label className="mt-4 block">
          <span className="text-xs font-medium text-ink-900">Mật khẩu</span>
          <span className="relative mt-1 block">
            <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-mist-200 py-2.5 pr-10 pl-9 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-lime-300/50"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-ink-400 hover:text-ink-900"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>
        {error && (
          <p role="alert" className="mt-3 text-sm text-chili-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !configured}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />} Đăng nhập
        </button>
      </form>
    </main>
  );
}
