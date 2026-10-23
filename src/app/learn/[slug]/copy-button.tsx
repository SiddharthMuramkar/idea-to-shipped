"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "./icons";

// Nothing to subscribe to: the store only answers "are we in the browser?",
// which is false while rendering on the server and during hydration.
const noop = () => () => {};

// How long "Copied" stays before the button reads "Copy" again.
const RESET_MS = 2000;

type Status = "idle" | "copied" | "failed";

// A Copy button for one code block in a "Your turn" box. It appears only once
// the page is running in the browser, so without JavaScript there's no dead
// button, just the code to select by hand. The result is also announced
// through a role="status" region, since the button's own text changing isn't
// reliably read out.
export function CopyButton({ text }: { text: string }) {
  const inBrowser = useSyncExternalStore(noop, () => true, () => false);
  const [status, setStatus] = useState<Status>("idle");

  // Back to "Copy" after a moment. This also runs again if the page was
  // hidden mid-wait (Next keeps visited pages mounted), so it never sticks.
  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), RESET_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  if (!inBrowser) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <button type="button" className="copy-button" data-status={status} onClick={copy}>
        <Icon name={status === "copied" ? "check" : "copy"} />
        {status === "copied" ? "Copied" : status === "failed" ? "Couldn't copy" : "Copy"}
        {status === "idle" && <span className="visually-hidden"> this code</span>}
      </button>
      <span role="status" className="visually-hidden">
        {status === "copied" ? "Copied" : status === "failed" ? "Couldn't copy. Select the code instead." : ""}
      </span>
    </>
  );
}
