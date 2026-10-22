import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Link from "next/link";
import { lessons } from "@/lessons/lessons";
import { LogoMark } from "./logo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// The large, light headings.
const display = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Idea to Shipped",
  description:
    "Learning Matt Pocock's skills and agentic coding by building this site.",
};

async function loadLessons() {
  "use cache";
  return lessons.listLessons();
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const all = await loadLessons();
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body>
        {/* Without JavaScript nothing turns the header solid, so keep it solid. */}
        <noscript>
          <style>{`.site-header { --header-fg: var(--ink) !important; --header-bg: var(--bg) !important; --header-shadow: var(--shadow-soft) !important; }`}</style>
        </noscript>
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
        <main>{children}</main>
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
          <div className="site-footer-base">
            <p>
              Photos from Unsplash. <Link href="/credits">Photo credits</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
