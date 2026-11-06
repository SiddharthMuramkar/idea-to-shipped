"use client";

import { useLayoutEffect, useRef } from "react";

// The space kept between one Quick check and the next in the margin.
const GAP = 16;

const isQuickCheck = (el: Element): el is HTMLElement => el instanceof HTMLElement && el.hasAttribute("data-quick-check");
const isDrawn = (el: Element) => el.getClientRects().length > 0;

// The block a Quick check is about: the nearest drawn element before it that
// isn't another Quick check. In a run of text, that's its last paragraph,
// list or table, the one the check was written after.
function anchorOf(check: HTMLElement): HTMLElement | null {
  let el = check.previousElementSibling;
  while (el && (isQuickCheck(el) || !isDrawn(el))) el = el.previousElementSibling;
  if (!(el instanceof HTMLElement)) return null;
  const last = el.classList.contains("prose") ? el.lastElementChild : null;
  return last instanceof HTMLElement ? last : el;
}

// How far an element's top is below the top of its Section, which is the
// box a lifted Quick check is placed in. offsetTop ignores transforms, so a
// block still waiting to fade in (reveal.tsx) is measured where it will be.
function topWithin(section: HTMLElement, el: HTMLElement): number {
  let top = 0;
  for (let at: Element | null = el; at instanceof HTMLElement && at !== section; at = at.offsetParent) {
    top += at.offsetTop;
  }
  return top;
}

// Lays out the Quick checks in the margin to the right of a Lesson's text on
// a wide screen (from 1280px, the media query in globals.css), in every
// Section that has that column free: no Scene and no big-idea stage beside
// its text (they're marked data-quick-checks). Each check sits level with
// the block it's about or, when the one above it reaches further down, just
// below that one, so they never overlap. A Section whose checks run past its
// text grows to hold them, so they never reach the next Section. Narrower,
// the checks sit in the text, and this leaves them alone.
//
// Nothing moves without JavaScript: the margin only opens once this has
// marked the Sections data-rail, and it places every check in the same
// frame. It lays them out again whenever a check or a Section changes size
// (an answer grows its card; fonts arriving reflow the text) or the window
// crosses the breakpoint.
export function QuickCheckRail() {
  const marker = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const article = marker.current?.closest(".lesson-article");
    if (!article) return;
    const sections = [...article.querySelectorAll<HTMLElement>("[data-quick-checks]")];
    if (sections.length === 0) return;
    let frame = 0;

    const place = () => {
      frame = 0;
      for (const section of sections) section.style.minHeight = "";
      // Every measurement first, then every change, so the page is laid out once.
      const plans = sections.map((section) => {
        const checks = [...section.children].filter(isQuickCheck);
        if (checks.length === 0 || getComputedStyle(checks[0]).position !== "absolute") {
          return { section, tops: null, checks, minHeight: "" };
        }
        let floor = 0;
        let bottom = 0;
        const tops = checks.map((check) => {
          const anchor = anchorOf(check);
          const top = Math.max(anchor ? topWithin(section, anchor) : 0, floor);
          bottom = top + check.offsetHeight;
          floor = bottom + GAP;
          return top;
        });
        const needed = Math.ceil(bottom + (parseFloat(getComputedStyle(section).paddingBottom) || 0));
        return { section, tops, checks, minHeight: needed > section.offsetHeight ? `${needed}px` : "" };
      });
      for (const { section, tops, checks, minHeight } of plans) {
        checks.forEach((check, i) => (check.style.top = tops ? `${tops[i]}px` : ""));
        section.style.minHeight = minHeight;
      }
    };
    const later = () => {
      if (frame === 0) frame = requestAnimationFrame(place);
    };

    for (const section of sections) section.dataset.rail = "";
    place();

    const resized = new ResizeObserver(later);
    for (const section of sections) {
      resized.observe(section);
      for (const check of section.children) if (isQuickCheck(check)) resized.observe(check);
    }
    const wide = window.matchMedia("(min-width: 1280px)");
    wide.addEventListener("change", later);
    document.fonts?.ready.then(later);

    // Runs when the page is left or hidden (Next keeps visited pages
    // mounted): everything goes back to how the HTML had it.
    return () => {
      resized.disconnect();
      wide.removeEventListener("change", later);
      if (frame !== 0) cancelAnimationFrame(frame);
      for (const section of sections) {
        delete section.dataset.rail;
        section.style.minHeight = "";
        for (const check of section.children) if (isQuickCheck(check)) check.style.top = "";
      }
    };
  }, []);

  return <span ref={marker} hidden />;
}
