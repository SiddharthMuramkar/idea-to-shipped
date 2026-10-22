"use client";

import { useEffect, useRef } from "react";

// Put this inside a page's top photo band (the element marked `data-hero`).
// While the band is under the header, the header is see-through; once you
// scroll past it, the header turns solid. It works by setting
// <html data-header="clear|solid">, which globals.css reads.
export function HeaderOverlay() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = marker.current?.parentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!hero || !header) return;
    const root = document.documentElement;
    const headerHeight = header.offsetHeight;

    // Set the starting state now: the observer's first report can go missing
    // when an effect re-runs straight away (as React's dev Strict Mode does).
    root.dataset.header =
      hero.getBoundingClientRect().bottom > headerHeight ? "clear" : "solid";

    // Shrink the top of the viewport by the header's height, so the band
    // counts as "gone" as soon as its bottom edge slides under the header.
    const observer = new IntersectionObserver(
      ([entry]) => {
        root.dataset.header = entry.isIntersecting ? "clear" : "solid";
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    );
    observer.observe(hero);

    // Runs when the page is left or hidden on navigation, so the next page
    // starts with a solid header unless it has its own band.
    return () => {
      observer.disconnect();
      root.dataset.header = "solid";
    };
  }, []);

  return <span ref={marker} hidden />;
}
