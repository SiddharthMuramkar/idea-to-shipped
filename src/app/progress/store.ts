import {
  NOTHING_DONE,
  parseProgress,
  PROGRESS_KEY,
  serializeProgress,
  withLessonDone,
  type Progress,
} from "./progress";

// The progress store, in the shape useSyncExternalStore wants: subscribe,
// and a snapshot that stays the same object until the progress changes.
// On the server, and while the page hydrates, the snapshot is "nothing
// done", so the HTML never depends on one Visitor's browser.
export type ProgressStore = {
  subscribe(listener: () => void): () => void;
  getSnapshot(): Progress;
  getServerSnapshot(): Progress;
  markDone(slug: string, score: number, total: number): void;
  reset(): void;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Events = Pick<EventTarget, "addEventListener" | "removeEventListener">;

// `storage` may be missing or may throw (a private window, storage turned
// off), so every read and write is guarded. When a write fails, this tab
// keeps the progress in memory for the rest of the visit, and stops reading
// the stale copy back. `events` is where other tabs' changes arrive.
export function createProgressStore({
  storage,
  events,
  now = () => new Date(),
}: {
  storage: () => StorageLike | null;
  events: Events | null;
  now?: () => Date;
}): ProgressStore {
  const listeners = new Set<() => void>();
  let snapshot: Progress | null = null;
  // The stored text the snapshot was read from.
  let stored: string | null = null;
  let memoryOnly = false;

  const emit = () => listeners.forEach((listener) => listener());

  // Reads the stored progress again. True when it changed.
  function sync(): boolean {
    if (memoryOnly) return false;
    let raw: string | null = null;
    try {
      raw = storage()?.getItem(PROGRESS_KEY) ?? null;
    } catch {
      raw = null;
    }
    if (snapshot !== null && raw === stored) return false;
    stored = raw;
    snapshot = parseProgress(raw);
    return true;
  }

  function getSnapshot(): Progress {
    if (snapshot === null) sync();
    return snapshot ?? NOTHING_DONE;
  }

  function save(next: Progress, write: (store: StorageLike) => string | null) {
    snapshot = next;
    try {
      const store = storage();
      if (!store) throw new Error("no storage");
      stored = write(store);
    } catch {
      memoryOnly = true;
    }
    emit();
  }

  // Another tab saved or reset its progress (a null key means it cleared
  // all of this site's storage).
  function onStorage(event: Event) {
    const { key } = event as StorageEvent;
    if (key !== null && key !== PROGRESS_KEY) return;
    if (sync()) emit();
  }

  // Firefox and Safari fire no storage events at a page sitting in the
  // back/forward cache (WHATWG storage#119), so read storage again when one
  // is restored.
  function onPageShow(event: Event) {
    if ((event as PageTransitionEvent).persisted && sync()) emit();
  }

  return {
    subscribe(listener) {
      if (listeners.size === 0) {
        events?.addEventListener("storage", onStorage);
        events?.addEventListener("pageshow", onPageShow);
        // Nothing was listening, so a change from another tab may have been
        // missed. React reads the snapshot again after subscribing.
        sync();
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          events?.removeEventListener("storage", onStorage);
          events?.removeEventListener("pageshow", onPageShow);
        }
      };
    },
    getSnapshot,
    getServerSnapshot: () => NOTHING_DONE,
    markDone(slug, score, total) {
      // Build on what storage holds now: a page back from the back/forward
      // cache may have missed other tabs' saves, and this writes it all back.
      sync();
      const next = withLessonDone(getSnapshot(), slug, score, total, now());
      save(next, (store) => {
        const raw = serializeProgress(next);
        store.setItem(PROGRESS_KEY, raw);
        return raw;
      });
    },
    reset() {
      save(NOTHING_DONE, (store) => {
        store.removeItem(PROGRESS_KEY);
        return null;
      });
    },
  };
}

const inBrowser = typeof window !== "undefined";

// The site's one store. Reading window.localStorage can itself throw, which
// the store's guards catch.
export const progressStore = createProgressStore({
  storage: () => (inBrowser ? window.localStorage : null),
  events: inBrowser ? window : null,
});
