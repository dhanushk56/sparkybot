import { NextResponse } from "next/server";
import { getBotStatus } from "@/lib/botApi";

export async function GET() {
  try {
    const data = await getBotStatus();
    return NextResponse.json({
      online: data.status === "online",
      servers: data.servers,
      users: data.users,
      uptime: data.uptime,
    });
  } catch (err) {
    return NextResponse.json({ online: false }, { status: 200 });
  }
}
