import { NextResponse } from "next/server";
import { z } from "zod";
import { consentStore } from "@/lib/store";
import { getSession } from "@/lib/session";

const ConsentBody = z.object({
  version: z.number().int().min(1),
  timestamp: z.string(),
  necessary: z.literal(true),
  analytics: z.boolean(),
  personalization: z.boolean(),
  marketing: z.boolean(),
  method: z.enum(["accept_all", "reject_all", "custom"]),
});

function sessionIdFrom(request: Request): string {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/sherpa_session=([^;]+)/);
  return match?.[1]?.slice(-16) ?? "anonymous";
}

export async function POST(request: Request) {
  const parsed = ConsentBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid consent payload" }, { status: 422 });
  }
  const session = await getSession();
  await consentStore.add({
    userId: session?.userId ?? null,
    sessionId: sessionIdFrom(request),
    version: parsed.data.version,
    necessary: true,
    analytics: parsed.data.analytics,
    personalization: parsed.data.personalization,
    marketing: parsed.data.marketing,
    method: parsed.data.method,
  });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getSession();
  const latest = await consentStore.latest(session?.userId ?? null);
  return NextResponse.json({ consent: latest ?? null });
}
