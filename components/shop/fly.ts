// "Fly to cart": a copy of the product photo arcs from where it was added to the
// header's cart button (Motion), then the cart button gives a little bounce.
import { animate } from "motion";

/** The header cart button, registered by CartButton so any add can aim at it. */
let target: HTMLElement | null = null;
export const setCartTarget = (el: HTMLElement | null) => {
  target = el;
};

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Resolves when the flight has landed (at once when there is nothing to animate). */
export async function flyToCart(from: HTMLImageElement | null | undefined) {
  const to = target;
  if (!from || !to || reduced() || !from.currentSrc) return;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  // Only fly when the cart button is actually visible (not scrolled away or hidden).
  if (!a.width || !b.width || b.bottom < 0) return;

  const size = Math.min(a.width, a.height, 160);
  const ghost = document.createElement("img");
  ghost.src = from.currentSrc;
  ghost.alt = "";
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${a.left + a.width / 2 - size / 2}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "contain",
    zIndex: "100",
    pointerEvents: "none",
    borderRadius: "16px",
    background: "white",
    boxShadow: "0 12px 30px rgb(0 0 0 / 0.25)",
  });
  document.body.appendChild(ghost);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  try {
    // An arc: rise a little first, then dive into the cart while shrinking.
    await animate(
      ghost,
      { x: [0, dx * 0.4, dx], y: [0, Math.min(dy, 0) - 80, dy], scale: [1, 0.7, 0.12], opacity: [1, 1, 0.6] },
      { duration: 0.75, ease: [0.45, 0, 0.25, 1] },
    );
  } finally {
    ghost.remove();
  }
  animate(to, { scale: [1, 1.25, 0.92, 1] }, { duration: 0.45, ease: "easeOut" });
}
