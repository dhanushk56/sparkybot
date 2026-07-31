import { cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE_NAME } from "./session";

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await readSessionToken(token);
  return session;
}
