"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, type Library, type OpenUIError } from "@openuidev/react-lang";
import { openuiLibrary } from "@openuidev/react-ui/genui-lib";
import { previewLibrary } from "./library";

// One preview panel: the rendered OpenUI output, a Replay-stream button, any
// parse errors (never swallowed — invalid Lang silently dropping components
// is exactly what a preview must surface), and the Lang source itself.
export function PreviewPanel({
  lang,
  customLibrary = false,
}: {
  lang: string;
  customLibrary?: boolean;
}) {
  const [response, setResponse] = useState(lang);
  const [streaming, setStreaming] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function replay() {
    if (timer.current) clearInterval(timer.current);
    // Reduced motion: the streaming effect is decorative, so skip straight
    // to the final state, matching Reveal's behaviour elsewhere on the site.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setResponse(lang);
      setStreaming(false);
      return;
    }
    const lines = lang.split("\n");
    let shown = 0;
    setResponse(lines[0] ?? "");
    setStreaming(true);
    timer.current = setInterval(() => {
      shown += 1;
      setResponse(lines.slice(0, shown + 1).join("\n"));
      if (shown >= lines.length - 1) {
        if (timer.current) clearInterval(timer.current);
        setStreaming(false);
      }
    }, 90);
  }

  function handleError(next: OpenUIError[]) {
    setErrors(
      next
        .filter((e) => e.severity !== "warning")
        .map((e) => `[${e.code}] ${e.message}`),
    );
  }

  const library: Library = customLibrary ? previewLibrary : openuiLibrary;

  return (
    <div className="openui-panel">
      <div className="openui-panel-render">
        <Renderer
          library={library}
          response={response}
          isStreaming={streaming}
          onError={handleError}
          onAction={(event) => {
            // No assistant sits behind this preview; log so button/form
            // actions are visible in devtools instead of vanishing.
            console.log("[openui-preview] action", event);
          }}
        />
      </div>
      <div className="openui-panel-bar">
        <button type="button" className="openui-replay" onClick={replay} disabled={streaming}>
          {streaming ? "Streaming…" : "Replay stream"}
        </button>
        <span className="openui-panel-status" role="status">
          {errors.length > 0 ? `${errors.length} parse error(s)` : "No parse errors"}
        </span>
      </div>
      {errors.length > 0 && (
        <ul className="openui-errors">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <details className="openui-source">
        <summary>OpenUI Lang source</summary>
        <pre>{lang}</pre>
      </details>
    </div>
  );
}
