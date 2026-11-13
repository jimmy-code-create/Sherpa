import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  const url = new URL("/", request.url);
  return NextResponse.redirect(url, { status: 303 });
}
