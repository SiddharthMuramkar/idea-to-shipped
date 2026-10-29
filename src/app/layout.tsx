import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { lessons } from "@/lessons/lessons";
import { LogoMark } from "./logo";
import "./globals.css";

// Fonts — next/font/google, self-hosted at build time (no Google request, no layout shift).
// Both variable fonts (no `weight`); serif adds `axes: ["opsz"]` → `font-optical-sizing: auto` in globals.css.
// Flow: `--font-*` vars on <html> (RootLayout) → `--serif`/`--mono` tokens in globals.css → app-wide.
const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Mono: code/commands/aligned numerals only — never body copy.
const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Idea to Shipped",
  description:
    "Learning Matt Pocock's skills and agentic coding by building this site.",
};

// Viewport: separate export from `metadata` (Next requires it). No theme toggle — follows system scheme.
// themeColor exception: viewport API requires literal hex — keep in sync with `--paper` in globals.css.
export const viewport: Viewport = {
  colorScheme: "light dark",
  // Literal required (see above) — must match `--paper`.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edeae3" },
    { media: "(prefers-color-scheme: dark)", color: "#171614" },
  ],
};

// Footer data flow: loadLessons() (`"use cache"`) → lessons.listLessons() → `all` → footer <ol> (slug/number/title).
async function loadLessons() {
  "use cache";
  return lessons.listLessons();
}

// Shell: <html> (font vars) → header (brand + main nav) / <main>{children}</main> / footer (about + `all` lessons).
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const all = await loadLessons();
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="brand">
              <LogoMark className="brand-mark" />
              <span className="brand-word">Idea to Shipped</span>
            </Link>
            <nav className="site-nav" aria-label="Main">
              <Link href="/#lessons">Lessons</Link>
              <Link href="/learn/main-flow">The main flow</Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-about">
              <Link href="/" className="brand">
                <LogoMark className="brand-mark" />
                <span className="brand-word">Idea to Shipped</span>
              </Link>
              <p>
                A small course on Matt Pocock&apos;s skills and agentic coding,
                written while building this site.
              </p>
            </div>
            <nav className="footer-lessons" aria-label="Lessons">
              <h2 className="footer-heading">Lessons</h2>
              <ol>
                {all.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/learn/${l.slug}`}>
                      <span className="footer-number">{l.number}</span> {l.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
