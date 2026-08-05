import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { updateApplication, toggleApplication, deleteApplication } from "@/lib/botApi";

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
    }
    const data = await request.json();
    const result = await updateApplication(user.id, params.guildId, params.name, data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API] PUT /applications error:", err);
    return NextResponse.json(
      { detail: err.message || "Internal server error" },
      { status: 502 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
    }
    const { open } = await request.json();
    const result = await toggleApplication(user.id, params.guildId, params.name, open);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API] PATCH /applications error:", err);
    return NextResponse.json(
      { detail: err.message || "Internal server error" },
      { status: 502 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
    }

    // ✅ The bot API expects user.id as the first argument – no query param needed
    const result = await deleteApplication(user.id, params.guildId, params.name);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API] DELETE /applications error:", err);
    return NextResponse.json(
      { detail: err.message || "Internal server error" },
      { status: 502 }
    );
  }
}