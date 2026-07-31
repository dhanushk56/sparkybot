import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    BOT_API_URL: !!process.env.BOT_API_URL,
    BOT_API_URL_length: process.env.BOT_API_URL ? process.env.BOT_API_URL.length : 0,
    BOT_API_SECRET: !!process.env.BOT_API_SECRET,
    DISCORD_CLIENT_ID: !!process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: !!process.env.DISCORD_CLIENT_SECRET,
    SESSION_SECRET: !!process.env.SESSION_SECRET,
  });
}
