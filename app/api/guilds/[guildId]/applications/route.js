import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { getApplications, createApplication } from "@/lib/botApi";

export async function GET(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  try {
    const result = await getApplications(user.id, params.guildId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  const data = await request.json();
  try {
    const result = await createApplication(user.id, params.guildId, data);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}
