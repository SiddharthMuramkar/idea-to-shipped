import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Link from "next/link";
import { loadCourses } from "./library";
import { LogoMark } from "./logo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// The headings: bold (750–800) and tightly spaced. It's a variable font, so
// every weight in between is available without loading more files.
const display = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Idea to Shipped", template: "%s · Idea to Shipped" },
  description:
    "A free library for building software with coding agents: Git and GitHub from zero, CI/CD, how coding agents work, and Matt Pocock's Skills for Claude Code. Every Lesson has quick checks and a Final test, and your progress stays in your browser.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const list = await loadCourses();
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
              <Link href="/#courses">Courses</Link>
              <Link href="/progress">Progress</Link>
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
                A free library for building software with coding agents. There are no accounts:
                your progress stays in your browser.
              </p>
            </div>
            <nav className="footer-courses" aria-label="Courses">
              <h2 className="footer-heading">Courses</h2>
              <ol>
                {list.map((course, i) => (
                  <li key={course.slug}>
                    <Link href={`/courses/${course.slug}`}>
                      <span className="footer-number">{i + 1}</span> <span>{course.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <div className="site-footer-base">
            <p>
              Images: openly licensed, from Wikimedia Commons. <Link href="/credits">Credits</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
