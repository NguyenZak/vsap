"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

/** Long text clipped to a few lines with a fade, and a button to read the rest. */
export function MoreText({ children, more, less }: { children: React.ReactNode; more: string; less: string }) {
  const [open, setOpen] = useState(false);
  const [long, setLong] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (el) setLong(el.scrollHeight > el.clientHeight + 8);
  }, []);

  return (
    <div>
      <div ref={box} className={`relative overflow-hidden ${open ? "" : "max-h-56"}`}>
        {children}
        {long && !open && <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white" />}
      </div>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-mist-200 px-4 py-2 text-sm font-medium text-forest-900 transition hover:border-forest-900"
        >
          {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
          {open ? less : more}
        </button>
      )}
    </div>
  );
}
