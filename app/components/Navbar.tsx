"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "News",         href: "/news" },
  { label: "Cards",        href: "/cards" },
  { label: "Market",       href: "/market" },
  { label: "Deck Builder", href: "/deck-builder" },
];

const linkStyle: React.CSSProperties = {
  padding: "6px 13px", fontFamily: "'Inter', sans-serif", fontSize: "12px",
  fontWeight: 600, letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)",
  transition: "color 0.18s, background 0.18s",
  borderRadius: "999px", textDecoration: "none", display: "inline-block",
};

function onEnter(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = "rgba(255,255,255,0.92)";
  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
}
function onLeave(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
  e.currentTarget.style.background = "transparent";
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      if (navRef.current) {
        navRef.current.style.top = `${vv.offsetTop + 16}px`;
      }
    };
    vv.addEventListener("resize", update);
    return () => {
      vv.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <nav ref={navRef} className="navbar-pill" style={{
        position: "fixed", top: "16px", left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex", alignItems: "center", gap: "4px",
        padding: "6px 8px 6px 18px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "'Tilt Warp', sans-serif", fontSize: "17px",
          letterSpacing: "0.14em", color: "#fff", textDecoration: "none",
          marginRight: "4px", flexShrink: 0,
        }}>
          RIFTIUM
        </Link>

        {/* Desktop — divider + links + auth */}
        <div className="nav-desktop-only" style={{ display: "contents" }}>
          <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.1)", margin: "0 8px", flexShrink: 0 }} />
          {NAV_LINKS.map(item => (
            <Link key={item.label} href={item.href} style={linkStyle}
              onMouseEnter={onEnter} onMouseLeave={onLeave}>
              {item.label}
            </Link>
          ))}
          <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.1)", margin: "0 8px", flexShrink: 0 }} />
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
        </div>

        {/* Mobile — hamburger */}
        <button
          className="nav-mobile-only"
          onClick={() => setOpen(o => !o)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.7)", padding: "6px 10px",
            display: "flex", flexDirection: "column", gap: "4px", alignItems: "center",
          }}
          aria-label="Menu"
        >
          <span style={{
            display: "block", width: "18px", height: "1.5px",
            background: "currentColor",
            transition: "transform 0.2s, opacity 0.2s",
            transform: open ? "rotate(45deg) translate(4px, 4px)" : "none",
          }} />
          <span style={{
            display: "block", width: "18px", height: "1.5px",
            background: "currentColor",
            opacity: open ? 0 : 1,
            transition: "opacity 0.2s",
          }} />
          <span style={{
            display: "block", width: "18px", height: "1.5px",
            background: "currentColor",
            transition: "transform 0.2s",
            transform: open ? "rotate(-45deg) translate(4px, -4px)" : "none",
          }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: "fixed", top: "70px", left: "16px", right: "16px",
          background: "rgba(12,12,12,0.96)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "8px",
          zIndex: 99,
          animation: "fadeInUp 0.18s ease",
          display: "flex", flexDirection: "column", gap: "2px",
        }}>
          {NAV_LINKS.map(item => (
            <Link key={item.label} href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block", padding: "12px 16px",
                fontFamily: "'Inter', sans-serif", fontSize: "15px",
                fontWeight: 600, letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.75)", textDecoration: "none",
                borderRadius: "10px", transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />
          <div style={{ display: "flex", gap: "8px", padding: "4px 8px 4px" }}>
            <button style={{
              flex: 1, padding: "10px", background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px",
              color: "rgba(255,255,255,0.7)", fontFamily: "'Inter', sans-serif",
              fontSize: "13px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em",
            }}>Log in</button>
            <button style={{
              flex: 1, padding: "10px", background: "#fff",
              border: "none", borderRadius: "10px",
              color: "#000", fontFamily: "'Inter', sans-serif",
              fontSize: "13px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
            }}>Sign up</button>
          </div>
        </div>
      )}
    </>
  );
}
