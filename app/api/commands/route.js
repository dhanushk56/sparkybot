import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.BOT_API_URL;
    if (!url) {
      console.error("❌ BOT_API_URL not set");
      return NextResponse.json({ commands: [], error: "BOT_API_URL not configured" }, { status: 502 });
    }
    
    const apiUrl = `${url.replace(/\/$/, "")}/api/commands`;
    console.log("🔗 Fetching commands from:", apiUrl);
    console.log("🔑 Using API Secret:", process.env.BOT_API_SECRET ? "✓ Set" : "✗ Not set");
    
    let res;
    try {
      res = await fetch(apiUrl, {
        headers: { "X-Api-Secret": process.env.BOT_API_SECRET || "" },
        cache: "no-store",
      });
      console.log("📊 API Response status:", res.status, res.statusText);
    } catch (fetchError) {
      console.error("🚨 Network error connecting to bot API:", fetchError.message);
      return NextResponse.json({ 
        commands: [], 
        error: `Network error: ${fetchError.message}`,
        debug: { apiUrl, fetchError: fetchError.message }
      }, { status: 502 });
    }
    
    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Bot API error ${res.status}:`, text);
      return NextResponse.json({ 
        commands: [], 
        error: `API error: ${res.status}`,
        debug: { apiUrl, status: res.status, responseText: text }
      }, { status: 502 });
    }
    
    const data = await res.json();
    console.log("✅ Commands received:", data.commands?.length || 0, "commands");
    return NextResponse.json(data);
  } catch (error) {
    console.error("⚠️ Unexpected error:", error.message);
    return NextResponse.json({ 
      commands: [], 
      error: error.message,
      debug: { message: error.message }
    }, { status: 502 });
  }
}
