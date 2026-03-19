"use client";

import { useState } from "react";
import Link from "next/link";
import NewsStrip from "./components/NewsStrip";
import RoadmapTimeline from "./components/RoadmapTimeline";

/* ── Icons ── */
function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="12" height="16" rx="2" />
      <path d="M7 8h4M7 11h4M7 14h2" />
      <circle cx="18.5" cy="17" r="2.5" />
      <line x1="20.3" y1="18.8" x2="22" y2="20.5" strokeWidth="1.8" />
    </svg>
  );
}

function DeckIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="6" width="13" height="15" rx="2" />
      <path d="M4 4h13" strokeLinecap="round" opacity="0.5" />
      <path d="M2 7h4" strokeLinecap="round" opacity="0.3" />
      <path d="M10 11h5M10 14h3" strokeLinecap="round" />
    </svg>
  );
}

function MarketIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="3,17 7,11 11,14 16,8 21,10" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="3" y1="21" x2="21" y2="21" strokeLinecap="round" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ── Data ── */
const FEATURES = [
  {
    Icon: CardIcon,
    badge: "Coming Soon",
    title: "Card Search",
    desc: "Browse every Riftbound card with advanced filters. Search by type, cost, rarity, set, and oracle text — find exactly what you need.",
    cta: "Explore cards",
  },
  {
    Icon: DeckIcon,
    badge: "Coming Soon",
    title: "Deck Builder",
    desc: "Build and test your Riftbound decks with a powerful editor. Share your creations and discover top community decks.",
    cta: "Build a deck",
  },
  {
    Icon: MarketIcon,
    badge: "Coming Soon",
    title: "Market",
    desc: "Track card prices and market trends in real time. Spot deals, monitor investments, and stay ahead of the meta.",
    cta: "View market",
  },
];

const STATS = [
  { value: "847+", label: "Cards" },
  { value: "3", label: "Sets" },
  { value: "Live", label: "Prices" },
];

const S = {
  bg: "#0a0a0a",
  surface: "#0e0e0e",
  elevated: "#141414",
  border: "rgba(255,255,255,0.07)",
  borderBright: "rgba(255,255,255,0.14)",
  textPrimary: "rgba(255,255,255,0.88)",
  textSecondary: "rgba(255,255,255,0.45)",
  textMuted: "rgba(255,255,255,0.25)",
  eyebrow: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "10px" as const,
    fontWeight: 700 as const,
    letterSpacing: "0.22em",
    color: "rgba(255,255,255,0.28)",
    marginBottom: "14px",
    display: "block" as const,
  },
};

/* ── Component ── */
export default function Home() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.textPrimary, position: "relative", zIndex: 2 }}>

      {/* ════ NAVBAR ════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "64px", display: "flex", alignItems: "center",
        padding: "0 48px",
        background: "rgba(10,10,10,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${S.border}`,
      }}>
        <Link href="/" style={{
          fontFamily: "'Tilt Warp', sans-serif", fontSize: "20px",
          letterSpacing: "0.14em", color: "#fff", textDecoration: "none", flexShrink: 0,
        }}>
          RIFTIUM
        </Link>

        <div style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: "2px",
        }}>
          {[
            { label: "News", href: "/news" },
            { label: "Cards" },
            { label: "Market" },
            { label: "Deck Builder" },
          ].map(item =>
            item.href
              ? <Link key={item.label} href={item.href} style={{ padding: "5px 14px", color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em", textDecoration: "none", transition: "color 0.15s" }}>{item.label}</Link>
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
      <section className="home-hero" style={{ paddingTop: "64px" }}>

        {/* Left: content */}
        <div className="home-hero-content" style={{
          padding: "clamp(56px,7vw,96px) clamp(32px,4vw,56px) 80px clamp(40px,8vw,120px)',",
          display: "flex", flexDirection: "column", justifyContent: "center",
          position: "relative", zIndex: 2,
        }}>

          {/* Eyebrow */}
          <span style={{ ...S.eyebrow, animation: "fadeInUp 0.55s 0.05s ease both" }}>
            RIFTBOUND TCG · COMPANION
          </span>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Tilt Warp', sans-serif",
            fontSize: "clamp(68px, 9.5vw, 148px)",
            fontWeight: 400, lineHeight: 0.9,
            letterSpacing: "0.05em", color: "#fff",
            textShadow: "0 0 80px rgba(255,255,255,0.08), 0 4px 60px rgba(0,0,0,0.9)",
            marginBottom: "20px",
            animation: "fadeInUp 0.7s 0.15s ease both",
          }}>
            RIFTIUM
          </h1>

          {/* Thin line */}
          <div style={{
            width: "44px", height: "1px",
            background: "rgba(255,255,255,0.25)",
            marginBottom: "20px",
            animation: "fadeInUp 0.55s 0.28s ease both",
          }} />

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(14px, 1.5vw, 17px)",
            fontWeight: 300, lineHeight: 1.7,
            color: S.textSecondary,
            maxWidth: "360px",
            marginBottom: "36px",
            animation: "fadeInUp 0.65s 0.38s ease both",
          }}>
            Search cards, build decks, and track prices for the Riftbound Trading Card Game.
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: "480px", marginBottom: "18px", animation: "fadeInUp 0.65s 0.5s ease both" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${focused ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "12px",
              padding: "4px 4px 4px 16px",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxShadow: focused
                ? "0 0 0 3px rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.5)"
                : "0 4px 20px rgba(0,0,0,0.25)",
            }}>
              <div style={{ color: "rgba(255,255,255,0.28)", display: "flex", alignItems: "center", flexShrink: 0 }}>
                <SearchIcon />
              </div>
              <input
                type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search Riftbound cards…"
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#fff", fontSize: "15px",
                  fontFamily: "'Outfit', sans-serif", padding: "10px 14px",
                }}
              />
              <button style={{
                padding: "10px 22px", background: "#fff", border: "none",
                borderRadius: "8px", color: "#000",
                fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.03em", flexShrink: 0,
                transition: "opacity 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.86"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Feature pills */}
          <div style={{
            display: "flex", gap: "8px", flexWrap: "wrap",
            marginBottom: "48px",
            animation: "fadeInUp 0.65s 0.62s ease both",
          }}>
            {[
              { icon: "◈", label: "Card Database" },
              { icon: "⊞", label: "Deck Builder" },
              { icon: "◎", label: "Price Tracker" },
            ].map(p => (
              <span key={p.label} style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "5px 13px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "999px",
                fontFamily: "'Inter', sans-serif", fontSize: "10px",
                color: "rgba(255,255,255,0.38)", letterSpacing: "0.06em",
              }}>
                <span style={{ opacity: 0.55, fontSize: "11px" }}>{p.icon}</span>
                {p.label}
                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.18)", marginLeft: "2px" }}>SOON</span>
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "28px",
            paddingTop: "24px",
            borderTop: `1px solid ${S.border}`,
            animation: "fadeInUp 0.65s 0.75s ease both",
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                paddingRight: "28px",
                borderRight: i < STATS.length - 1 ? `1px solid ${S.border}` : "none",
              }}>
                <p style={{
                  fontFamily: "'Tilt Warp', sans-serif", fontSize: "22px",
                  color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em",
                }}>
                  {s.value}
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: "9px",
                  color: S.textMuted, letterSpacing: "0.14em",
                  marginTop: "4px",
                }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: atmospheric image */}
        <div className="home-hero-img" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('https://locator.riftbound.uvsgames.com/riftbound-bg.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            filter: "grayscale(1) brightness(0.52)",
          }} />
          {/* Left fade */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to right, ${S.bg} 0%, rgba(10,10,10,0.55) 28%, transparent 58%)`,
          }} />
          {/* Top/bottom fade */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom, rgba(10,10,10,0.72) 0%, transparent 18%, transparent 72%, ${S.bg} 100%)`,
          }} />
        </div>
      </section>

      {/* ════ FEATURES ════ */}
      <section className="home-section" style={{
        background: S.surface,
        borderTop: `1px solid ${S.border}`,
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>

          <div style={{ marginBottom: "52px" }}>
            <span style={S.eyebrow}>PLATFORM</span>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(26px, 3.5vw, 44px)",
              fontWeight: 600, color: "#fff", letterSpacing: "-0.01em",
            }}>
              Everything you need
            </h2>
          </div>

          <div className="home-features">
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${S.border}`,
                borderRadius: "16px", padding: "28px 26px",
                position: "relative", overflow: "hidden",
                cursor: "default",
                transition: "all 0.25s ease",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.045)";
                  el.style.borderColor = "rgba(255,255,255,0.13)";
                  el.style.transform = "translateY(-5px)";
                  el.style.boxShadow = "0 24px 60px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.025)";
                  el.style.borderColor = S.border;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Top glow accent */}
                <div style={{
                  position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.13) 50%, transparent)",
                }} />

                {/* Icon + badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                  }}>
                    <f.Icon />
                  </div>
                  <span style={{
                    padding: "3px 8px", borderRadius: "999px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "'Inter', sans-serif", fontSize: "8px", fontWeight: 700,
                    letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)",
                  }}>
                    {f.badge.toUpperCase()}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: "17px",
                  fontWeight: 600, color: "#fff", marginBottom: "10px", letterSpacing: "0.01em",
                }}>
                  {f.title}
                </h3>

                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: "13px",
                  fontWeight: 300, lineHeight: 1.72,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "24px",
                  textTransform: "none",
                }}>
                  {f.desc}
                </p>

                <p style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontFamily: "'Inter', sans-serif", fontSize: "11px",
                  fontWeight: 600, color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.04em",
                }}>
                  {f.cta} <ArrowIcon />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ ROADMAP ════ */}
      <section className="home-section" style={{
        background: S.bg,
        borderTop: `1px solid ${S.border}`,
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ marginBottom: "44px" }}>
            <span style={S.eyebrow}>2026 SCHEDULE</span>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(26px, 3.5vw, 44px)",
              fontWeight: 600, color: "#fff",
            }}>
              Riftbound Roadmap
            </h2>
          </div>
          <RoadmapTimeline />
        </div>
      </section>

      {/* ════ NEWS ════ */}
      <section className="home-section" style={{
        background: S.surface,
        borderTop: `1px solid ${S.border}`,
      }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ marginBottom: "32px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <span style={S.eyebrow}>LATEST</span>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(26px, 3.5vw, 44px)",
                fontWeight: 600, color: "#fff",
              }}>
                News & Updates
              </h2>
            </div>
            <Link href="/news" style={{
              fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)",
              textDecoration: "none", paddingBottom: "6px",
              transition: "color 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)"; }}
            >
              ALL NEWS →
            </Link>
          </div>
          <NewsStrip />
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{
        padding: "32px 80px",
        borderTop: `1px solid ${S.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: S.bg,
      }}>
        <span style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "16px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)" }}>
          RIFTIUM
        </span>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.16)", letterSpacing: "0.08em" }}>
          FAN PROJECT · NOT AFFILIATED WITH RIOT GAMES
        </p>
      </footer>
    </div>
  );
}
