const API_PATH = "fetta.app/api/product/products/public/get";

interface FettaProduct {
  imageUrl?: string;
  externalId?: string;
}

interface FettaApiPayload {
  products?: FettaProduct[];
}

function normalizeUrl(urlOrUndefined: string | undefined): string {
  return typeof urlOrUndefined === "string" ? urlOrUndefined.split("?")[0] : "";
}

function getRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof Request) return input.url;
  return String(input);
}

function extractProductMap(products: FettaProduct[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const product of products) {
    if (product?.imageUrl != null && product?.externalId != null) {
      map[normalizeUrl(product.imageUrl)] = String(product.externalId);
    }
  }
  return map;
}

(function (): void {
  const nativeFetch = window.fetch;

  const patchedFetch = function (
    this: Window,
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const url = getRequestUrl(input);
    if (!url.includes(API_PATH)) {
      return nativeFetch.apply(this, arguments as unknown as [RequestInfo | URL, RequestInit?]);
    }

    return nativeFetch
      .apply(this, arguments as unknown as [RequestInfo | URL, RequestInit?])
      .then(async (response: Response) => {
        if (!response.ok) return response;
        try {
          const data = (await response.clone().json()) as FettaApiPayload;
          if (!Array.isArray(data?.products)) return response;
          const map = extractProductMap(data.products);
          if (Object.keys(map).length > 0) {
            window.postMessage({ type: "FETTA_OZON_MAP", map }, "*");
          }
        } catch {
        }
        return response;
      });
  };

  (window as unknown as { fetch: typeof patchedFetch }).fetch = patchedFetch;
})();
