// lib/auth.js
export function getApiSecret() {
  // Get from environment variable or localStorage
  return process.env.NEXT_PUBLIC_API_SECRET || "your-secret-key";
}

export function getUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}
