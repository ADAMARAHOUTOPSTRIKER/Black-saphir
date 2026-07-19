/** Coordination between the preloader and the hero intro timeline. */

export const INTRO_EVENT = "convers:intro-done";

export function introDone(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.introDone === "true";
}

export function markIntroDone() {
  document.documentElement.dataset.introDone = "true";
  document.documentElement.removeAttribute("data-intro-active");
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/** Run `cb` once the preloader has wiped away (immediately if it already has). */
export function onIntroDone(cb: () => void): () => void {
  if (introDone()) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}
