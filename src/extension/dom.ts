import { CONFIG } from "./config";
import { productMap, normalizeUrl } from "./product-map";

export function createOzonLink(productId: string): HTMLAnchorElement {
  const anchor = document.createElement("a");
  anchor.href = CONFIG.OZON_PREFIX + productId;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.setAttribute(CONFIG.MARKER, "");
  anchor.textContent = "OZON";
  Object.assign(anchor.style, {
    display: "block",
    textAlign: "center",
    color: "#fff",
    background: "#2563eb",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    marginTop: "6px",
  });
  anchor.onclick = (event) => event.stopPropagation();
  return anchor;
}

export function findCard(image: HTMLImageElement): Element | null {
  return (
    image.closest(CONFIG.CARD_SELECTOR) ??
    image.closest(CONFIG.CARD_SELECTOR_FALLBACK)
  );
}

export function findLinkContainer(card: Element): Element {
  const box =
    card.querySelector(CONFIG.BOX_SELECTOR) ??
    card.querySelector(CONFIG.BOX_SELECTOR_FALLBACK);
  return box ?? card;
}

let processTimer: ReturnType<typeof setTimeout> | null = null;

export function processPage(): void {
  if (!document.body) return;
  const selector = `img[src*="${CONFIG.IMG_SRC_MATCH}"]`;
  for (const image of Array.from(document.body.querySelectorAll<HTMLImageElement>(selector))) {
    if (image.alt !== CONFIG.IMG_ALT) continue;
    const card = findCard(image);
    if (!card || card.querySelector(`[${CONFIG.MARKER}]`)) continue;
    const productId = productMap[normalizeUrl(image.src)];
    if (!productId) continue;
    findLinkContainer(card).appendChild(createOzonLink(productId));
  }
}

export function scheduleProcess(): void {
  if (processTimer != null) clearTimeout(processTimer);
  processTimer = setTimeout(processPage, CONFIG.DEBOUNCE_MS);
}
