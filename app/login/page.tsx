"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      if (res.ok) {
        setSuccess("Welcome! Passcode accepted — entering the dashboard…");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 900);
      } else {
        setError("Password is incorrect. Please try again.");
        setValue("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const borderColor = error
    ? "var(--nos-negative)"
    : success
    ? "var(--nos-positive)"
    : "var(--border)";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--nos-bg-canvas)" }}
    >
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle, var(--nos-accent) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background:
                "linear-gradient(135deg, var(--nos-accent-muted) 0%, rgba(167,139,250,0.12) 100%)",
              border: "1px solid var(--nos-accent-border)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 18V6l8-2 8 2v12l-8 2-8-2Z"
                stroke="var(--nos-accent)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M4 6l8 4 8-4M12 10v10"
                stroke="var(--nos-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--nos-text-primary)" }}
          >
            NOS
          </h1>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--nos-text-muted)" }}
          >
            Narrative Operating System
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--nos-bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          <h2
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--nos-text-primary)" }}
          >
            Enter passcode to continue
          </h2>
          <p
            className="text-xs mb-6"
            style={{ color: "var(--nos-text-muted)" }}
          >
            This dashboard is private. Enter your team passcode to access it.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Passcode"
                  autoComplete="current-password"
                  disabled={!!success}
                  className="w-full rounded-xl py-3 pl-4 pr-11 text-sm outline-none transition-all"
                  style={{
                    background: "var(--nos-bg-elevated)",
                    border: `1px solid ${borderColor}`,
                    color: "var(--nos-text-primary)",
                    fontFamily: "var(--font-geist-mono)",
                    letterSpacing: showPassword ? "normal" : "0.15em",
                  }}
                  onFocus={(e) => {
                    if (!error && !success) {
                      e.currentTarget.style.borderColor = "var(--nos-accent-border)";
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = borderColor;
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                  style={{ color: "var(--nos-text-muted)" }}
                  aria-label={showPassword ? "Hide passcode" : "Show passcode"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p
                  className="text-[11px] mt-1.5 font-medium"
                  style={{ color: "var(--nos-negative)" }}
                >
                  {error}
                </p>
              )}
              {success && (
                <p
                  className="text-[11px] mt-1.5 font-medium"
                  style={{ color: "var(--nos-positive)" }}
                >
                  {success}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !value || !!success}
              className="w-full rounded-xl py-3 text-sm font-semibold transition-all"
              style={{
                background: loading || success
                  ? "var(--nos-accent-muted)"
                  : "linear-gradient(135deg, var(--nos-accent) 0%, var(--nos-accent-2, var(--nos-accent)) 100%)",
                color: loading || success ? "var(--nos-text-muted)" : "#fff",
                opacity: !value ? 0.5 : 1,
                cursor: !value || loading || success ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying…" : success ? "Welcome!" : "Enter dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
