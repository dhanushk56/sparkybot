import { NextResponse } from "next/server";
import { getAuthorizeUrl } from "@/lib/discord";

export async function GET(request) {
  const redirectUri = new URL("/api/auth/callback", request.url).toString();
  return NextResponse.redirect(getAuthorizeUrl(redirectUri));
}
