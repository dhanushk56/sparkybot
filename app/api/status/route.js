import { NextResponse } from "next/server";
import { getBotStatus } from "@/lib/botApi";

export async function GET() {
  try {
    const data = await getBotStatus();
    return NextResponse.json({
      status: data.status ?? "offline",
      online: !!data.online,
      uptime: data.uptime ?? "0s",
      uptime_seconds: data.uptime_seconds ?? 0,
      servers: data.servers ?? 0,
      users: data.users ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "offline",
        online: false,
        uptime: "0s",
        uptime_seconds: 0,
        servers: 0,
        users: 0,
        error: error.message,
      },
      { status: 200 }
    );
  }
}
