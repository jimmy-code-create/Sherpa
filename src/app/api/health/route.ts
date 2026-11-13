import { NextResponse } from "next/server";
import { kvHealth, useSupabase } from "@/lib/store";

/**
 * Public, secret-free liveness probe. Tells us (and ops) whether the app is
 * running in Supabase-backed mode and whether the sherpa_kv read path works
 * from the current host — used to debug "sign-in loops / lost accounts" on
 * serverless where the filesystem is read-only.
 */
export async function GET() {
  const kv = await kvHealth();
  return NextResponse.json({
    ok: true,
    supabaseMode: useSupabase(),
    kv,
    time: new Date().toISOString(),
  });
}
