"use client";

import { useState } from "react";
import Link from "next/link";
import NewsStrip from "./components/NewsStrip";
import RoadmapTimeline from "./components/RoadmapTimeline";

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>

      {/* ── Hero ── */}
      <section className="hero-section" style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "80px 24px 120px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Hero background image — B&W desaturated */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url('https://locator.riftbound.uvsgames.com/riftbound-bg.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(1) brightness(0.35)",
        }} />

        {/* Particles */}
        <div className="particle" /><div className="particle" /><div className="particle" />
        <div className="particle" /><div className="particle" /><div className="particle" />

        {/* Light beam behind title */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          width: "600px", height: "500px",
          background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Content panel — glass backdrop */}
        <div style={{
          position: "relative", zIndex: 2,
          width: "100%", maxWidth: "760px",
          background: "rgba(38,38,42,0.28)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: "20px",
          padding: "48px 48px 40px",
          boxShadow: "0 8px 64px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Gradient borders */}
          <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 50%, transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15) 50%, transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: "10%", bottom: "10%", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15) 50%, transparent)", pointerEvents: "none" }} />

          {/* In-glass nav */}
          <div style={{
            width: "100%",
            display: "flex", alignItems: "center",
            marginBottom: "32px",
            paddingBottom: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1 }}>
              {[
                { label: "News", href: "/news" },
                { label: "Cards" },
                { label: "Market" },
                { label: "Deck Builder" },
              ].map(item => (
                <button key={item.label}
                  onClick={() => item.href && (window.location.href = item.href)}
                  style={{ padding: "4px 12px", background: "transparent", border: "none", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", cursor: "pointer", transition: "opacity 0.15s", opacity: 0.75 }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "0.75"; }}
                >{item.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.15)" }} />
              <button style={{ padding: "4px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "5px", color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              >Log in</button>
              <button style={{ padding: "4px 12px", background: "#fff", border: "none", borderRadius: "5px", color: "#000", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em", transition: "opacity 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >Sign up</button>
            </div>
          </div>

          {/* Title block */}
          <div style={{ textAlign: "center", marginBottom: "36px", width: "100%" }}>
            <h1 style={{
              fontFamily: "'Tilt Warp', sans-serif",
              fontSize: "clamp(64px, 12vw, 140px)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              color: "#ffffff",
              lineHeight: 1,
              margin: 0,
              textShadow: "0 0 60px rgba(255,255,255,0.2), 0 2px 20px rgba(0,0,0,0.9)",
              animation: "heroTitleIn 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
            }}>
              RIFTIUM
            </h1>

            <div style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              margin: "20px auto 16px",
              animation: "lineExpand 0.8s 0.6s ease forwards",
              width: 0, opacity: 0,
            }} />

            <p className="hero-subtitle" style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "clamp(12px, 1.4vw, 15px)",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.22em",
              margin: "0 auto 28px",
              animation: "heroSubIn 0.7s 0.5s ease both",
            }}>
              Advanced card search for Riftbound
            </p>

            <RoadmapTimeline />
          </div>

          {/* Search box */}
          <div className="hero-searchbox" style={{ width: "100%", maxWidth: "700px", animation: "heroSearchIn 0.7s 0.75s ease both" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "rgba(5, 7, 12, 0.88)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${searchFocused ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.22)"}`,
              borderRadius: "14px",
              overflow: "hidden",
              padding: "2px 5px",
              boxShadow: searchFocused
                ? "0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
              transform: searchFocused ? "scale(1.07)" : "scale(1)",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
            }}>
              <div style={{ padding: "0 16px", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                <SearchIcon size={20} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search Riftbound cards…"
                style={{
                  flex: 1, padding: "10px 0",
                  background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontSize: "15px",
                  fontWeight: 400, fontFamily: "'Inter', sans-serif",
                }}
              />
              <button
                style={{
                  height: "44px", width: "44px", margin: "0 6px",
                  background: "#fff", border: "none", borderRadius: "50%",
                  color: "#000", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                  transition: "transform 0.15s",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </div>{/* end content panel */}

        {/* News strip */}
        <NewsStrip />
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: "center", padding: "28px 32px",
        color: "rgba(255,255,255,0.18)", fontSize: "11px", letterSpacing: "0.08em",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "var(--bg-void)",
      }}>
        <span style={{ fontFamily: "'Tilt Warp', sans-serif", letterSpacing: "0.14em", fontSize: "13px" }}>RIFTIUM</span>
      </footer>
    </div>
  );
}
