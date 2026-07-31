import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.BOT_API_URL;
    if (!url) return NextResponse.json({ commands: [] });
    const res = await fetch(`${url.replace(/\/$/, "")}/api/commands`, {
      headers: { "X-Api-Secret": process.env.BOT_API_SECRET || "" },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ commands: [] });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ commands: [] });
  }
}
