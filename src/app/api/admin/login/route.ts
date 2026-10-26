import { NextResponse } from "next/server";
import { checkPassword, setAdminSession } from "@/lib/auth";
import { rateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const key = getClientKey(req);
  if (!rateLimit(`admin-login:${key}`, 10, 60_000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (!process.env.ADMIN_DASHBOARD_PASSWORD) {
    return NextResponse.json(
      { error: "not_configured", message: "ADMIN_DASHBOARD_PASSWORD is not set on the server." },
      { status: 500 }
    );
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
