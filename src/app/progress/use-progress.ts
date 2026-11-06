import { useSyncExternalStore } from "react";
import type { Progress } from "./progress";
import { progressStore } from "./store";

// The Visitor's progress, kept up to date as they (or their other tabs)
// finish Lessons. While the page renders on the server and hydrates it's
// "nothing done", so what the server sent always matches the first render.
export function useProgress(): Progress {
  return useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getServerSnapshot);
}

const noSubscription = () => () => {};

// False on the server and while hydrating, then true: for what only works
// with JavaScript running, such as a button, or progress read from the
// browser. Until then a component shows what works without it.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
}
