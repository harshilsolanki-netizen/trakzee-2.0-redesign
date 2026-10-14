import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth, AUTH_CREDENTIALS } from "@/auth/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function LoginPage() {
  const { login } = useAuth();
  const [userId, setUserId] = useState("design.uffizio.com");
  const [password, setPassword] = useState("Design@123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!userId.trim()) {
      setErrorMessage("Please enter your User ID or Email.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(userId, password, rememberMe);
      setIsSubmitting(false);

      if (!success) {
        setErrorMessage(
          `Invalid credentials. Please use ID: ${AUTH_CREDENTIALS.id} and Pass: ${AUTH_CREDENTIALS.password}`,
        );
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row justify-between items-center p-6 sm:p-10 lg:p-14 xl:p-16 select-none overflow-x-hidden">
      {/* ── FULLSCREEN HIGH-QUALITY BACKDROP (0 degradation) ── */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/auth-truck-city.jpg"
          alt="Trakzee Fleet Solution"
          className="h-full w-full object-cover object-center"
          loading="eager"
          decoding="sync"
        />
        {/* Balanced cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* ── LEFT SIDE: LOGO & TAGLINE (ALL LEFT-ALIGNED) ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-between self-stretch w-full py-2 sm:py-4">
        {/* Logo on the left side */}
        <div className="text-left">
          <img
            src="/images/trakzee-logo-white.png"
            alt="Trakzee"
            className="h-10 sm:h-12 xl:h-13 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Tagline on the left side (42px font, left-aligned) */}
        <div className="pt-16 pb-2 text-left max-w-xl">
          <h1 className="text-[28px] sm:text-[36px] xl:text-[42px] font-bold text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] leading-tight text-left">
            One Platform. Complete Fleet Solution.
          </h1>
          <p className="text-[11px] text-slate-400/80 drop-shadow mt-2 text-left">
            © 2026 Uffizio. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDE: LIGHT THEME LOGIN CARD (FLOATING ON RIGHT, EVERYTHING LEFT-ALIGNED) ── */}
      <div className="relative z-10 w-full lg:w-[420px] shrink-0 flex justify-center lg:justify-end my-auto pt-8 lg:pt-0">
        <div className="w-full max-w-[420px] rounded-2xl bg-white shadow-2xl shadow-black/70 border border-slate-100 p-7 sm:p-9 space-y-6 text-slate-900 text-left">
          {/* Card Header: Left-Aligned */}
          <div className="text-left space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-left">
              Sign in to your account
            </h2>
            <p className="text-xs text-slate-500 font-medium text-left">
              Enter your authorized credentials to access your fleet console
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-in fade-in duration-200 text-left">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Main Login Form: Left-Aligned */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* User ID Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="user-id"
                className="block text-xs font-semibold text-slate-700 text-left"
              >
                User ID / Domain Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="user-id"
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="e.g. design.uffizio.com"
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 text-left"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 text-left"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all focus:border-[#0089FF] focus:outline-none focus:ring-2 focus:ring-[#0089FF]/20 text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-[#0089FF] focus:ring-[#0089FF]/30 cursor-pointer accent-[#0089FF]"
                />
                <span className="font-medium text-slate-600">
                  Remember my session
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  toast.info("Password Reset Assistance", {
                    description: `For account recovery, use password "${AUTH_CREDENTIALS.password}" or contact support@uffizio.com.`,
                  })
                }
                className="font-medium text-[#0089FF] hover:underline cursor-pointer transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button: Strictly "Sign In" */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex w-full items-center justify-center rounded-xl bg-[#0089FF] hover:bg-[#0070d6] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#0089FF]/25 transition-all cursor-pointer active:scale-99 disabled:opacity-70",
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Footer Info: Left-Aligned */}
          <div className="text-left pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 text-left">
              Protected by Uffizio 256-bit Fleet Security Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
