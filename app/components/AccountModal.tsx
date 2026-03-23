"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

interface Props {
  onClose: () => void;
}

type Tab = "profile" | "password";

export default function AccountModal({ onClose }: Props) {
  const { user, nickname, isAdmin, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  // Profile
  const [nicknameVal, setNicknameVal] = useState(nickname);
  const [email, setEmail] = useState(user?.email ?? "");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailErr(""); setEmailMsg("");
    const updates: { email?: string; data?: { nickname: string } } = {};
    if (nicknameVal !== nickname) updates.data = { nickname: nicknameVal };
    if (email !== user?.email) updates.email = email;
    if (!updates.email && !updates.data) { setEmailErr("Nessuna modifica da salvare."); return; }
    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser(updates);
    if (error) setEmailErr(error.message);
    else setEmailMsg(updates.email ? "Controlla la tua nuova email per confermare il cambio." : "Profilo aggiornato.");
    setEmailLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwErr(""); setPwMsg("");
    if (newPassword !== confirmPassword) { setPwErr("Le password non corrispondono."); return; }
    if (newPassword.length < 6) { setPwErr("La password deve essere di almeno 6 caratteri."); return; }
    setPwLoading(true);
    // Re-authenticate first
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: currentPassword,
    });
    if (authErr) { setPwErr("Password attuale errata."); setPwLoading(false); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setPwErr(error.message);
    else { setPwMsg("Password aggiornata."); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    setPwLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "12px 16px",
    color: "#fff", fontSize: "13px", outline: "none",
    fontFamily: "inherit", width: "100%", boxSizing: "border-box",
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
          width: "100%", maxWidth: "420px",
          background: "rgba(14,14,20,0.98)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "32px 28px",
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

          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                {nickname || "Il mio account"}
              </div>
              <span style={{
                fontSize: "10px", letterSpacing: "0.12em", fontWeight: 600,
                padding: "2px 8px", borderRadius: "20px",
                background: isAdmin ? "rgba(192,132,252,0.12)" : "rgba(52,211,153,0.1)",
                border: `1px solid ${isAdmin ? "rgba(192,132,252,0.35)" : "rgba(52,211,153,0.3)"}`,
                color: isAdmin ? "#c084fc" : "#34d399",
              }}>{isAdmin ? "ADMIN" : "USER"}</span>
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{user?.email}</div>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.04)",
            borderRadius: "10px", padding: "3px", marginBottom: "24px",
          }}>
            {([["profile", "Email"], ["password", "Password"]] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                background: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                fontFamily: "'Inter', sans-serif", fontSize: "12px",
                fontWeight: 600, letterSpacing: "0.08em",
                cursor: "pointer", transition: "all 0.15s",
              }}>{label}</button>
            ))}
          </div>

          {/* Profile tab */}
          {tab === "profile" && (
            <form onSubmit={handleProfileUpdate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "6px" }}>
                  NICKNAME
                </label>
                <input
                  type="text" value={nicknameVal} placeholder="Il tuo nickname"
                  onChange={e => setNicknameVal(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "6px" }}>
                  EMAIL
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  required style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              {emailErr && <Feedback text={emailErr} type="error" />}
              {emailMsg && <Feedback text={emailMsg} type="success" />}
              <button type="submit" disabled={emailLoading} style={submitStyle(emailLoading)}
                onMouseEnter={e => { if (!emailLoading) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >{emailLoading ? "..." : "SALVA"}</button>
            </form>
          )}

          {/* Password tab */}
          {tab === "password" && (
            <form onSubmit={handlePasswordUpdate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "6px" }}>
                  PASSWORD ATTUALE
                </label>
                <input
                  type="password" value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required autoComplete="current-password" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "6px" }}>
                  NUOVA PASSWORD
                </label>
                <input
                  type="password" value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required autoComplete="new-password" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "6px" }}>
                  CONFERMA PASSWORD
                </label>
                <input
                  type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required autoComplete="new-password" style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              {pwErr && <Feedback text={pwErr} type="error" />}
              {pwMsg && <Feedback text={pwMsg} type="success" />}
              <button type="submit" disabled={pwLoading} style={submitStyle(pwLoading)}
                onMouseEnter={e => { if (!pwLoading) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >{pwLoading ? "..." : "AGGIORNA PASSWORD"}</button>
            </form>
          )}
          {/* Logout */}
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={async () => { await signOut(); onClose(); }} style={{
              width: "100%", padding: "11px", borderRadius: "10px",
              border: "1px solid rgba(248,113,113,0.2)",
              background: "rgba(248,113,113,0.05)",
              color: "rgba(248,113,113,0.7)", fontSize: "12px",
              letterSpacing: "0.1em", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(248,113,113,0.05)"; e.currentTarget.style.color = "rgba(248,113,113,0.7)"; }}
            >LOGOUT</button>
          </div>

        </div>
      </div>
    </>
  );
}

function Feedback({ text, type }: { text: string; type: "error" | "success" }) {
  const isErr = type === "error";
  return (
    <div style={{
      fontSize: "12px",
      color: isErr ? "#f87171" : "#34d399",
      padding: "10px 14px", borderRadius: "8px",
      background: isErr ? "rgba(248,113,113,0.08)" : "rgba(52,211,153,0.08)",
      border: `1px solid ${isErr ? "rgba(248,113,113,0.2)" : "rgba(52,211,153,0.2)"}`,
    }}>{text}</div>
  );
}

function submitStyle(loading: boolean): React.CSSProperties {
  return {
    marginTop: "4px", padding: "13px",
    borderRadius: "10px", border: "none",
    background: loading ? "rgba(255,255,255,0.15)" : "#fff",
    color: loading ? "rgba(0,0,0,0.4)" : "#000",
    fontSize: "12px", letterSpacing: "0.12em",
    fontWeight: 700, cursor: loading ? "default" : "pointer",
    fontFamily: "inherit", transition: "opacity 0.15s",
  };
}
