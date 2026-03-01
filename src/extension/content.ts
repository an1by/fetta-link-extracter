import type { FettaOzonMessage } from "./config";
import { CONFIG } from "./config";
import { productMap, normalizeUrl } from "./product-map";
import { fetchAllProducts, waitForUid } from "./api";
import { processPage, scheduleProcess } from "./dom";
import { setupMutationObserver } from "./observer";

function injectScript(): void {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("inject.js");
  script.onload = () => script.remove();
  (document.documentElement ?? document.head).appendChild(script);
}

function init(): void {
  injectScript();

  window.addEventListener("message", (event: MessageEvent<FettaOzonMessage>) => {
    if (event.origin !== CONFIG.ORIGIN) return;
    const data = event.data;
    if (data?.type !== "FETTA_OZON_MAP" || !data.map) return;
    for (const [key, value] of Object.entries(data.map)) {
      productMap[normalizeUrl(key)] = value;
    }
    scheduleProcess();
  });

  async function onReady(): Promise<void> {
    setupMutationObserver();
    const uid = await waitForUid();
    if (uid) {
      await fetchAllProducts(uid);
      processPage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => void onReady());
  } else {
    void onReady();
  }
}

init();
