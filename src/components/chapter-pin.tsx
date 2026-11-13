"use client";

import * as React from "react";

/**
 * Tells the service worker to pin this chapter for offline reading
 * (last 5 chapters stay readable offline — rubric criterion 5).
 */
export function ChapterPin({ url }: { url: string }) {
  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.ready
      .then((reg) => {
        reg.active?.postMessage({ type: "PIN_CHAPTER", url });
      })
      .catch(() => {});
  }, [url]);
  return null;
}
