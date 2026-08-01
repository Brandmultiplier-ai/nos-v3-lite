import { NextResponse } from "next/server";
import { resolveAccessCode } from "@/lib/auth-codes";

const COOKIE_NAME = "nos_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function logAttempt(
  request: Request,
  result: "success" | "failure",
  codeId?: string,
) {
  const url = process.env.N8N_LOG_WEBHOOK_URL;
  if (!url) return;

  const payload = {
    timestamp: new Date().toISOString(),
    result,
    codeId: codeId ?? null,
    ip: request.headers.get("x-forwarded-for") ?? "unknown",
    country: request.headers.get("x-vercel-ip-country"),
    city: request.headers.get("x-vercel-ip-city"),
    region: request.headers.get("x-vercel-ip-country-region"),
    userAgent: request.headers.get("user-agent"),
  };

  // Fire-and-forget — logging must never block or break login.
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // ignore — logging failures must not affect auth
  });
}

export async function POST(request: Request) {
  const { password } = await request.json();

  const matched = resolveAccessCode(password);
  if (!matched) {
    logAttempt(request, "failure");
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  logAttempt(request, "success", matched.id);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
