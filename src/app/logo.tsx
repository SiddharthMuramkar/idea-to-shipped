// The brand mark: a blue square with an amber dot (the idea) and a white
// arrow heading up and out (shipped). `icon.svg` is the same drawing.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" fill="#1E3FCC" />
      <circle cx="9.5" cy="22.5" r="3.5" fill="#FFB020" />
      <g fill="none" stroke="#FFFFFF" strokeWidth="3.4">
        <path d="M13 19 21.5 10.5" />
        <path d="M15 9h8v8" strokeLinejoin="miter" />
      </g>
    </svg>
  );
}
