"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface DBCard {
  id: string;
  scryfall_id: string;
  name: string;
  mana_cost: string | null;
  type_line: string | null;
  rarity: string | null;
  set_code: string | null;
  set_name: string | null;
  image_url: string | null;
  oracle_text: string | null;
  power: string | null;
  toughness: string | null;
  price_usd: string | null;
  created_at: string;
}

const RARITY_COLORS: Record<string, string> = {
  common: "#9ca3af",
  uncommon: "#94a3b8",
  rare: "#c9a84c",
  mythic: "#f97316",
};

type SortKey = "created_at" | "name" | "rarity" | "price_usd";

export default function CardsPage() {
  const [cards, setCards] = useState<DBCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("created_at");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetchCards();
  }, [sort]);

  async function fetchCards() {
    setLoading(true);
    const query = supabase.from("cards").select("*");

    if (sort === "price_usd") {
      query.order("price_usd", { ascending: false, nullsFirst: false });
    } else if (sort === "rarity") {
      query.order("rarity", { ascending: true });
    } else if (sort === "name") {
      query.order("name", { ascending: true });
    } else {
      query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (!error && data) setCards(data);
    setLoading(false);
  }

  async function deleteCard(id: string) {
    setDeleting(id);
    const { error } = await supabase.from("cards").delete().eq("id", id);
    if (!error) setCards((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  const filtered = cards.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.type_line || "").toLowerCase().includes(search.toLowerCase())
  );


  const stats = {
    total: cards.length,
    rare: cards.filter((c) => c.rarity === "rare").length,
    mythic: cards.filter((c) => c.rarity === "mythic").length,
    value: cards.reduce((sum, c) => sum + parseFloat(c.price_usd || "0"), 0).toFixed(2),
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "60px",
        display: "flex", alignItems: "center",
        padding: "0 32px",
        background: "rgba(7,9,13,0.8)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "none",
        gap: "16px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.18) 80%, transparent 100%)",
        }} />
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <span style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "24px", letterSpacing: "0.18em", color: "#fff" }}>
            RIFTIUM
          </span>
        </Link>
        <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "18px" }}>/</span>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "20px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>
          COLLECTION
        </span>
      </nav>

      <main style={{ paddingTop: "60px", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{
          padding: "48px 32px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(7,9,13,0.4)",
          backdropFilter: "blur(8px)",
        }}>
          <h1 style={{
            fontFamily: "'Tilt Warp', sans-serif",
            fontSize: "clamp(24px, 4vw, 40px)",
            letterSpacing: "0.08em",
            color: "#fff",
            marginBottom: "8px",
          }}>
            Card Collection
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", fontFamily: "'Outfit', sans-serif", marginBottom: "32px" }}>
            Carte salvate nel database
          </p>

          {/* Stats */}
          {!loading && (
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "32px" }}>
              {[
                { label: "Total", value: stats.total },
                { label: "Rare", value: stats.rare, color: "#ffffff" },
                { label: "Mythic", value: stats.mythic, color: "rgba(255,255,255,0.7)" },
                { label: "Value", value: `$${stats.value}`, color: "#ffffff" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                  padding: "14px 20px",
                  minWidth: "90px",
                }}>
                  <div style={{ fontSize: "22px", fontWeight: 600, color: s.color || "#fff", fontFamily: "'Tilt Warp', sans-serif" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.08em" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center",
              background: "rgba(7,9,13,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              overflow: "hidden",
              flex: "1", minWidth: "200px", maxWidth: "360px",
            }}>
              <div style={{ padding: "0 12px", color: "rgba(255,255,255,0.3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter collection..."
                style={{
                  flex: 1, padding: "9px 0", background: "transparent", border: "none",
                  outline: "none", color: "#fff", fontSize: "16px",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              style={{
                padding: "9px 32px 9px 12px",
                background: "rgba(7,9,13,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                color: "#fff",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "16px",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              <option value="created_at">Recently added</option>
              <option value="name">Name A–Z</option>
              <option value="rarity">Rarity</option>
              <option value="price_usd">Price</option>
            </select>

            {/* Back to search */}
            <Link href="/" style={{
              marginLeft: "auto",
              padding: "9px 18px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "8px",
              color: "var(--gold)",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "16px",
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "all 0.15s",
            }}>
              + Search Cards
            </Link>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "32px", maxWidth: "1700px", margin: "0 auto" }}>

          {/* Loading */}
          {loading && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  borderRadius: "12px", overflow: "hidden",
                  background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                }}>
                  <div style={{
                    aspectRatio: "63/88",
                    background: "linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                  }} />
                  <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ height: "12px", background: "var(--bg-elevated)", borderRadius: "4px", width: "75%" }} />
                    <div style={{ height: "10px", background: "var(--bg-elevated)", borderRadius: "4px", width: "50%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: "80px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>⬡</div>
              <p style={{ fontFamily: "'Tilt Warp', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "18px", letterSpacing: "0.08em", marginBottom: "8px" }}>
                {cards.length === 0 ? "No cards saved yet" : "No results"}
              </p>
              <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "14px", fontFamily: "'Outfit', sans-serif" }}>
                {cards.length === 0 ? "Search for cards and save them to your collection" : "Try a different search term"}
              </p>
              {cards.length === 0 && (
                <Link href="/" style={{
                  display: "inline-block", marginTop: "24px",
                  padding: "10px 24px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "8px",
                  color: "var(--gold)",
                  textDecoration: "none",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "18px",
                }}>
                  Search Cards
                </Link>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px",
            }}>
              {filtered.map((card, i) => {
                const isHovered = hovered === card.id;
                const rarityColor = RARITY_COLORS[card.rarity || ""] || "#9ca3af";

                return (
                  <div
                    key={card.id}
                    className="card-animate"
                    style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                    onMouseEnter={() => setHovered(card.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div style={{
                      position: "relative",
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: "var(--bg-surface)",
                      border: `1px solid ${isHovered ? "rgba(255,255,255,0.35)" : "var(--border-subtle)"}`,
                      transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                      transform: isHovered ? "translateY(-4px) scale(1.02)" : "none",
                      boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.08)" : "0 4px 12px rgba(0,0,0,0.3)",
                    }}>
                      {/* Image */}
                      <div style={{ position: "relative", aspectRatio: "63/88", background: "var(--bg-deep)" }}>
                        {card.image_url ? (
                          <img
                            src={card.image_url}
                            alt={card.name}
                            style={{
                              width: "100%", height: "100%", objectFit: "cover", display: "block",
                              filter: isHovered ? "brightness(1.05)" : "brightness(0.95)",
                              transition: "filter 0.25s",
                            }}
                          />
                        ) : (
                          <div style={{
                            width: "100%", height: "100%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "var(--text-muted)", flexDirection: "column", gap: "8px",
                          }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                            </svg>
                            <span style={{ fontSize: "10px", fontFamily: "'Outfit', sans-serif", padding: "0 8px", textAlign: "center" }}>{card.name}</span>
                          </div>
                        )}

                        {/* Rarity gem */}
                        <div style={{
                          position: "absolute", top: "8px", right: "8px",
                          width: "10px", height: "10px", borderRadius: "50%",
                          background: rarityColor,
                          boxShadow: `0 0 8px ${rarityColor}`,
                        }} title={card.rarity || ""} />

                        {/* Delete button on hover */}
                        {isHovered && (
                          <button
                            onClick={() => deleteCard(card.id)}
                            disabled={deleting === card.id}
                            title="Remove from collection"
                            style={{
                              position: "absolute", top: "8px", left: "8px",
                              width: "26px", height: "26px",
                              background: "rgba(239,68,68,0.85)",
                              border: "none", borderRadius: "50%",
                              color: "#fff", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "14px",
                              opacity: deleting === card.id ? 0.5 : 1,
                              transition: "all 0.15s",
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            {deleting === card.id ? "…" : "×"}
                          </button>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: "10px 12px 12px" }}>
                        <div style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#fff",
                          lineHeight: 1.2,
                          marginBottom: "2px",
                        }}>
                          {card.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
                          {card.type_line}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
                            {card.set_code?.toUpperCase()}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {card.price_usd && (
                              <span style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 500 }}>
                                ${card.price_usd}
                              </span>
                            )}
                            {card.power && card.toughness && (
                              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                                {card.power}/{card.toughness}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <footer style={{
        textAlign: "center", padding: "28px 32px",
        color: "rgba(255,255,255,0.15)", fontSize: "11px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "var(--bg-void)",
      }}>
        <span style={{ fontFamily: "'Tilt Warp', sans-serif", letterSpacing: "0.14em" }}>RIFTIUM</span>
      </footer>
    </div>
  );
}
