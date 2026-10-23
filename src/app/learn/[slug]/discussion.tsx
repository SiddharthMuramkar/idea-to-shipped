"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/comments/comments";
import { MAX_BODY, MAX_NAME } from "@/comments/limits";

// The Discussion band at the end of a Lesson, after the Final test: lists
// the Lesson's Comments and posts new ones through the comments API.
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
    <section className="discussion" aria-label="Discussion" data-reveal>
      <h2>Discussion{comments ? ` · ${comments.length}` : ""}</h2>

      <form className="comment-form" onSubmit={submit}>
        <input
          placeholder="Name (optional)"
          value={name}
          maxLength={MAX_NAME}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
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
