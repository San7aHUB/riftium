"use client";

import { useState } from "react";

/* ── Icons ── */
function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/* ── Constants ── */
const TEAL     = "#22d3ee";
const TEAL_DIM = "rgba(34,211,238,0.12)";
const TEAL_MID = "rgba(34,211,238,0.25)";
const BG       = "#0a0a0a";
const BORDER   = "rgba(255,255,255,0.07)";

const STATS = [
  { value: "847+", label: "Cards indexed" },
  { value: "Set 2", label: "Spiritforged live" },
  { value: "4",    label: "2026 sets planned" },
];

/* ── Home ── */
export default function Home() {
  const [query,   setQuery]   = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: BG, color: "rgba(255,255,255,0.88)", position: "relative", zIndex: 2 }}>

      {/* ════ HERO — full viewport ════ */}
      <section style={{
        height: "100vh", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative",
        padding: "0 24px",
      }}>
        {/* Background art */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://locator.riftbound.uvsgames.com/riftbound-bg.avif')",
          backgroundSize: "cover", backgroundPosition: "center 20%",
          filter: "saturate(0) brightness(0.52)",
        }} />
        {/* Faction color overlay */}
        <div className="faction-overlay" />
        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.92) 100%)",
        }} />

        {/* Twinkle lights */}
        {[
          { top: "12%", left: "8%",  size: 3, delay: "0s",   dur: "2.8s" },
          { top: "28%", left: "18%", size: 2, delay: "1.2s", dur: "3.4s" },
          { top: "18%", left: "72%", size: 4, delay: "0.4s", dur: "2.2s" },
          { top: "8%",  left: "55%", size: 2, delay: "2.1s", dur: "3.8s" },
          { top: "42%", left: "6%",  size: 3, delay: "0.7s", dur: "2.5s" },
          { top: "55%", left: "88%", size: 2, delay: "1.8s", dur: "3.1s" },
          { top: "35%", left: "82%", size: 4, delay: "0.3s", dur: "4.0s" },
          { top: "65%", left: "25%", size: 2, delay: "2.6s", dur: "2.7s" },
          { top: "72%", left: "65%", size: 3, delay: "1.0s", dur: "3.3s" },
          { top: "22%", left: "92%", size: 3, delay: "3.0s", dur: "3.6s" },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", top: p.top, left: p.left,
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: "50%", background: "#fff",
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(255,255,255,0.6)`,
            animation: `twinkle ${p.dur} ${p.delay} ease-in-out infinite`,
            pointerEvents: "none", zIndex: 1,
          }} />
        ))}

        {/* Particles */}
        <div className="particle" /><div className="particle" /><div className="particle" />
        <div className="particle" /><div className="particle" /><div className="particle" />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", maxWidth: "720px", width: "100%",
          gap: "0",
        }}>
          {/* Set strip */}
          <div className="set-strip-wrapper" style={{ marginBottom: "28px", animation: "fadeInUp 0.5s 0.05s ease both" }}>
            <div style={{
              display: "flex", alignItems: "stretch", gap: "1px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px", overflow: "hidden",
              border: `1px solid rgba(255,255,255,0.08)`,
            }}>
              {[
                { set: "2", name: "Spiritforged", date: "Feb 13", current: true },
                { set: "3", name: "Unleashed",    date: "May 8",  current: false },
                { set: "4", name: "Vendetta",     date: "Jul 31", current: false },
                { set: "5", name: "Radiance",     date: "Oct 23", current: false },
              ].map((s, i) => (
                <div key={s.set} style={{
                  flex: 1, padding: "10px 14px",
                  background: s.current ? TEAL_DIM : "transparent",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  display: "flex", flexDirection: "column", gap: "3px",
                  position: "relative",
                }}>
                  {s.current && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: TEAL }} />}
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", color: s.current ? TEAL : "rgba(255,255,255,0.28)" }}>
                    SET {s.set}{s.current ? " · LIVE" : ""}
                  </span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 600, color: s.current ? "#fff" : "rgba(255,255,255,0.45)", letterSpacing: "0.03em" }}>
                    {s.name}
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: s.current ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>
                    {s.date} 2026
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Tilt Warp', sans-serif",
            fontSize: "clamp(64px, 12vw, 150px)",
            fontWeight: 400, lineHeight: 0.9,
            letterSpacing: "0.06em", color: "#fff",
            marginBottom: "20px",
            animation: "fadeInUp 0.7s 0.15s ease both, titleGlow 5s 1.5s ease-in-out infinite",
          }}>
            RIFTIUM
          </h1>

          {/* Teal line */}
          <div style={{
            width: "48px", height: "2px",
            background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
            marginBottom: "18px",
            animation: "fadeInUp 0.55s 0.28s ease both",
          }} />

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(13px, 1.5vw, 16px)",
            fontWeight: 300, lineHeight: 1.7,
            color: "rgba(255,255,255,0.45)",
            maxWidth: "380px",
            marginBottom: "32px",
            animation: "fadeInUp 0.65s 0.38s ease both",
            textTransform: "none",
          }}>
            Your Riftbound companion. Search cards, forge decks, and track the market.
          </p>

          {/* Search bar */}
          <div style={{
            width: "100%",
            maxWidth: focused ? "560px" : "360px",
            marginBottom: "16px",
            animation: "fadeInUp 0.65s 0.5s ease both",
            transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "rgba(10,10,10,0.75)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${focused ? TEAL_MID : "rgba(255,255,255,0.12)"}`,
              borderRadius: "999px",
              padding: focused ? "4px 4px 4px 20px" : "4px 4px 4px 16px",
              transition: "border-color 0.3s, box-shadow 0.3s, padding 0.3s",
              boxShadow: focused ? `0 0 0 3px ${TEAL_DIM}, 0 8px 40px rgba(0,0,0,0.6)` : "0 2px 12px rgba(0,0,0,0.3)",
            }}>
              <div style={{ color: focused ? TEAL : "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", flexShrink: 0, transition: "color 0.2s" }}>
                <SearchIcon size={focused ? 18 : 16} />
              </div>
              <input
                type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={focused ? "Search cards, sets, champions…" : "Search Riftbound…"}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#fff", fontSize: focused ? "15px" : "13px",
                  fontFamily: "'Outfit', sans-serif",
                  padding: focused ? "10px 14px" : "8px 12px",
                  transition: "font-size 0.3s, padding 0.3s",
                }}
              />
              <button style={{
                padding: focused ? "10px 22px" : "7px 16px",
                background: focused ? "#fff" : "rgba(255,255,255,0.12)",
                border: "none", borderRadius: "999px",
                color: focused ? "#000" : "rgba(255,255,255,0.7)",
                fontFamily: "'Inter', sans-serif",
                fontSize: focused ? "13px" : "11px",
                fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em", flexShrink: 0,
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.86"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >Search</button>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "36px", animation: "fadeInUp 0.65s 0.62s ease both" }}>
            {["Card Database", "Deck Forge", "Price Oracle"].map(label => (
              <span key={label} style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                padding: "5px 14px",
                background: "rgba(10,10,10,0.6)", backdropFilter: "blur(8px)",
                border: `1px solid ${BORDER}`, borderRadius: "999px",
                fontFamily: "'Inter', sans-serif", fontSize: "10px",
                color: "rgba(255,255,255,0.38)", letterSpacing: "0.06em",
              }}>
                {label}
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)" }}>· SOON</span>
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: "flex",
            paddingTop: "20px", borderTop: `1px solid rgba(255,255,255,0.1)`,
            animation: "fadeInUp 0.65s 0.75s ease both",
            width: "100%", justifyContent: "center",
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="hero-stat" style={{
                borderRight: i < STATS.length - 1 ? `1px solid rgba(255,255,255,0.1)` : "none",
              }}>
                <p style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "20px", color: "#fff", letterSpacing: "0.04em" }}>
                  {s.value}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.14em", marginTop: "4px" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
