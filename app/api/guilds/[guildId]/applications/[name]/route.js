import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { updateApplication, toggleApplication, deleteApplication } from "@/lib/botApi";

export async function PUT(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  const data = await request.json();
  try {
    const result = await updateApplication(user.id, params.guildId, params.name, data);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  const { open } = await request.json();
  try {
    const result = await toggleApplication(user.id, params.guildId, params.name, open);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}

export async function DELETE(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  try {
    const result = await deleteApplication(user.id, params.guildId, params.name);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}
