"use client";

import { useEffect, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { MAX_QTY } from "@/lib/shop";

/**
 * Native modal <dialog> (the browser traps focus, Esc and the backdrop close it),
 * animated with Motion: the cart drawer springs in from the right, the quick-view
 * modal grows out of the point that opened it. Both animate out before closing.
 */
export function Dialog({
  open,
  onClose,
  label,
  variant,
  origin,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  variant: "drawer" | "modal";
  /** Viewport point the modal grows from (the clicked card), when known. */
  origin?: { x: number; y: number } | null;
  className?: string;
  children: React.ReactNode;
}) {
  const [scope, animate] = useAnimate<HTMLDialogElement>();
  const reduce = useReducedMotion();
  // Keeps the content on screen while the closing animation plays.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const d = scope.current;
    if (!d) return;
    if (open && !d.open) {
      setShown(true);
      d.showModal();
      if (reduce) return;
      if (variant === "drawer") {
        animate(d, { x: ["100%", "0%"] }, { type: "spring", stiffness: 260, damping: 30 });
      } else {
        if (origin) {
          const r = d.getBoundingClientRect();
          d.style.transformOrigin = `${origin.x - r.left}px ${origin.y - r.top}px`;
        }
        animate(d, { opacity: [0, 1], scale: [0.6, 1] }, { type: "spring", stiffness: 320, damping: 28 });
      }
    }
    if (!open && d.open) {
      const done = () => {
        d.close();
        setShown(false);
      };
      if (reduce) return done();
      const out = variant === "drawer" ? { x: "100%" } : { opacity: 0, scale: 0.9 };
      animate(d, out, { duration: 0.22, ease: "easeIn" }).then(done);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const shape =
    variant === "drawer"
      ? "shop-drawer m-0 ml-auto h-dvh max-h-none w-full max-w-md"
      : "shop-modal m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl rounded-3xl";

  return (
    <dialog
      ref={scope}
      aria-label={label}
      // Esc: let the closing animation run instead of the browser closing at once.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // The browser may still close it outright (e.g. Esc without a recent user gesture): keep state in step.
      onClose={() => {
        setShown(false);
        if (open) onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`${shape} bg-surface p-0 text-ink-900 backdrop:bg-forest-950/50 backdrop:backdrop-blur-sm ${className}`}
    >
      {(open || shown) && children}
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
  const btn = `grid ${size === "sm" ? "w-8" : "w-11"} place-items-center text-ink-600 transition hover:text-heading disabled:opacity-30`;
  return (
    <div className={`inline-flex ${box} items-stretch rounded-full border border-mist-200 bg-surface`}>
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
