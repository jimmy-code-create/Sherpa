"use client";

import * as React from "react";
import { WifiOff, RefreshCw } from "lucide-react";

/** Registers the service worker after first paint. */
export function PwaRegistration() {
  const [offline, setOffline] = React.useState(false);
  const [updateReady, setUpdateReady] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setOffline(!navigator.onLine);

    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          if (reg.waiting) setUpdateReady(true);
          reg.addEventListener("updatefound", () => {
            const installing = reg.installing;
            installing?.addEventListener("statechange", () => {
              if (installing.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateReady(true);
              }
            });
          });
        })
        .catch(() => {
          /* SW is progressive enhancement only */
        });
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <>
      {offline ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 top-0 z-[70] flex items-center justify-center gap-2 bg-[#1f2937] px-4 py-2 text-sm font-semibold text-white"
        >
          <WifiOff className="size-4" aria-hidden="true" />
          You&apos;re offline — showing your cached chapters.
        </div>
      ) : null}
      {updateReady ? (
        <div className="fixed bottom-4 left-4 z-[70] flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2 text-sm shadow-lg">
          <RefreshCw className="size-4 text-[var(--brand-primary)]" aria-hidden="true" />
          A newer version is ready.
          <button
            type="button"
            className="font-bold text-[var(--brand-primary)] underline"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      ) : null}
    </>
  );
}
