"use client";

import { useLayoutEffect } from "react";

// What fades in as you scroll: anything marked `data-reveal`, and each child
// of a container marked `data-reveal-children` (a child that's a container
// itself passes the reveal on to its own children instead).
const TARGETS = "[data-reveal], [data-reveal-children] > :not([data-reveal-children])";

// How many items arriving together get a growing delay, so a long batch
// never makes the last one wait.
const MAX_STAGGER = 5;

// An item's place among its siblings in the same data-reveal-children group,
// so a row of cards fades in left to right. A lone data-reveal item is 0.
function staggerIndex(el: HTMLElement) {
  const group = el.parentElement;
  if (!group?.hasAttribute("data-reveal-children")) return 0;
  return Array.prototype.indexOf.call(group.children, el);
}

// Put this once in a page. It hides the page's reveal targets that are still
// below the screen, then shows each one, once, as it scrolls into view, by
// setting data-reveal-state="hidden|shown", which globals.css reads.
//
// Nothing is hidden without JavaScript, nothing on screen at the start is
// ever hidden (so nothing flickers), and with reduce-motion on it does
// nothing at all.
export function Reveal() {
  // A layout effect runs before the browser paints, so the hidden items are
  // never seen in their shown state first.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--reveal-i", String(Math.min(staggerIndex(el), MAX_STAGGER)));
          el.dataset.revealState = "shown";
          observer.unobserve(el);
        }
      },
      // Wait until an item is a little way up the screen.
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of document.querySelectorAll<HTMLElement>(TARGETS)) {
      if (el.dataset.revealState === "shown") continue;
      // Skip what isn't drawn, such as a page kept hidden after navigating
      // away: its own Reveal picks it up when it's shown again.
      if (el.getClientRects().length === 0) continue;
      // Already on screen the first time: it counts as shown, with no fade.
      if (!el.dataset.revealState && el.getBoundingClientRect().top < window.innerHeight) {
        el.dataset.revealState = "shown";
        continue;
      }
      el.dataset.revealState = "hidden";
      observer.observe(el);
    }

    // Runs when the page is left or hidden. Anything still hidden is watched
    // again when the page comes back; what's shown stays shown.
    return () => observer.disconnect();
  }, []);

  return null;
}
