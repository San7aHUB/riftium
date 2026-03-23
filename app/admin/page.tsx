"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminLoginPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) router.replace("/");
  }, [isAdmin, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o password errati.");
      setSubmitting(false);
    } else {
      router.replace("/");
    }
  };

  if (loading) return null;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "380px",
        background: "rgba(14,14,20,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "40px 36px",
        backdropFilter: "blur(32px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Logo / title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontFamily: "'Tilt Warp', sans-serif",
            fontSize: "22px",
            letterSpacing: "0.12em",
            color: "#fff",
            marginBottom: "6px",
          }}>RIFTIUM</div>
          <div style={{ fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>
            ADMIN ACCESS
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "12px 16px",
              color: "#fff",
              fontSize: "13px",
              outline: "none",
              fontFamily: "inherit",
              width: "100%",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "12px 16px",
              color: "#fff",
              fontSize: "13px",
              outline: "none",
              fontFamily: "inherit",
              width: "100%",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />

          {error && (
            <div style={{
              fontSize: "12px", color: "#f87171",
              padding: "10px 14px", borderRadius: "8px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "6px",
              padding: "13px",
              borderRadius: "10px",
              border: "none",
              background: submitting ? "rgba(192,132,252,0.3)" : "rgba(192,132,252,0.8)",
              color: "#fff",
              fontSize: "12px",
              letterSpacing: "0.12em",
              fontWeight: 600,
              cursor: submitting ? "default" : "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "rgba(192,132,252,1)"; }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "rgba(192,132,252,0.8)"; }}
          >
            {submitting ? "..." : "ACCEDI"}
          </button>
        </form>
      </div>
    </div>
  );
}
