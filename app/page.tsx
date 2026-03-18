"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import FilterPanel, { type Filters } from "./components/FilterPanel";
import CardCard from "./components/CardCard";

interface ScryfallCard {
  id: string;
  name: string;
  mana_cost?: string;
  type_line: string;
  rarity: string;
  set_name: string;
  set: string;
  image_uris?: { normal: string; art_crop: string };
  card_faces?: Array<{ image_uris?: { normal: string; art_crop: string } }>;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  prices?: { usd?: string; eur?: string };
}

interface ScryfallResponse {
  data: ScryfallCard[];
  total_cards: number;
  has_more: boolean;
  next_page?: string;
}

function buildQuery(text: string, filters: Filters): string {
  const parts: string[] = [];
  if (text.trim()) parts.push(text.trim());
  if (filters.colors.length > 0) {
    const colors = filters.colors.filter((c) => c !== "c").join("");
    if (colors) parts.push(`c:${colors}`);
    if (filters.colors.includes("c")) parts.push("c:c");
  }
  if (filters.type) parts.push(`t:${filters.type}`);
  if (filters.rarity) parts.push(`r:${filters.rarity}`);
  if (filters.format) parts.push(`f:${filters.format}`);
  if (filters.cmc === "7+") parts.push("cmc>=7");
  else if (filters.cmc) parts.push(`cmc=${filters.cmc}`);
  return parts.join(" ") || "*";
}


function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const QUICK_SEARCHES = [
  { label: "Creatures", q: "t:creature" },
  { label: "Instants", q: "t:instant" },
  { label: "Planeswalkers", q: "t:planeswalker" },
  { label: "Artifacts", q: "t:artifact" },
  { label: "Free Spells", q: "cmc=0" },
  { label: "Commander", q: "f:commander" },
];

const EMPTY_FILTERS: Filters = { colors: [], type: "", rarity: "", format: "", cmc: "" };

export default function Home() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [cards, setCards] = useState<ScryfallCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const searchWithQuery = useCallback(async (q: string, currentFilters: Filters, reset = true) => {
    const builtQ = buildQuery(q, currentFilters);
    setLoading(true);
    setError("");
    if (reset) { setCards([]); setSearched(true); }

    try {
      const url = reset
        ? `https://api.scryfall.com/cards/search?q=${encodeURIComponent(builtQ)}&order=name&include_extras=false`
        : nextPage!;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) { setError("No cards found. Try different search terms."); setCards([]); }
        else setError("Search failed. Please try again.");
        setLoading(false);
        return;
      }
      const data: ScryfallResponse = await res.json();
      setCards((prev) => reset ? data.data : [...prev, ...data.data]);
      setTotal(data.total_cards);
      setHasMore(data.has_more);
      setNextPage(data.next_page || null);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [nextPage]);

  const search = useCallback((reset = true) => {
    searchWithQuery(query, filters, reset);
  }, [query, filters, searchWithQuery]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") search(true);
  }

  function handleQuickSearch(q: string) {
    setQuery(q);
    searchWithQuery(q, filters, true);
  }

  useEffect(() => {
    if (searched) searchWithQuery(query, filters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>

      {/* ── Navbar ── */}
      <nav className="navbar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "60px",
        display: "flex", alignItems: "center",
        padding: "0 32px",
        background: "rgba(7, 9, 13, 0.72)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        gap: "16px",
        overflow: "hidden",
      }}>

        {/* Logo */}
        <button
          onClick={() => { setSearched(false); setCards([]); setQuery(""); setFilters(EMPTY_FILTERS); setError(""); setMobileMenuOpen(false); }}
          style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
        >
          <span style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "28px", letterSpacing: "0.18em", color: "#fff" }}>
            RIFTIUM
          </span>
        </button>

        {/* Nav links desktop — centrati */}
        <div className="nav-links-desktop" style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          alignItems: "center", gap: "8px",
        }}>
          {[
            { label: "Cards", q: "*" },
            { label: "Creatures", q: "t:creature" },
            { label: "Spells", q: "t:instant or t:sorcery" },
            { label: "Lands", q: "t:land" },
            { label: "Formats", q: "f:commander" },
          ].map((item) => (
            <button key={item.label} onClick={() => handleQuickSearch(item.q)} style={{
              padding: "6px 14px", background: "transparent", border: "none",
              color: "rgba(255,255,255,0.6)", fontFamily: "'Dongle', sans-serif",
              fontSize: "18px", cursor: "pointer", letterSpacing: "0.08em", transition: "color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >{item.label}</button>
          ))}
        </div>

        {/* Destra: collection link + search (risultati) + hamburger */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <Link href="/cards" style={{
            padding: "6px 14px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "7px",
            color: "var(--gold)",
            fontFamily: "'Dongle', sans-serif",
            fontSize: "16px",
            textDecoration: "none",
            letterSpacing: "0.06em",
            transition: "all 0.15s",
          }}>
            Collection
          </Link>
          {searched && (
            <div style={{ display: "flex", alignItems: "center", background: "rgba(7,9,13,0.6)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", height: "36px", overflow: "hidden" }}>
              <div style={{ padding: "0 10px", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
                <SearchIcon size={14} />
              </div>
              <input
                type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search…"
                className="nav-search-input"
                style={{ width: "200px", background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "16px", fontFamily: "'Dongle', sans-serif" }}
              />
              <button onClick={() => search(true)} disabled={loading} style={{
                height: "26px", width: "26px", margin: "0 5px", background: "#fff", border: "none",
                borderRadius: "50%", color: "#000", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1, flexShrink: 0, transition: "transform 0.15s",
              }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          )}

          {/* Hamburger — solo mobile */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileMenuOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", color: "#fff", display: "flex", flexDirection: "column", gap: "5px" }}
            aria-label="Menu"
          >
            <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", borderRadius: "2px", transition: "transform 0.2s", transform: mobileMenuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", borderRadius: "2px", opacity: mobileMenuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "#fff", borderRadius: "2px", transition: "transform 0.2s", transform: mobileMenuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {[
            { label: "Cards", q: "*" },
            { label: "Creatures", q: "t:creature" },
            { label: "Spells", q: "t:instant or t:sorcery" },
            { label: "Lands", q: "t:land" },
            { label: "Formats", q: "f:commander" },
          ].map((item) => (
            <button key={item.label} onClick={() => { handleQuickSearch(item.q); setMobileMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.8)", fontFamily: "'Dongle', sans-serif", letterSpacing: "0.08em" }}
            >{item.label}</button>
          ))}
        </div>
      )}

      {/* ── Hero ── */}
      {!searched && (
        <section className="hero-section" style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 24px 120px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Particelle fluttuanti */}
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <p className="hero-subtitle" style={{
              color: "#fff",
              fontSize: "clamp(16px, 2vw, 20px)",
              fontFamily: "'Tilt Warp', sans-serif",
              fontWeight: 300, letterSpacing: "0.18em",
              maxWidth: "520px", margin: "0 auto", lineHeight: 1.7,
              textShadow: "0 1px 12px rgba(0,0,0,0.8)",
              animation: "title-glow 4s ease-in-out infinite",
            }}>
              Advanced card search for Riftbound.
            </p>
          </div>

          {/* Search box — glass */}
          <div className="hero-searchbox" style={{ width: "100%", maxWidth: "700px" }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "rgba(7, 9, 13, 0.78)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${searchFocused ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.18)"}`,
              borderRadius: "14px",
              overflow: "hidden",
              padding: "2px 5px",
              boxShadow: searchFocused
                ? "0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
              transform: searchFocused ? "scale(1.07)" : "scale(1)",
              transformOrigin: "center",
              transition: "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
            }}>
              <div style={{ padding: "0 16px", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                <SearchIcon size={20} />
              </div>
              <input
                ref={heroInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder='Try "lightning bolt" or "o:flying t:creature c:u"'
                style={{
                  flex: 1, padding: "10px 0",
                  background: "transparent", border: "none", outline: "none",
                  color: "#fff", fontSize: "20px",
                  fontWeight: 400, fontFamily: "'Dongle', sans-serif",
                }}
              />
              <button
                onClick={() => search(true)}
                disabled={loading}
                style={{
                  height: "44px", width: "44px", margin: "0 6px",
                  background: "#fff",
                  border: "none", borderRadius: "50%",
                  color: "#000",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1, flexShrink: 0,
                  transition: "transform 0.15s, opacity 0.15s",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                {loading
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                }
              </button>
            </div>

            {/* Quick chips */}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              {QUICK_SEARCHES.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleQuickSearch(chip.q)}
                  style={{
                    padding: "6px 16px",
                    background: "rgba(7,9,13,0.65)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    borderRadius: "999px",
                    color: "#fff", fontSize: "18px",
                    cursor: "pointer", transition: "all 0.15s",
                    fontFamily: "'Dongle', sans-serif",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(255,255,255,0.15)";
                    el.style.borderColor = "rgba(255,255,255,0.4)";
                    el.style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(10,12,20,0.5)";
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.color = "rgba(255,255,255,0.65)";
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Syntax hint */}
            <p style={{
              textAlign: "center", marginTop: "18px",
              fontSize: "16px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em",
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            }}>
              <code style={{ color: "var(--gold-dim)" }}>o:</code> oracle ·&nbsp;
              <code style={{ color: "var(--gold-dim)" }}>t:</code> type ·&nbsp;
              <code style={{ color: "var(--gold-dim)" }}>c:</code> color ·&nbsp;
              <code style={{ color: "var(--gold-dim)" }}>f:</code> format
            </p>
          </div>
        </section>
      )}

      {/* ── Results ── */}
      {searched && (
        <main style={{ paddingTop: "60px" }}>

          {/* Filters bar */}
          <div className="filter-bar" style={{
            position: "sticky", top: "60px", zIndex: 50,
            background: "rgba(7,9,13,0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "10px 32px",
            display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
          }}>
            <FilterPanel filters={filters} onChange={setFilters} />
            {total > 0 && !loading && (
              <span style={{
                marginLeft: "auto", fontSize: "12px",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'Dongle', sans-serif", letterSpacing: "0.06em",
              }}>
                {total.toLocaleString()} cards
              </span>
            )}
          </div>

          {/* Card grid */}
          <div style={{
            background: "var(--bg-void)",
            minHeight: "calc(100vh - 120px)",
          }}>
            <div className="card-grid-wrapper" style={{ padding: "32px", maxWidth: "1700px", margin: "0 auto" }}>

              {error && (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: "0 auto 16px", display: "block", color: "var(--text-muted)", opacity: 0.4 }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p style={{ color: "var(--text-muted)", fontFamily: "'Dongle', sans-serif", fontSize: "14px" }}>{error}</p>
                </div>
              )}

              {loading && cards.length === 0 && (
                <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} style={{ borderRadius: "12px", overflow: "hidden", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ aspectRatio: "63/88", background: "linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                      <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ height: "12px", background: "var(--bg-elevated)", borderRadius: "4px", width: "80%" }} />
                        <div style={{ height: "10px", background: "var(--bg-elevated)", borderRadius: "4px", width: "55%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cards.length > 0 && (
                <>
                  <div className="card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
                    {cards.map((card, i) => <CardCard key={card.id} card={card} index={i} />)}
                  </div>
                  {hasMore && (
                    <div style={{ textAlign: "center", marginTop: "48px" }}>
                      <button
                        onClick={() => search(false)}
                        disabled={loading}
                        style={{
                          padding: "12px 40px",
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: "8px",
                          color: "rgba(255,255,255,0.5)",
                          fontFamily: "'Dongle', sans-serif", fontSize: "13px",
                          cursor: loading ? "not-allowed" : "pointer",
                          letterSpacing: "0.06em", transition: "all 0.2s",
                        }}
                      >
                        {loading ? "Loading…" : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ── Footer ── */}
      <footer style={{
        textAlign: "center", padding: "28px 32px",
        color: "rgba(255,255,255,0.2)", fontSize: "11px", letterSpacing: "0.08em",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "var(--bg-void)",
      }}>
        <span style={{ fontFamily: "'Tilt Warp', sans-serif", letterSpacing: "0.14em", fontSize: "13px" }}>RIFTIUM</span>
      </footer>
    </div>
  );
}
