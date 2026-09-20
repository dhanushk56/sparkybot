import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { updateReactionRolePanel, deleteReactionRolePanel } from "@/lib/botApi";

export async function PATCH(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  const data = await request.json();
  try {
    const result = await updateReactionRolePanel(user.id, params.guildId, params.key, data);
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
    const result = await deleteReactionRolePanel(user.id, params.guildId, params.key);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}
