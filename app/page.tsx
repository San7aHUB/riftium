"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

export default function Home() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({ colors: [], type: "", rarity: "", format: "", cmc: "" });
  const [cards, setCards] = useState<ScryfallCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (reset = true) => {
    const q = buildQuery(query, filters);
    setLoading(true);
    setError("");
    if (reset) { setCards([]); setSearched(true); }

    try {
      const url = reset
        ? `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&order=name&include_extras=false`
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
  }, [query, filters, nextPage]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") search(true);
  }

  useEffect(() => {
    if (searched) search(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* Header */}
      <header style={{ padding: "40px 32px 0", textAlign: "center", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          {/* Logo mark */}
          <div style={{
            width: "36px", height: "36px",
            border: "2px solid var(--gold)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: "rotate(45deg)",
            boxShadow: "0 0 20px rgba(201,168,76,0.3)",
          }}>
            <div style={{ width: "12px", height: "12px", background: "var(--gold)", borderRadius: "2px" }} />
          </div>
          <h1 className="font-display" style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            background: "linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 50%, var(--arcane-bright) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            RIFTIUM
          </h1>
        </div>
        <p style={{
          color: "var(--text-muted)",
          fontSize: "13px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "'Cinzel', serif",
          marginBottom: "40px",
        }}>
          Advanced Card Search
        </p>

        {/* Search area */}
        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative" }}>
          <div className="search-glow" style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-normal)",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "12px",
          }}>
            <div style={{ padding: "0 16px", color: "var(--text-muted)", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Search cards — try "lightning bolt" or "o:flying t:creature"'
              style={{
                flex: 1,
                padding: "16px 0",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                fontWeight: 300,
              }}
            />
            <button
              onClick={() => search(true)}
              disabled={loading}
              style={{
                padding: "10px 24px",
                margin: "8px",
                background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#000",
                fontFamily: "'Cinzel', serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.05em",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {loading ? "..." : "Search"}
            </button>
          </div>

          {/* Filter row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" }}>
            <FilterPanel filters={filters} onChange={setFilters} />
            {total > 0 && (
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "'Cinzel', serif" }}>
                {total.toLocaleString()} cards found
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: "40px 32px", maxWidth: "1600px", margin: "0 auto" }}>
        {error && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)", fontFamily: "'Cinzel', serif" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: "0 auto 16px", display: "block", opacity: 0.4 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {!searched && !loading && (
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <div style={{ display: "inline-flex", gap: "8px", marginBottom: "40px", opacity: 0.4 }}>
              {["w", "u", "b", "r", "g"].map((c) => (
                <div key={c} className={`mana-${c}`} style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
              ))}
            </div>
            <p className="font-display" style={{ color: "var(--text-muted)", fontSize: "16px", letterSpacing: "0.08em" }}>
              Begin your search above
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px", opacity: 0.6 }}>
              Supports Scryfall syntax —{" "}
              <code style={{ color: "var(--gold-dim)" }}>o:</code> oracle text,{" "}
              <code style={{ color: "var(--gold-dim)" }}>t:</code> type,{" "}
              <code style={{ color: "var(--gold-dim)" }}>c:</code> color
            </p>
          </div>
        )}

        {loading && cards.length === 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ borderRadius: "12px", overflow: "hidden", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                <div style={{
                  aspectRatio: "63/88",
                  background: "linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }} />
                <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ height: "12px", background: "var(--bg-elevated)", borderRadius: "4px", width: "80%" }} />
                  <div style={{ height: "10px", background: "var(--bg-elevated)", borderRadius: "4px", width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {cards.length > 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
              {cards.map((card, i) => (
                <CardCard key={card.id} card={card} index={i} />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <button
                  onClick={() => search(false)}
                  disabled={loading}
                  style={{
                    padding: "12px 32px",
                    background: "transparent",
                    border: "1px solid var(--border-normal)",
                    borderRadius: "8px",
                    color: "var(--text-secondary)",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "13px",
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.05em",
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <footer style={{
        textAlign: "center",
        padding: "32px",
        color: "var(--text-muted)",
        fontSize: "11px",
        letterSpacing: "0.05em",
        borderTop: "1px solid var(--border-subtle)",
      }}>
        <span style={{ fontFamily: "'Cinzel', serif" }}>RIFTIUM</span>
        {" · "}Card data from{" "}
        <a href="https://scryfall.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-dim)", textDecoration: "none" }}>
          Scryfall
        </a>
        {" · "}Magic: The Gathering is © Wizards of the Coast
      </footer>
    </main>
  );
}
