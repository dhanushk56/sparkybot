import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { avatarUrl } from "@/lib/discord";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      avatar: avatarUrl(user),
    },
  });
}
