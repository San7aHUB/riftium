"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{
      position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
      zIndex: 100,
      display: "flex", alignItems: "center", gap: "4px",
      padding: "6px 8px 6px 18px",
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
      borderRadius: "999px",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2)",
      whiteSpace: "nowrap",
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontFamily: "'Tilt Warp', sans-serif", fontSize: "17px",
        letterSpacing: "0.14em", color: "#fff", textDecoration: "none",
        marginRight: "8px", flexShrink: 0,
      }}>
        RIFTIUM
      </Link>

      {/* Divider */}
      <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.1)", marginRight: "8px", flexShrink: 0 }} />

      {/* Nav links */}
      {[
        { label: "News",         href: "/news" },
        { label: "Cards",        href: "/cards" },
        { label: "Market",       href: "/market" },
        { label: "Deck Builder", href: "/deck-builder" },
      ].map(item => {
        const baseStyle: React.CSSProperties = {
          padding: "6px 13px", fontFamily: "'Inter', sans-serif", fontSize: "12px",
          fontWeight: 600, letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)",
          transition: "color 0.18s, background 0.18s",
          borderRadius: "999px", cursor: "pointer", textDecoration: "none",
        };
        const onEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.92)";
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        };
        const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          e.currentTarget.style.background = "transparent";
        };
        return (
          <Link key={item.label} href={item.href} style={baseStyle}
            onMouseEnter={onEnter} onMouseLeave={onLeave}>
            {item.label}
          </Link>
        );
      })}

      {/* Divider */}
      <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.1)", margin: "0 8px", flexShrink: 0 }} />

      {/* Auth */}
      <button style={{
        padding: "6px 16px", background: "transparent",
        border: "1px solid rgba(255,255,255,0.15)", borderRadius: "999px",
        color: "rgba(255,255,255,0.7)", fontFamily: "'Inter', sans-serif",
        fontSize: "12px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em",
        transition: "all 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
      >Log in</button>
      <button style={{
        padding: "6px 16px", background: "#fff",
        border: "none", borderRadius: "999px",
        color: "#000", fontFamily: "'Inter', sans-serif",
        fontSize: "12px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
        transition: "opacity 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      >Sign up</button>
    </nav>
  );
}
