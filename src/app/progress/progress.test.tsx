import { describe, expect, test, vi } from "vitest";
import {
  continueFrom,
  doneCount,
  isDone,
  NOTHING_DONE,
  parseProgress,
  PROGRESS_KEY,
  serializeProgress,
  withLessonDone,
  type CourseOutline,
  type Progress,
} from "./progress";
import { createProgressStore } from "./store";

const done = (doneAt: string, score = 5, total = 5) => ({ doneAt, score, total });

describe("reading stored progress", () => {
  test.each([null, "", "not json", "[]", "null", '{"lessons":[]}', '{"lessons":"tdd"}', '{"other":{}}'])(
    "%j counts as nothing done",
    (raw) => {
      expect(parseProgress(raw)).toEqual(NOTHING_DONE);
    },
  );

  test("keeps every well-formed Lesson and drops only the broken ones", () => {
    const raw = JSON.stringify({
      lessons: {
        tdd: done("2026-11-01T10:00:00.000Z", 6, 8),
        "over-total": done("2026-11-01T10:00:00.000Z", 9, 8),
        "no-total": done("2026-11-01T10:00:00.000Z", 0, 0),
        "half-point": done("2026-11-01T10:00:00.000Z", 1.5, 8),
        "bad-date": done("yesterday", 1, 8),
        "no-date": { score: 1, total: 8 },
        "not-an-object": "done",
      },
    });
    expect(parseProgress(raw)).toEqual({ lessons: { tdd: done("2026-11-01T10:00:00.000Z", 6, 8) } });
  });

  test("reads back what it writes, without extra keys", () => {
    const progress: Progress = { lessons: { grilling: done("2026-11-02T08:30:00.000Z", 3, 10) } };
    expect(parseProgress(serializeProgress(progress))).toEqual(progress);
    const extra = JSON.stringify({ lessons: { grilling: { ...done("2026-11-02T08:30:00.000Z"), mood: "great" } } });
    expect(parseProgress(extra).lessons.grilling).toEqual(done("2026-11-02T08:30:00.000Z"));
  });
});

describe("marking a Lesson Done", () => {
  test("records the score and the time, keeping the other Lessons, and changes nothing in place", () => {
    const before: Progress = { lessons: { grilling: done("2026-11-01T10:00:00.000Z") } };
    const after = withLessonDone(before, "tdd", 2, 8, new Date("2026-11-06T12:00:00Z"));
    expect(after).toEqual({
      lessons: { grilling: done("2026-11-01T10:00:00.000Z"), tdd: done("2026-11-06T12:00:00.000Z", 2, 8) },
    });
    expect(before.lessons).not.toHaveProperty("tdd");
  });

  test("a low score still counts, and a retake keeps only the newest score and date", () => {
    const first = withLessonDone(NOTHING_DONE, "tdd", 0, 8, new Date("2026-11-01T10:00:00Z"));
    expect(isDone(first, "tdd")).toBe(true);
    const retaken = withLessonDone(first, "tdd", 7, 8, new Date("2026-11-03T10:00:00Z"));
    expect(retaken.lessons.tdd).toEqual(done("2026-11-03T10:00:00.000Z", 7, 8));
  });

  test("counts the Done Lessons among the ones asked about", () => {
    const progress: Progress = { lessons: { a: done("2026-11-01T10:00:00Z"), c: done("2026-11-01T10:00:00Z") } };
    expect(doneCount(progress, ["a", "b", "c", "d"])).toBe(2);
    expect(isDone(progress, "b")).toBe(false);
    expect(isDone(progress, "toString")).toBe(false);
  });
});

describe("continue where you left off", () => {
  const courses: CourseOutline[] = [
    { slug: "one", title: "One", lessons: [{ slug: "a", title: "A" }, { slug: "b", title: "B" }] },
    { slug: "two", title: "Two", lessons: [{ slug: "c", title: "C" }, { slug: "d", title: "D" }, { slug: "e", title: "E" }] },
    { slug: "three", title: "Three", lessons: [{ slug: "f", title: "F" }] },
  ];
  const at = (day: number) => `2026-11-0${day}T10:00:00.000Z`;
  const target = (lessons: Progress["lessons"]) => {
    const found = continueFrom({ lessons }, courses);
    return found && `${found.course.slug}/${found.lesson.slug}`;
  };

  test("has nowhere to go before anything is Done", () => {
    expect(target({})).toBeNull();
  });

  test("goes to the first Lesson not Done in the Course of the newest Done Lesson", () => {
    expect(target({ a: done(at(1)), d: done(at(2)) })).toBe("two/c");
    expect(target({ d: done(at(1)), a: done(at(2)) })).toBe("one/b");
  });

  test("moves on to the next Course once that one is finished, coming round after the last", () => {
    expect(target({ a: done(at(1)), b: done(at(2)) })).toBe("two/c");
    expect(target({ f: done(at(3)), c: done(at(1)) })).toBe("one/a");
  });

  test("ignores Done Lessons no Course lists any more, and has nowhere to go once all are Done", () => {
    expect(target({ gone: done(at(5)), a: done(at(1)) })).toBe("one/b");
    const all = Object.fromEntries(["a", "b", "c", "d", "e", "f"].map((slug) => [slug, done(at(1))]));
    expect(target(all)).toBeNull();
  });
});

// A stand-in for localStorage.
function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: vi.fn((key: string) => data.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => void data.set(key, value)),
    removeItem: vi.fn((key: string) => void data.delete(key)),
  };
}

// What another tab's change looks like to this one.
const storageEvent = (key: string | null) => Object.assign(new Event("storage"), { key });

describe("the progress store", () => {
  const saved = serializeProgress({ lessons: { grilling: done("2026-11-01T10:00:00.000Z", 4, 5) } });

  test("reads storage once, and hands out the same snapshot until something changes", () => {
    const storage = fakeStorage({ [PROGRESS_KEY]: saved });
    const store = createProgressStore({ storage: () => storage, events: null });
    const first = store.getSnapshot();
    expect(first.lessons.grilling).toEqual(done("2026-11-01T10:00:00.000Z", 4, 5));
    expect(store.getSnapshot()).toBe(first);
    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });

  test("on the server, and while hydrating, nothing is done", () => {
    const store = createProgressStore({ storage: () => fakeStorage({ [PROGRESS_KEY]: saved }), events: null });
    expect(store.getServerSnapshot()).toEqual(NOTHING_DONE);
    expect(createProgressStore({ storage: () => null, events: null }).getSnapshot()).toEqual(NOTHING_DONE);
  });

  test("marking a Lesson Done saves it under its key and tells every listener", () => {
    const storage = fakeStorage();
    const store = createProgressStore({
      storage: () => storage,
      events: null,
      now: () => new Date("2026-11-06T09:00:00Z"),
    });
    const listener = vi.fn();
    store.subscribe(listener);
    store.markDone("tdd", 6, 8);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().lessons.tdd).toEqual(done("2026-11-06T09:00:00.000Z", 6, 8));
    expect(JSON.parse(storage.data.get(PROGRESS_KEY)!)).toEqual({ lessons: { tdd: done("2026-11-06T09:00:00.000Z", 6, 8) } });
  });

  test("reset forgets everything, in storage too", () => {
    const storage = fakeStorage({ [PROGRESS_KEY]: saved });
    const store = createProgressStore({ storage: () => storage, events: null });
    const listener = vi.fn();
    store.subscribe(listener);
    store.reset();
    expect(store.getSnapshot()).toEqual(NOTHING_DONE);
    expect(storage.data.has(PROGRESS_KEY)).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("storage that can't be read counts as nothing done", () => {
    const store = createProgressStore({
      storage: () => {
        throw new Error("SecurityError");
      },
      events: null,
    });
    expect(store.getSnapshot()).toEqual(NOTHING_DONE);
  });

  test("when storage can't be written (a private window), the tab keeps the progress for this visit", () => {
    const storage = fakeStorage({ [PROGRESS_KEY]: saved });
    storage.setItem.mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const events = new EventTarget();
    const store = createProgressStore({ storage: () => storage, events });
    store.subscribe(() => {});
    store.markDone("tdd", 1, 5);
    events.dispatchEvent(storageEvent(PROGRESS_KEY));
    expect(Object.keys(store.getSnapshot().lessons).sort()).toEqual(["grilling", "tdd"]);
  });

  test("another tab's change to the progress reaches this tab; other keys don't", () => {
    const storage = fakeStorage();
    const events = new EventTarget();
    const store = createProgressStore({ storage: () => storage, events });
    const listener = vi.fn();
    store.subscribe(listener);

    storage.data.set("other-key", "1");
    events.dispatchEvent(storageEvent("other-key"));
    expect(listener).not.toHaveBeenCalled();

    storage.data.set(PROGRESS_KEY, saved);
    events.dispatchEvent(storageEvent(PROGRESS_KEY));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(isDone(store.getSnapshot(), "grilling")).toBe(true);

    storage.data.clear();
    events.dispatchEvent(storageEvent(null));
    expect(listener).toHaveBeenCalledTimes(2);
    expect(store.getSnapshot()).toEqual(NOTHING_DONE);
  });

  test("marking Done keeps a save from another tab whose storage event never arrived", () => {
    const storage = fakeStorage();
    const events = new EventTarget();
    const store = createProgressStore({ storage: () => storage, events });
    store.subscribe(() => {});
    // Another tab saved while this page sat in the back/forward cache.
    storage.data.set(PROGRESS_KEY, saved);
    store.markDone("tdd", 6, 8);
    expect(Object.keys(JSON.parse(storage.data.get(PROGRESS_KEY)!).lessons).sort()).toEqual(["grilling", "tdd"]);
  });

  test("a page restored from the back/forward cache catches up on what other tabs saved", () => {
    const storage = fakeStorage();
    const events = new EventTarget();
    const store = createProgressStore({ storage: () => storage, events });
    const listener = vi.fn();
    store.subscribe(listener);
    storage.data.set(PROGRESS_KEY, saved);

    events.dispatchEvent(Object.assign(new Event("pageshow"), { persisted: false }));
    expect(listener).not.toHaveBeenCalled();

    events.dispatchEvent(Object.assign(new Event("pageshow"), { persisted: true }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(isDone(store.getSnapshot(), "grilling")).toBe(true);
  });

  test("stops listening for other tabs once its last listener leaves, and catches up when one returns", () => {
    const storage = fakeStorage();
    const events = new EventTarget();
    const store = createProgressStore({ storage: () => storage, events });
    store.getSnapshot();
    const listener = vi.fn();
    store.subscribe(listener)();

    storage.data.set(PROGRESS_KEY, saved);
    events.dispatchEvent(storageEvent(PROGRESS_KEY));
    expect(listener).not.toHaveBeenCalled();

    store.subscribe(listener);
    expect(isDone(store.getSnapshot(), "grilling")).toBe(true);
  });
});
