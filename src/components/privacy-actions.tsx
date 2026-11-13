"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

export function ExportButton() {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function exportData() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/account");
      if (!res.ok) {
        setError("Couldn't build your export. Try again.");
        setPending(false);
        return;
      }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sherpa-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      if (typeof data.markdown === "string" && data.markdown.length > 0) {
        const mdBlob = new Blob([data.markdown], { type: "text/markdown" });
        const mdUrl = URL.createObjectURL(mdBlob);
        const b = document.createElement("a");
        b.href = mdUrl;
        b.download = `sherpa-notes-${new Date().toISOString().slice(0, 10)}.md`;
        b.click();
        URL.revokeObjectURL(mdUrl);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <Button variant="secondary" onClick={() => void exportData()} loading={pending}>
        <Download className="size-4" aria-hidden="true" /> Export my data (JSON + Markdown)
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-[13px] font-semibold text-[#b91c1c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function DeleteAccountForm() {
  const router = useRouter();
  const [confirm, setConfirm] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm, password }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Couldn't delete the account. Check the password and the confirmation word.");
        setPending(false);
        return;
      }
      router.push("/auth/sign-in?deleted=1");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div>
        <label htmlFor="delete-confirm" className="field-label">
          Type <code className="font-mono">DELETE</code> to confirm
        </label>
        <input
          id="delete-confirm"
          className="input font-mono"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="off"
          required
        />
      </div>
      <div>
        <label htmlFor="delete-password" className="field-label">
          Your password
        </label>
        <input
          id="delete-password"
          type="password"
          className="input"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? (
        <p role="alert" className="rounded-[var(--radius-md)] bg-[#fef2f2] px-3 py-2 text-[13.5px] font-semibold text-[#b91c1c]">
          {error}
        </p>
      ) : null}
      <Button variant="danger" type="submit" loading={pending} disabled={confirm !== "DELETE" || !password}>
        <Trash2 className="size-4" aria-hidden="true" /> Delete my account permanently
      </Button>
      <p className="text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
        Immediate sign-out and soft-delete; hard delete completes within 30 days. Generated notes shared with other
        learners are anonymised, not deleted.
      </p>
    </form>
  );
}
