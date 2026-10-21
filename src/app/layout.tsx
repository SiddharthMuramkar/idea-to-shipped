import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Idea to Shipped",
  description:
    "Learning Matt Pocock's skills and agentic coding by building this site.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <header className="site-header">
          <Link href="/" className="site-title">
            Idea to Shipped
          </Link>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
