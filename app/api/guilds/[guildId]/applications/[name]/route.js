// app/api/guilds/[guildId]/applications/[name]/route.js
import { getApiSecret } from "@/lib/auth";
import { NextResponse } from "next/server";

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:25567";

export async function PUT(request, { params }) {
  const { guildId, name } = params;
  const body = await request.json();
  
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      headers: {
        "x-api-secret": getApiSecret(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  
  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }
  
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PATCH(request, { params }) {
  const { guildId, name } = params;
  const body = await request.json();
  
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`,
    {
      method: "PATCH",
      headers: {
        "x-api-secret": getApiSecret(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  
  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }
  
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const { guildId, name } = params;
  
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`,
    {
      method: "DELETE",
      headers: {
        "x-api-secret": getApiSecret(),
      },
    }
  );
  
  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }
  
  const data = await res.json();
  return NextResponse.json(data);
}
