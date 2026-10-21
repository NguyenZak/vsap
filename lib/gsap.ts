// Single place where GSAP plugins are registered. Import gsap/ScrollTrigger/useGSAP
// from here (client components only) so registration always happens first.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Media query for visitors who have not asked the OS to reduce motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, useGSAP };
