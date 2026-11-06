import type { Metadata } from "next";
import { loadCourses, outlineOf } from "@/app/library";
import { ProgressView } from "./progress-view";

export const metadata: Metadata = { title: "Your progress" };

// The page itself is static: everything on it about the Visitor is read
// from their browser by ProgressView.
export default async function ProgressPage() {
  const list = await loadCourses();
  return (
    <div className="container progress-page">
      <h1>Your progress</h1>
      <p className="section-lead">
        A Lesson is Done once you&apos;ve taken its Final test, whatever your score. Your progress is
        saved in this browser only: there&apos;s no account, and it never leaves your device.
      </p>
      <noscript>
        <p className="muted">Your browser keeps your progress, and it needs JavaScript turned on to show it.</p>
      </noscript>
      <ProgressView courses={outlineOf(list)} />
    </div>
  );
}
