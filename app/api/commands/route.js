import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.BOT_API_URL;
    if (!url) {
      console.error("BOT_API_URL not set");
      return NextResponse.json({ commands: [], error: "BOT_API_URL not configured" });
    }
    const apiUrl = `${url.replace(/\/$/, "")}/api/commands`;
    console.log("🔗 Fetching commands from:", apiUrl);
    console.log("🔑 Using API Secret:", process.env.BOT_API_SECRET ? "✓ Set" : "✗ Not set");
    
    const res = await fetch(apiUrl, {
      headers: { "X-Api-Secret": process.env.BOT_API_SECRET || "" },
      cache: "no-store",
    });
    
    console.log("📊 API Response status:", res.status, res.statusText);
    
    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Bot API error ${res.status}:`, text);
      return NextResponse.json({ 
        commands: [], 
        error: `API error: ${res.status}`,
        debug: { apiUrl, status: res.status, responseText: text }
      });
    }
    
    const data = await res.json();
    console.log("✅ Commands received:", data.commands?.length || 0, "commands");
    return NextResponse.json(data);
  } catch (error) {
    console.error("⚠️ Error fetching commands:", error.message);
    return NextResponse.json({ 
      commands: [], 
      error: error.message,
      debug: { message: error.message }
    }, { status: 502 });
  }
}
