import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";

export const metadata = { title: "Login — SparkyBot" };

export default async function LoginPage({ searchParams }) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050507] px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/10 via-dark-bg to-gold-secondary/5"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-20 -right-20 w-96 h-96 bg-gold-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-gold-secondary/15 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>

      <div
        className="relative z-10 w-full max-w-[420px] glass-card rounded-[2rem] p-8 sm:p-10 text-center transition-all duration-500"
        style={{ animation: "cardIn 0.5s var(--ease-smooth)" }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-primary to-gold-secondary flex items-center justify-center text-black font-orbitron font-black text-3xl drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
          S
        </div>
        <h1 className="font-orbitron font-bold text-2xl sm:text-3xl text-white mb-2">
          Welcome back
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-8">
          Sign in with Discord to manage your servers, write reviews, and access your SparkyBot dashboard.
        </p>

        {searchParams?.error && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 text-red-400 text-sm px-4 py-3">
            {searchParams.error === "auth_failed"
              ? "Something went wrong signing you in. Please try again."
              : "Please sign in to continue."}
          </div>
        )}

        <a
          href="/api/auth/login"
          className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(88,101,242,0.45)] text-white font-semibold px-6 py-3.5 text-base"
        >
          <svg width="22" height="22" viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
          </svg>
          Continue with Discord
        </a>

        <p className="text-gray-500 text-xs mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-gold-primary hover:underline">Terms</a> and{" "}
          <a href="/privacy" className="text-gold-primary hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}
