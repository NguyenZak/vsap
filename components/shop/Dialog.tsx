"use client";

import { useEffect, useRef } from "react";
import { Minus, Plus, X } from "lucide-react";
import { MAX_QTY } from "@/lib/shop";

/**
 * Native modal <dialog>: the browser traps focus, closes on Esc and puts the rest
 * of the page out of reach. Clicking the backdrop closes it too.
 */
export function Dialog({
  open,
  onClose,
  label,
  variant,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  variant: "drawer" | "modal";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const shape =
    variant === "drawer"
      ? "shop-drawer m-0 ml-auto h-dvh max-h-none w-full max-w-md"
      : "shop-modal m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl rounded-3xl";

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`${shape} bg-white p-0 text-ink-900 backdrop:bg-forest-950/50 backdrop:backdrop-blur-sm ${className}`}
    >
      {open && children}
    </dialog>
  );
}

export function CloseButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full bg-mist-100 text-ink-900 transition hover:bg-mist-200"
    >
      <X className="size-4" />
    </button>
  );
}

export function QtyStepper({
  value,
  onChange,
  labels,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  labels: { decrease: string; increase: string; quantity: string };
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-8" : "h-11";
  const btn = `grid ${size === "sm" ? "w-8" : "w-11"} place-items-center text-ink-600 transition hover:text-forest-900 disabled:opacity-30`;
  return (
    <div className={`inline-flex ${box} items-stretch rounded-full border border-mist-200 bg-white`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={labels.decrease}>
        <Minus className="size-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QTY}
        value={value}
        aria-label={labels.quantity}
        onChange={(e) => onChange(Number(e.target.value) || 1)}
        className={`${size === "sm" ? "w-8 text-sm" : "w-10"} [appearance:textfield] bg-transparent text-center font-medium tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none`}
      />
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label={labels.increase}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
