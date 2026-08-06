import { NextResponse } from "next/server";

const BOT_START_TIME = Date.now() - 10 * 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const uptime = Math.floor((Date.now() - BOT_START_TIME) / 1000);

    return NextResponse.json({
      status: "online",
      online: true,          // ← added (boolean StatusWidget checks)
      uptime: uptime,
      startTime: BOT_START_TIME,
      servers: "--",         // ← added
      users: "--",           // ← added
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "offline",
        online: false,
        uptime: 0,
        servers: "--",
        users: "--",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
