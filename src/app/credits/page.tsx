import type { Metadata } from "next";

export const metadata: Metadata = { title: "Photo credits · Idea to Shipped" };

// The full list of photographers. Lesson photos and their credits are added
// with the photos themselves.
export default function Credits() {
  return (
    <div className="container">
      <h1>Photo credits</h1>
      <p>
        Every photo on this site comes from{" "}
        <a href="https://unsplash.com">Unsplash</a>, under the{" "}
        <a href="https://unsplash.com/license">Unsplash Licence</a>. Thank you to
        the photographers listed here.
      </p>
      <p className="muted">No photos yet.</p>
    </div>
  );
}
