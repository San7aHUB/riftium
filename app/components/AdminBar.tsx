"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import AccountModal from "@/app/components/AccountModal";

export default function AdminBar() {
  const { isAdmin, isLoggedIn, user, signOut, loading } = useAuth();
  const [showAccount, setShowAccount] = useState(false);

  if (loading || !isLoggedIn) return null;

  return (
    <>
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(10,10,16,0.95)",
        border: `1px solid ${isAdmin ? "rgba(192,132,252,0.3)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "12px",
        padding: "10px 16px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}>
        {/* Indicator + email (clickable → account) */}
        <button onClick={() => setShowAccount(true)} style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "none", border: "none", cursor: "pointer", padding: 0,
        }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: isAdmin ? "#c084fc" : "#34d399",
            boxShadow: isAdmin ? "0 0 8px #c084fc" : "0 0 8px #34d399",
            flexShrink: 0,
          }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", fontFamily: "inherit" }}>
            {isAdmin ? "ADMIN" : "USER"}
          </span>
          <span style={{
            fontSize: "11px", color: "rgba(255,255,255,0.25)",
            maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
          >
            {user?.email}
          </span>
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />

        {/* Logout */}
        <button onClick={signOut} style={{
          background: "none", border: "none",
          color: "rgba(255,255,255,0.35)", fontSize: "11px",
          letterSpacing: "0.08em", cursor: "pointer",
          padding: "2px 4px", borderRadius: "4px",
          transition: "color 0.15s", fontFamily: "inherit",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
        >
          Logout
        </button>
      </div>

      {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
    </>
  );
}
