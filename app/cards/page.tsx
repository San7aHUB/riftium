"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Card {
  id: string;
  name: string;
  image_url: string;
  card_type: string;
  supertype: string;
  color: string[];
  cost: number;
  might: number | null;
  rarity: string;
  set_name: string;
  tags: string[];
  effect: string;
  has_foil: boolean;
}

const COLORS = ["Calm", "Chaos", "Fury", "Valor", "Whimsy"];
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
const TYPES = ["Unit", "Spell", "Gear"];
const PAGE_SIZE = 40;

const RARITY_COLOR: Record<string, string> = {
  Common: "#9ca3af",
  Uncommon: "#34d399",
  Rare: "#60a5fa",
  Epic: "#a78bfa",
  Legendary: "#fbbf24",
};

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState("");
  const [sets, setSets] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Load distinct sets
  useEffect(() => {
    supabase.from("cards").select("set_name").then(({ data }) => {
      if (!data) return;
      const unique = [...new Set(data.map((r) => r.set_name).filter(Boolean))].sort();
      setSets(unique);
    });
  }, []);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("cards")
      .select("id,name,image_url,card_type,supertype,color,cost,might,rarity,set_name,tags,effect,has_foil", { count: "exact" })
      .order("name")
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (search) query = query.ilike("name", `%${search}%`);
    if (selectedColors.length) query = query.overlaps("color", selectedColors);
    if (selectedTypes.length) query = query.in("card_type", selectedTypes);
    if (selectedRarities.length) query = query.in("rarity", selectedRarities);
    if (selectedSet) query = query.eq("set_name", selectedSet);

    const { data, count, error } = await query;
    if (!error) {
      setCards(data as Card[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [search, selectedColors, selectedTypes, selectedRarities, selectedSet, page]);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const toggleFilter = (val: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
    setPage(0);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "80px", position: "relative", zIndex: 2 }}>

      {/* Header */}
      <div style={{ padding: "32px 40px 0", maxWidth: "1600px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "clamp(28px,4vw,48px)", color: "#fff", letterSpacing: "0.08em", marginBottom: "4px" }}>
          CARD GALLERY
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", letterSpacing: "0.1em" }}>
          {total > 0 ? `${total} CARDS` : "LOADING..."}
        </p>
      </div>

      {/* Filters */}
      <div style={{
        padding: "20px 40px", maxWidth: "1600px", margin: "0 auto",
        display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center",
      }}>
        {/* Search */}
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search cards..."
          style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px", padding: "8px 16px", color: "#fff", fontSize: "13px",
            outline: "none", minWidth: "220px", backdropFilter: "blur(8px)",
            fontFamily: "inherit", letterSpacing: "0.05em",
          }}
        />

        {/* Set */}
        <select
          value={selectedSet}
          onChange={(e) => { setSelectedSet(e.target.value); setPage(0); }}
          style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px", padding: "8px 16px", color: "#fff", fontSize: "13px",
            outline: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em",
          }}
        >
          <option value="">All Sets</option>
          {sets.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Colors */}
        <div style={{ display: "flex", gap: "6px" }}>
          {COLORS.map((c) => (
            <button key={c} onClick={() => toggleFilter(c, selectedColors, setSelectedColors)} style={{
              padding: "6px 12px", borderRadius: "20px", fontSize: "11px", letterSpacing: "0.08em",
              border: selectedColors.includes(c) ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.15)",
              background: selectedColors.includes(c) ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
              color: selectedColors.includes(c) ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer", transition: "all 0.15s",
            }}>{c}</button>
          ))}
        </div>

        {/* Types */}
        <div style={{ display: "flex", gap: "6px" }}>
          {TYPES.map((t) => (
            <button key={t} onClick={() => toggleFilter(t, selectedTypes, setSelectedTypes)} style={{
              padding: "6px 12px", borderRadius: "20px", fontSize: "11px", letterSpacing: "0.08em",
              border: selectedTypes.includes(t) ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.15)",
              background: selectedTypes.includes(t) ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
              color: selectedTypes.includes(t) ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        {/* Rarities */}
        <div style={{ display: "flex", gap: "6px" }}>
          {RARITIES.map((r) => (
            <button key={r} onClick={() => toggleFilter(r, selectedRarities, setSelectedRarities)} style={{
              padding: "6px 12px", borderRadius: "20px", fontSize: "11px", letterSpacing: "0.08em",
              border: selectedRarities.includes(r) ? `1px solid ${RARITY_COLOR[r]}` : "1px solid rgba(255,255,255,0.15)",
              background: selectedRarities.includes(r) ? `${RARITY_COLOR[r]}22` : "rgba(255,255,255,0.04)",
              color: selectedRarities.includes(r) ? RARITY_COLOR[r] : "rgba(255,255,255,0.5)",
              cursor: "pointer", transition: "all 0.15s",
            }}>{r}</button>
          ))}
        </div>

        {/* Reset */}
        {(search || selectedColors.length || selectedTypes.length || selectedRarities.length || selectedSet) && (
          <button onClick={() => {
            setSearchInput(""); setSearch(""); setSelectedColors([]);
            setSelectedTypes([]); setSelectedRarities([]); setSelectedSet(""); setPage(0);
          }} style={{
            padding: "6px 12px", borderRadius: "20px", fontSize: "11px",
            border: "1px solid rgba(255,100,100,0.4)", background: "rgba(255,100,100,0.08)",
            color: "rgba(255,120,120,0.8)", cursor: "pointer", letterSpacing: "0.08em",
          }}>✕ Reset</button>
        )}
      </div>

      {/* Grid */}
      <div style={{ padding: "0 40px 60px", maxWidth: "1600px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{
                aspectRatio: "63/88", borderRadius: "10px",
                background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "rgba(255,255,255,0.3)", fontSize: "14px", letterSpacing: "0.1em" }}>
            No cards found
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
            {cards.map((card) => (
              <div key={card.id} style={{ cursor: "pointer", transition: "transform 0.2s", }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px) scale(1.02)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "")}>
                <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "63/88", background: "rgba(255,255,255,0.05)" }}>
                  {card.image_url && (
                    <img src={card.image_url} alt={card.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  )}
                  {/* Rarity dot */}
                  <div style={{
                    position: "absolute", top: "8px", right: "8px",
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: RARITY_COLOR[card.rarity] ?? "#fff",
                    boxShadow: `0 0 6px ${RARITY_COLOR[card.rarity] ?? "#fff"}`,
                  }} />
                </div>
                <div style={{ marginTop: "6px", padding: "0 2px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#fff", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                    {card.card_type}{card.supertype ? ` · ${card.supertype}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px", flexWrap: "wrap" }}>
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={{
              padding: "8px 20px", borderRadius: "8px", fontSize: "12px", letterSpacing: "0.08em",
              border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)",
              color: page === 0 ? "rgba(255,255,255,0.2)" : "#fff", cursor: page === 0 ? "default" : "pointer",
            }}>← PREV</button>

            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const p = page < 4 ? i : page > totalPages - 4 ? totalPages - 7 + i : page - 3 + i;
              if (p < 0 || p >= totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)} style={{
                  padding: "8px 14px", borderRadius: "8px", fontSize: "12px",
                  border: p === page ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  background: p === page ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                  color: p === page ? "#fff" : "rgba(255,255,255,0.5)", cursor: "pointer",
                }}>{p + 1}</button>
              );
            })}

            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{
              padding: "8px 20px", borderRadius: "8px", fontSize: "12px", letterSpacing: "0.08em",
              border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)",
              color: page === totalPages - 1 ? "rgba(255,255,255,0.2)" : "#fff", cursor: page === totalPages - 1 ? "default" : "pointer",
            }}>NEXT →</button>
          </div>
        )}
      </div>
    </div>
  );
}
