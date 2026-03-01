import { CONFIG } from "./config";
import type { ApiResponse } from "./config";
import { mergeProducts } from "./product-map";

export function extractWishlistUid(): string | null {
  const uidRegex = /wishlistOwnerId["\s:\\]+([a-f0-9-]{36})/;
  for (const script of Array.from(document.scripts)) {
    const text = script.textContent;
    if (!text?.includes("wishlistOwnerId")) continue;
    const match = text.match(uidRegex);
    if (match) return match[1];
  }
  return null;
}

export async function fetchAllProducts(uid: string): Promise<void> {
  let totalPages = 1;
  for (let page = 0; page <= totalPages; page++) {
    if (page === 1) continue;
    try {
      const response = await fetch(`${CONFIG.API}?uid=${uid}&p=${page}`);
      if (!response.ok) break;
      const data = (await response.json()) as ApiResponse;
      if (data?.totalPages != null) totalPages = data.totalPages;
      if (!data?.products?.length) break;
      mergeProducts(data.products);
    } catch {
      break;
    }
  }
}

export async function waitForUid(): Promise<string | null> {
  for (let attempt = 0; attempt < CONFIG.UID_RETRIES; attempt++) {
    const uid = extractWishlistUid();
    if (uid) return uid;
    await new Promise<void>((resolve) => setTimeout(resolve, CONFIG.UID_RETRY_DELAY_MS));
  }
  return null;
}
