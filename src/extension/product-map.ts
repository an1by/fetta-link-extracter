import type { Product } from "./config";

export const productMap: Record<string, string> = {};

export function normalizeUrl(urlOrUndefined: string | undefined): string {
  return typeof urlOrUndefined === "string" ? urlOrUndefined.split("?")[0] : "";
}

export function mergeProducts(products: Product[]): void {
  for (const product of products) {
    if (product?.imageUrl != null && product?.externalId != null) {
      productMap[normalizeUrl(product.imageUrl)] = String(product.externalId);
    }
  }
}
