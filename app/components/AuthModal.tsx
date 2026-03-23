"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  initialMode?: "login" | "signup";
  onClose: () => void;
}

export default function AuthModal({ initialMode = "login", onClose }: Props) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setEmail(""); setPassword(""); setConfirm(""); setError(""); setMessage(""); };

  const switchMode = (m: "login" | "signup") => { setMode(m); reset(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (mode === "signup" && password !== confirm) {
      setError("Le password non corrispondono.");
      return;
    }
    if (password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri.");
      return;
    }

    setSubmitting(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email o password errati.");
      } else {
        onClose();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Account creato! Controlla la tua email per confermare la registrazione.");
      }
    }

    setSubmitting(false);
  };

  const inputStyle: React.CSSProperties = {
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
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      }} />

      {/* Modal */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10001,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", pointerEvents: "none",
      }}>
        <div style={{
          pointerEvents: "all",
          width: "100%", maxWidth: "380px",
          background: "rgba(14,14,20,0.98)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "32px 28px",
          backdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          animation: "modalIn 0.2s cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
        }}>

          {/* Close */}
          <button onClick={onClose} style={{
            position: "absolute", top: "16px", right: "16px",
            width: "28px", height: "28px", borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)",
            fontSize: "13px", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", transition: "all 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
          >✕</button>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{
              fontFamily: "'Tilt Warp', sans-serif", fontSize: "20px",
              letterSpacing: "0.12em", color: "#fff", marginBottom: "4px",
            }}>RIFTIUM</div>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.04)",
            borderRadius: "10px", padding: "3px", marginBottom: "24px",
          }}>
            {(["login", "signup"] as const).map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: "8px",
                borderRadius: "8px", border: "none",
                background: mode === m ? "rgba(255,255,255,0.1)" : "transparent",
                color: mode === m ? "#fff" : "rgba(255,255,255,0.4)",
                fontFamily: "'Inter', sans-serif", fontSize: "12px",
                fontWeight: 600, letterSpacing: "0.08em",
                cursor: "pointer", transition: "all 0.15s",
              }}>
                {m === "login" ? "ACCEDI" : "REGISTRATI"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} required autoComplete="email"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            {mode === "signup" && (
              <input
                type="password" placeholder="Conferma password" value={confirm}
                onChange={e => setConfirm(e.target.value)} required
                autoComplete="new-password"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            )}

            {error && (
              <div style={{
                fontSize: "12px", color: "#f87171",
                padding: "10px 14px", borderRadius: "8px",
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
              }}>{error}</div>
            )}
            {message && (
              <div style={{
                fontSize: "12px", color: "#34d399",
                padding: "10px 14px", borderRadius: "8px",
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.2)",
              }}>{message}</div>
            )}

            {!message && (
              <button type="submit" disabled={submitting} style={{
                marginTop: "4px", padding: "13px",
                borderRadius: "10px", border: "none",
                background: submitting ? "rgba(255,255,255,0.15)" : "#fff",
                color: submitting ? "rgba(0,0,0,0.4)" : "#000",
                fontSize: "12px", letterSpacing: "0.12em",
                fontWeight: 700, cursor: submitting ? "default" : "pointer",
                fontFamily: "inherit", transition: "opacity 0.15s",
              }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                {submitting ? "..." : mode === "login" ? "ACCEDI" : "CREA ACCOUNT"}
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
