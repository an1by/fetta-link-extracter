import { CONFIG } from "./config";
import { scheduleProcess } from "./dom";

export function isNewContentWithProductImg(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const element = node as Element;
  const selector = `img[src*="${CONFIG.IMG_SRC_MATCH}"]`;
  return element.matches?.(selector) === true || element.querySelector?.(selector) != null;
}

export function setupMutationObserver(): void {
  if (!document.body || document.body.hasAttribute(CONFIG.OBSERVER_MARKER)) return;
  document.body.setAttribute(CONFIG.OBSERVER_MARKER, "");
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (isNewContentWithProductImg(node)) {
          scheduleProcess();
          return;
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
