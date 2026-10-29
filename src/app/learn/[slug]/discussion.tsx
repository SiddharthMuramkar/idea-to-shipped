"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/comments/comments";
import { MAX_BODY, MAX_NAME } from "@/comments/limits";

// The Discussion band at the end of a Lesson, after the Final test: lists
// the Lesson's Comments and posts new ones through the comments API.
//
// Payload invariance — the wire shapes never vary with Lesson or state:
// - The only prop is `lesson`, the Lesson Slug from the page. It is
//   never typed, edited, or stored in form state, so every request for
//   a mounted Discussion names the same Lesson.
// - Load is always GET /api/comments?lesson=<encodeURIComponent(lesson)>
//   and expects Comment[] ({ id, name, body, createdAt }, newest first
//   by server order); submit is always POST /api/comments with header
//   content-type: application/json and body exactly
//   JSON.stringify({ lesson, name, body }) — those three keys, `lesson`
//   from the prop and `name`/`body` as typed. No other field is sent,
//   whatever the Lesson, comment count, or loading/posting state.
// - maxLength on the two fields comes from MAX_NAME / MAX_BODY in
//   @/comments/limits, the same constants the API checks; the server
//   still trims and re-validates, so the client cap is a convenience,
//   never the authority. A successful POST returns one Comment, which
//   is prepended and clears `body` only (`name` is kept); any failure
//   ({ error } or unreachable) shows the error and leaves the list
//   untouched. Comments cannot be edited or deleted from here.
export function Discussion({ lesson }: { lesson: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?lesson=${encodeURIComponent(lesson)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setComments)
      .catch(() => setLoadError(true));
  }, [lesson]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPosting(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lesson, name, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setComments((current) => [data, ...(current ?? [])]);
      setBody("");
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <section className="discussion" aria-label="Discussion">
      <h2>Discussion{comments ? ` · ${comments.length}` : ""}</h2>

      <form className="comment-form" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="comment-name">
          Name (optional)
        </label>
        <input
          id="comment-name"
          placeholder="Name (optional)"
          value={name}
          maxLength={MAX_NAME}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="visually-hidden" htmlFor="comment-body">
          Leave a comment
        </label>
        <textarea
          id="comment-body"
          placeholder="Leave a comment…"
          rows={3}
          value={body}
          maxLength={MAX_BODY}
          onChange={(e) => setBody(e.target.value)}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={posting}>
          {posting ? "Posting…" : "Post comment"}
        </button>
      </form>

      {loadError && <p className="form-error">Couldn&apos;t load comments.</p>}
      {!comments && !loadError && <p className="muted">Loading…</p>}
      {comments?.length === 0 && <p className="muted">No comments yet. Be the first.</p>}

      <ul className="comment-list">
        {comments?.map((c) => (
          <li key={c.id} className="comment">
            <div className="comment-meta">
              <strong>{c.name}</strong>{" "}
              <span className="muted">
                · {new Date(c.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
              </span>
            </div>
            <p>{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
