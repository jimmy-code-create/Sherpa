/**
 * AI provider abstraction.
 *
 * The app never calls a model directly. It calls `complete()`, which routes to
 * one of the configured providers. With `AI_PROVIDER=local` (the default) no
 * network call is made at all — the deterministic curriculum composers in this
 * folder produce the artifact. That keeps the product fully functional without
 * an API key, and makes every test runnable offline.
 */
export type ProviderName = "openai" | "anthropic" | "gemini" | "local";

export interface CompletionRequest {
  system: string;
  user: string;
  /** Ask the provider for JSON-only output. */
  json?: boolean;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface CompletionResult {
  text: string;
  provider: ProviderName;
  model: string;
}

export function activeProvider(): ProviderName {
  const raw = (process.env.AI_PROVIDER ?? "local").toLowerCase();
  if (raw === "openai" || raw === "anthropic" || raw === "gemini") return raw;
  return "local";
}

export function providerAvailable(name: ProviderName = activeProvider()): boolean {
  switch (name) {
    case "openai":
      return Boolean(process.env.OPENAI_API_KEY);
    case "anthropic":
      return Boolean(process.env.ANTHROPIC_API_KEY);
    case "gemini":
      return Boolean(process.env.GEMINI_API_KEY);
    default:
      return true;
  }
}

async function callOpenAI(req: CompletionRequest): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: req.system },
        { role: "user", content: req.user },
      ],
      max_tokens: req.maxTokens ?? 3000,
      ...(req.json ? { response_format: { type: "json_object" } } : {}),
    }),
    signal: req.signal,
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { choices: { message: { content: string } }[] };
  return body.choices[0]?.message.content ?? "";
}

async function callAnthropic(req: CompletionRequest): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest",
      max_tokens: req.maxTokens ?? 3000,
      system: req.system,
      messages: [{ role: "user", content: req.user }],
    }),
    signal: req.signal,
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { content: { text: string }[] };
  return body.content.map((c) => c.text).join("");
}

async function callGemini(req: CompletionRequest): Promise<string> {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: req.system }] },
        contents: [{ role: "user", parts: [{ text: req.user }] }],
        generationConfig: {
          maxOutputTokens: req.maxTokens ?? 3000,
          ...(req.json ? { responseMimeType: "application/json" } : {}),
        },
      }),
      signal: req.signal,
    },
  );
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
  };
  return body.candidates[0]?.content.parts.map((p) => p.text).join("") ?? "";
}

/** Low-level completion. Local mode has no text model by design. */
export async function complete(req: CompletionRequest): Promise<CompletionResult> {
  const provider = activeProvider();
  if (provider === "local") {
    throw new Error(
      "AI_PROVIDER=local has no text model. Sherpa's composers generate artifacts deterministically; set AI_PROVIDER plus a key to use a hosted model.",
    );
  }
  if (!providerAvailable(provider)) {
    throw new Error(`AI_PROVIDER=${provider} but its API key is not set`);
  }
  const text =
    provider === "openai"
      ? await callOpenAI(req)
      : provider === "anthropic"
        ? await callAnthropic(req)
        : await callGemini(req);
  const model =
    provider === "openai"
      ? (process.env.OPENAI_MODEL ?? "gpt-4o-mini")
      : provider === "anthropic"
        ? (process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest")
        : (process.env.GEMINI_MODEL ?? "gemini-2.0-flash");
  return { text, provider, model };
}

/** True when a hosted model is configured and usable. */
export function usingHostedModel(): boolean {
  return activeProvider() !== "local" && providerAvailable();
}
