export const CONFIG = {
  API: "https://fetta.app/api/product/products/public/get",
  OZON_PREFIX: "https://www.ozon.ru/product/",
  ORIGIN: "https://fetta.app",
  MARKER: "data-fetta-ozon",
  OBSERVER_MARKER: "data-fetta-obs",
  IMG_SRC_MATCH: "ozone.ru",
  IMG_ALT: "Product picture",
  CARD_SELECTOR: "div.group.relative.h-fit.cursor-pointer.select-none",
  CARD_SELECTOR_FALLBACK: 'div[class*="group"][class*="relative"][class*="cursor-pointer"]',
  BOX_SELECTOR: "div.flex.flex-col.gap-\\[5px\\]",
  BOX_SELECTOR_FALLBACK: 'div[class*="flex"][class*="flex-col"]',
  DEBOUNCE_MS: 200,
  UID_RETRIES: 3,
  UID_RETRY_DELAY_MS: 1000,
} as const;

export type Product = { imageUrl?: string; externalId?: string };

export type FettaOzonMessage = { type: "FETTA_OZON_MAP"; map: Record<string, string> };

export type ApiResponse = { totalPages?: number; products?: Product[] };
