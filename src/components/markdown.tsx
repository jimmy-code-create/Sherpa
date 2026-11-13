"use client";

import * as React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/**
 * Markdown renderer for AI-authored notes.
 *
 * Pipeline: markdown (+GFM tables, +math) → hast → KaTeX → sanitize → HTML.
 * Sanitisation runs last-to-first on output, so even though our composers are
 * deterministic, nothing unsafe can reach dangerouslySetInnerHTML.
 *
 * ```mermaid fences are extracted before rendering and handed to <Mermaid>,
 * so diagrams render as real SVGs client-side.
 */

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className"],
  },
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeStringify);

export function renderMarkdown(source: string): string {
  const file = processor.processSync(source);
  return String(file);
}

/** Split a markdown document into markdown parts and mermaid diagram sources. */
export function splitMermaid(source: string): { kind: "md" | "mermaid"; text: string }[] {
  const parts: { kind: "md" | "mermaid"; text: string }[] = [];
  const pattern = /```mermaid\s*\n([\s\S]*?)```/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    if (match.index > last) parts.push({ kind: "md", text: source.slice(last, match.index) });
    parts.push({ kind: "mermaid", text: match[1]!.trim() });
    last = match.index + match[0].length;
  }
  if (last < source.length) parts.push({ kind: "md", text: source.slice(last) });
  return parts;
}

let mermaidApi: typeof import("mermaid").default | null = null;
let mermaidLoading: Promise<typeof import("mermaid").default> | null = null;

async function getMermaid() {
  if (mermaidApi) return mermaidApi;
  if (!mermaidLoading) {
    mermaidLoading = import("mermaid").then((mod) => {
      mermaidApi = mod.default;
      mermaidApi.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "neutral",
        fontFamily: "Inter, system-ui, sans-serif",
      });
      return mod.default;
    });
  }
  return mermaidLoading;
}

export function Mermaid({ code, id }: { code: string; id: string }) {
  const [svg, setSvg] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    void getMermaid()
      .then(async (mermaid) => {
        try {
          const { svg } = await mermaid.render(`sherpa-${id}`, code);
          if (!cancelled) setSvg(svg);
        } catch {
          if (!cancelled) setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (failed) {
    return (
      <figure className="my-4">
        <pre className="overflow-x-auto rounded-[var(--radius-md)] bg-[var(--bg-subtle)] p-4 text-[13px] leading-relaxed">
          <code>{code}</code>
        </pre>
        <figcaption className="mt-1.5 text-[12.5px] text-[var(--fg-muted)]">
          Diagram source (renderer unavailable offline).
        </figcaption>
      </figure>
    );
  }

  if (!svg) {
    return (
      <div className="my-4 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-subtle)] p-4 text-[13px] text-[var(--fg-secondary)]">
        <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
        Rendering diagram…
      </div>
    );
  }

  return (
    <figure className="my-4 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 [&_svg]:mx-auto">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </figure>
  );
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const parts = React.useMemo(() => splitMermaid(source), [source]);
  const htmlParts = React.useMemo(
    () => parts.map((p) => (p.kind === "md" ? renderMarkdown(p.text) : null)),
    [parts],
  );

  return (
    <div className={className}>
      {parts.map((part, i) =>
        part.kind === "md" ? (
          <div key={i} className="notes-body" dangerouslySetInnerHTML={{ __html: htmlParts[i]! }} />
        ) : (
          <Mermaid key={i} id={`${i}`} code={part.text} />
        ),
      )}
    </div>
  );
}
