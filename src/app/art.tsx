import type { CSSProperties } from "react";

// The picture a Course or Lesson gets until it has a photo of its own: navy,
// lit from one corner in its Course's colour (`tone`), over a faint grid,
// with its number in large outline figures. It's drawn in CSS, fills its
// box, and is decorative, so screen readers skip it.
export function Art({ tone, numeral, className }: { tone: string; numeral?: number; className?: string }) {
  return (
    <span
      className={className ? `art ${className}` : "art"}
      style={{ "--tone": tone } as CSSProperties}
      aria-hidden="true"
    >
      {numeral !== undefined && <span className="art-numeral">{String(numeral).padStart(2, "0")}</span>}
    </span>
  );
}
