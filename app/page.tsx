"use client";

import { useState } from "react";
import Link from "next/link";
import NewsStrip from "./components/NewsStrip";
import RoadmapTimeline from "./components/RoadmapTimeline";

/* ── Icons ── */
function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="12" height="16" rx="2" />
      <path d="M7 8h4M7 11h4M7 14h2" strokeLinecap="round" />
      <circle cx="18.5" cy="17.5" r="2.5" /><line x1="20.3" y1="19.3" x2="22" y2="21" strokeWidth="1.8" />
    </svg>
  );
}
function DeckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="6" width="13" height="15" rx="2" />
      <path d="M4 9h2M4 5h13" strokeLinecap="round" opacity="0.5" />
      <path d="M10 11h5M10 14h3" strokeLinecap="round" />
    </svg>
  );
}
function MarketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="3,17 7,11 11,14 16,8 21,10" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="3" y1="21" x2="21" y2="21" strokeLinecap="round" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <circle cx="4" cy="4" r="3" />
    </svg>
  );
}

/* ── Constants ── */
const TEAL = "#22d3ee";
const TEAL_DIM = "rgba(34,211,238,0.12)";
const TEAL_MID = "rgba(34,211,238,0.25)";
const BG = "#0a0a0a";
const SURFACE = "#0e0e0e";
const BORDER = "rgba(255,255,255,0.07)";

const FEATURES = [
  {
    Icon: CardIcon,
    title: "Card Database",
    desc: "Search every Riftbound card with advanced filters. Find champions, spells, and items by type, cost, rarity, or oracle text.",
    cta: "Search cards",
    flavor: "847 cards · Sets 1–3",
  },
  {
    Icon: DeckIcon,
    title: "Deck Forge",
    desc: "Build and test competitive decks with a full-featured editor. Import lists, analyze curves, and share with the community.",
    cta: "Build a deck",
    flavor: "Standard · Open formats",
  },
  {
    Icon: MarketIcon,
    title: "Price Oracle",
    desc: "Track real-time card prices and market trends. Spot investment opportunities and monitor your collection's value.",
    cta: "View market",
    flavor: "Daily price updates",
  },
];

const STATS = [
  { value: "847+", label: "Cards indexed" },
  { value: "Set 2", label: "Spiritforged live" },
  { value: "4", label: "2026 sets planned" },
];

/* ── Home ── */
export default function Home() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "rgba(255,255,255,0.88)", position: "relative", zIndex: 2 }}>

      {/* ════ NAVBAR ════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "64px", display: "flex", alignItems: "center", padding: "0 48px",
        background: "rgba(10,10,10,0.94)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <Link href="/" style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "20px", letterSpacing: "0.14em", color: "#fff", textDecoration: "none", flexShrink: 0 }}>
          RIFTIUM
        </Link>

        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "2px" }}>
          {[{ label: "News", href: "/news" }, { label: "Cards" }, { label: "Market" }, { label: "Deck Builder" }].map(item =>
            item.href
              ? <Link key={item.label} href={item.href} style={{ padding: "5px 14px", color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em", textDecoration: "none" }}>{item.label}</Link>
              : <button key={item.label} style={{ padding: "5px 14px", background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em", cursor: "pointer" }}>{item.label}</button>
          )}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button style={{ padding: "6px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "rgba(255,255,255,0.75)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
          >Log in</button>
          <button style={{ padding: "6px 18px", background: "#fff", border: "none", borderRadius: "8px", color: "#000", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em", transition: "opacity 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >Sign up</button>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section style={{
        minHeight: "100vh", paddingTop: "64px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        padding: "120px 24px 100px",
      }}>
        {/* Background art */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://locator.riftbound.uvsgames.com/riftbound-bg.avif')",
          backgroundSize: "cover", backgroundPosition: "center 20%",
          filter: "saturate(0.65) brightness(0.32)",
        }} />
        {/* Radial dark vignette — keeps edges dark */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.92) 100%)",
        }} />
        {/* Subtle teal glow center */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 50% 40% at 50% 55%, rgba(6,182,212,0.06) 0%, transparent 65%)",
        }} />
        {/* Bottom fade into next section */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "160px",
          background: `linear-gradient(to bottom, transparent, ${BG})`,
        }} />

        {/* Teal orb — top left, visible */}
        <div style={{
          position: "absolute", width: "600px", height: "600px",
          top: "-100px", left: "-100px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 65%)",
          filter: "blur(50px)",
          animation: "orbDrift1 20s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        {/* Teal orb — bottom right */}
        <div style={{
          position: "absolute", width: "500px", height: "500px",
          bottom: "40px", right: "-80px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 65%)",
          filter: "blur(45px)",
          animation: "orbDrift2 26s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        {/* White orb — breathing center */}
        <div style={{
          position: "absolute", width: "700px", height: "350px",
          top: "45%", left: "50%", transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbBreathe 10s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Aurora sweep line */}
        <div style={{
          position: "absolute", top: "38%", left: 0, right: 0, height: "1px",
          background: `linear-gradient(90deg, transparent 0%, transparent 20%, rgba(34,211,238,0.6) 50%, transparent 80%, transparent 100%)`,
          backgroundSize: "200% 100%",
          filter: "blur(2px)",
          animation: "auroraSweep 5s 1s linear infinite",
          pointerEvents: "none",
          opacity: 0.7,
        }} />
        {/* Aurora sweep — blurred copy for glow */}
        <div style={{
          position: "absolute", top: "calc(38% - 4px)", left: 0, right: 0, height: "9px",
          background: `linear-gradient(90deg, transparent 0%, transparent 20%, rgba(34,211,238,0.25) 50%, transparent 80%, transparent 100%)`,
          backgroundSize: "200% 100%",
          filter: "blur(6px)",
          animation: "auroraSweep 5s 1s linear infinite",
          pointerEvents: "none",
        }} />

        {/* Particles */}
        <div className="particle" /><div className="particle" /><div className="particle" />
        <div className="particle" /><div className="particle" /><div className="particle" />

        {/* Content — centered */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", maxWidth: "720px", width: "100%",
        }}>
          {/* Current set badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px", animation: "fadeInUp 0.5s 0.05s ease both", justifyContent: "center" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "4px 12px", background: TEAL_DIM, border: `1px solid ${TEAL_MID}`,
              borderRadius: "999px", fontFamily: "'Inter', sans-serif", fontSize: "10px",
              fontWeight: 700, letterSpacing: "0.14em", color: TEAL,
            }}>
              <SparkIcon /> SET 2 · SPIRITFORGED
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
              NOW AVAILABLE
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Tilt Warp', sans-serif",
            fontSize: "clamp(72px, 13vw, 160px)",
            fontWeight: 400, lineHeight: 0.9,
            letterSpacing: "0.06em", color: "#fff",
            marginBottom: "24px",
            animation: "fadeInUp 0.7s 0.15s ease both, titleGlow 5s 1.5s ease-in-out infinite",
          }}>
            RIFTIUM
          </h1>

          {/* Centered teal line */}
          <div style={{
            width: "48px", height: "2px",
            background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
            marginBottom: "22px",
            animation: "fadeInUp 0.55s 0.28s ease both",
          }} />

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            fontWeight: 300, lineHeight: 1.7,
            color: "rgba(255,255,255,0.45)",
            maxWidth: "400px",
            marginBottom: "40px",
            animation: "fadeInUp 0.65s 0.38s ease both",
            textTransform: "none",
          }}>
            Your Riftbound companion. Search cards, forge decks, and track the market — all in one place.
          </p>

          {/* Search bar */}
          <div style={{ width: "100%", maxWidth: "520px", marginBottom: "20px", animation: "fadeInUp 0.65s 0.5s ease both" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "rgba(10,10,10,0.75)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${focused ? TEAL_MID : "rgba(255,255,255,0.12)"}`,
              borderRadius: "14px", padding: "4px 4px 4px 18px",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxShadow: focused
                ? `0 0 0 3px ${TEAL_DIM}, 0 8px 40px rgba(0,0,0,0.6)`
                : "0 4px 24px rgba(0,0,0,0.4)",
            }}>
              <div style={{ color: focused ? TEAL : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", flexShrink: 0, transition: "color 0.2s" }}>
                <SearchIcon />
              </div>
              <input
                type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search cards, sets, champions…"
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: "15px", fontFamily: "'Outfit', sans-serif", padding: "11px 14px" }}
              />
              <button style={{
                padding: "11px 24px", background: "#fff", border: "none", borderRadius: "10px",
                color: "#000", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.03em", flexShrink: 0, transition: "opacity 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.86"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >Search</button>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "52px", animation: "fadeInUp 0.65s 0.62s ease both" }}>
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
            display: "flex", gap: "0",
            paddingTop: "24px", borderTop: `1px solid rgba(255,255,255,0.1)`,
            animation: "fadeInUp 0.65s 0.75s ease both",
            width: "100%", justifyContent: "center",
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                textAlign: "center", padding: "0 32px",
                borderRight: i < STATS.length - 1 ? `1px solid rgba(255,255,255,0.1)` : "none",
              }}>
                <p style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "22px", color: "#fff", letterSpacing: "0.04em" }}>
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

      {/* ════ CURRENT SET CALLOUT ════ */}
      <div style={{
        background: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
        padding: "18px 80px",
      }}>
        <div style={{
          maxWidth: "1160px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "4px 10px", background: TEAL_DIM, border: `1px solid ${TEAL_MID}`,
              borderRadius: "999px", fontFamily: "'Inter', sans-serif", fontSize: "9px",
              fontWeight: 700, letterSpacing: "0.14em", color: TEAL, flexShrink: 0,
            }}>
              <SparkIcon /> LIVE
            </span>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>
              <span style={{ color: "#fff", fontWeight: 600 }}>SPIRITFORGED</span> — SET 2 is now available ·{" "}
              <span style={{ color: "rgba(255,255,255,0.35)" }}>Preview Events Feb 6–12 · Bologna Qualifier Feb 20–22</span>
            </p>
          </div>
          <Link href="/news" style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600,
            color: TEAL, textDecoration: "none", letterSpacing: "0.06em", flexShrink: 0,
            transition: "opacity 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            Read more <ArrowRight />
          </Link>
        </div>
      </div>

      {/* ════ FEATURES ════ */}
      <section className="home-section" style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ marginBottom: "52px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.28)", marginBottom: "14px" }}>
              YOUR ARSENAL
            </p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 600, color: "#fff" }}>
              Command the game
            </h2>
          </div>

          <div className="home-features">
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: SURFACE, border: `1px solid ${BORDER}`,
                borderRadius: "16px", padding: "28px 26px",
                position: "relative", overflow: "hidden",
                cursor: "default", transition: "all 0.25s ease",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = TEAL_MID;
                  el.style.transform = "translateY(-5px)";
                  el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${TEAL_MID}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.borderColor = BORDER;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Top teal accent */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: `linear-gradient(90deg, transparent 0%, ${TEAL} 40%, transparent 100%)`,
                  opacity: 0.4,
                }} />

                {/* Icon */}
                <div style={{
                  width: "44px", height: "44px", borderRadius: "10px",
                  background: TEAL_DIM, border: `1px solid ${TEAL_MID}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: TEAL, marginBottom: "20px",
                }}>
                  <f.Icon />
                </div>

                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "17px", fontWeight: 600, color: "#fff", marginBottom: "10px", letterSpacing: "0.01em" }}>
                  {f.title}
                </h3>

                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 300,
                  lineHeight: 1.72, color: "rgba(255,255,255,0.4)",
                  marginBottom: "20px", textTransform: "none",
                }}>
                  {f.desc}
                </p>

                {/* Flavor line */}
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: "9px", fontWeight: 600,
                  letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", marginBottom: "20px",
                }}>
                  {f.flavor.toUpperCase()}
                </p>

                <p style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontFamily: "'Inter', sans-serif", fontSize: "11px",
                  fontWeight: 600, color: TEAL, letterSpacing: "0.04em", opacity: 0.7,
                }}>
                  {f.cta} <ArrowRight />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ROADMAP ════ */}
      <section className="home-section" style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ marginBottom: "44px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.28)", marginBottom: "14px" }}>
              2026 SCHEDULE
            </p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 600, color: "#fff" }}>
              Riftbound Roadmap
            </h2>
          </div>
          <RoadmapTimeline />
        </div>
      </section>

      {/* ════ NEWS ════ */}
      <section className="home-section" style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.28)", marginBottom: "14px" }}>
                RIFTBOUND DISPATCH
              </p>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 600, color: "#fff" }}>
                News & Updates
              </h2>
            </div>
            <Link href="/news" style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600,
              color: TEAL, textDecoration: "none", letterSpacing: "0.06em",
              paddingBottom: "6px", opacity: 0.8, transition: "opacity 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8"; }}
            >
              All news <ArrowRight />
            </Link>
          </div>
          <NewsStrip />
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{
        padding: "28px 80px", borderTop: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: SURFACE,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "16px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)" }}>
            RIFTIUM
          </span>
          <span style={{ width: "1px", height: "14px", background: BORDER, display: "inline-block" }} />
          <Link href="/news" style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.25)", textDecoration: "none", letterSpacing: "0.06em" }}>News</Link>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.16)", letterSpacing: "0.08em" }}>
          FAN PROJECT · NOT AFFILIATED WITH RIOT GAMES
        </p>
      </footer>
    </div>
  );
}
