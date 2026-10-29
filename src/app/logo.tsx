// The brand mark: an ink square with an accent dot (the idea) and a paper
// arrow heading up and out (shipped). Colours come from the Press tokens, so
// the mark inverts cleanly in dark mode (ink is light there, paper dark).
// `icon.svg` (the favicon) is the same drawing with fixed colours.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" style={{ fill: "var(--ink)" }} />
      <circle cx="9.5" cy="22.5" r="3.5" style={{ fill: "var(--accent)" }} />
      <g fill="none" style={{ stroke: "var(--paper)" }} strokeWidth="3.4">
        <path d="M13 19 21.5 10.5" />
        <path d="M15 9h8v8" strokeLinejoin="miter" />
      </g>
    </svg>
  );
}
