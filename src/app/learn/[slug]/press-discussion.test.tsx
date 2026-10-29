import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { MAX_BODY, MAX_NAME } from "@/comments/limits";
import { Discussion } from "./discussion";

// Press coverage for the Discussion band: list region, comment form, and
// the loading/empty copy seams, all from the initial server render (the
// comments fetch runs in useEffect, so SSR shows the pre-fetch state).
// No network or DB: assertions cover rendered markup only.

function render(lesson = "some-lesson"): string {
  return renderToStaticMarkup(<Discussion lesson={lesson} />);
}

describe("Discussion", () => {
  test("renders the Discussion section with heading and list region", () => {
    const html = render();

    expect(html).toContain('<section class="discussion" aria-label="Discussion">');
    expect(html).toContain("<h2>Discussion</h2>");
    expect(html).toContain('<ul class="comment-list">');
    // No comments are loaded yet, so the list renders empty.
    expect(html).not.toContain('<li class="comment">');
  });

  test("renders the comment form with name and body fields and a submit", () => {
    const html = render();

    expect(html).toContain('<form class="comment-form">');
    expect(html).toContain('placeholder="Name (optional)"');
    expect(html).toContain('placeholder="Leave a comment…"');
    expect(html).toContain('<button type="submit">Post comment</button>');
    expect(html).not.toContain("Posting…");
  });

  test("form fields are exactly the name and body fields the API takes", () => {
    const html = render();
    const fields = html.match(/<(?:input|textarea)[^>]*>/g) ?? [];

    // One name field and one body field, no more: the API shape is
    // { lesson, name, body }, and the two user-filled fields are these.
    expect(fields).toHaveLength(2);
    expect(fields[0]).toContain("<input");
    expect(fields[0]).toContain(`maxLength="${MAX_NAME}"`);
    expect(fields[1]).toContain("<textarea");
    expect(fields[1]).toContain(`maxLength="${MAX_BODY}"`);
    expect(fields[1]).toContain('rows="3"');
  });

  test("shows the loading copy before comments arrive, not the empty copy", () => {
    const html = render();

    expect(html).toContain('<p class="muted">Loading…</p>');
    expect(html).not.toContain("No comments yet. Be the first.");
    expect(html).not.toContain("Couldn&apos;t load comments.");
  });
});
