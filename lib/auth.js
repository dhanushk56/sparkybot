// lib/auth.js

/**
 * Get the API secret for authenticating with the bot's API.
 * This must match the DASHBOARD_API_SECRET in your bot's config.py.
 */
export function getApiSecret() {
  // Hardcoded to match config.py
  return "QqPYvJJVXFDTJtREvNfi1V-t0MGT2SUJVMiIUcylJ34";
}

/**
 * Get the currently logged-in user from localStorage.
 * Returns null if no user is logged in.
 */
export function getUser() {
  if (typeof window !== "undefined") {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Get the current user ID, or null if not logged in.
 */
export function getUserId() {
  const user = getUser();
  return user?.id || null;
}
