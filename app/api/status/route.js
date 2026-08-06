import { NextResponse } from "next/server";

// Store the bot start time (replace with actual bot start time from your bot)
// For demo purposes, we'll use a fixed start time (10 days ago)
// In production, you should get this from your bot's actual start time
const BOT_START_TIME = Date.now() - 10 * 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    // Calculate uptime in seconds
    const uptime = Math.floor((Date.now() - BOT_START_TIME) / 1000);

    // Return status and uptime
    return NextResponse.json({
      status: "online",
      uptime: uptime,
      startTime: BOT_START_TIME,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "offline",
        uptime: 0,
        error: error.message,
      },
      { status: 500 }
    );
  }
}