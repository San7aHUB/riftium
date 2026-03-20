"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Card {
  id: string;
  slug: string;
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
  flavor: string;
  cycle: string | null;
  has_normal: boolean;
  has_foil: boolean;
  cm_url: string | null;
}

interface Price {
  price: number | null;
  foil_price: number | null;
  delta_1d: number | null;
  delta_1d_foil: number | null;
  delta_7d: number | null;
  delta_7d_foil: number | null;
  cm_price: number | null;
  cm_foil_price: number | null;
}

const RARITY_COLOR: Record<string, string> = {
  Common: "#9ca3af",
  Uncommon: "#34d399",
  Rare: "#60a5fa",
  Epic: "#a78bfa",
  Legendary: "#fbbf24",
};

function Delta({ val }: { val: number | null }) {
  if (!val) return <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>;
  const pos = val > 0;
  return <span style={{ color: pos ? "#34d399" : "#f87171", fontSize: "12px" }}>{pos ? "▲" : "▼"} €{Math.abs(val).toFixed(2)}</span>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", textAlign: "center" }}>
      <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: "3px" }}>{label}</div>
      <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{value}</div>
    </div>
  );
}

export default function CardModal({ effectHash, onClose }: { effectHash: string; onClose: () => void }) {
  const [card, setCard] = useState<Card | null>(null);
  const [variants, setVariants] = useState<Card[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Card | null>(null);
  const [price, setPrice] = useState<Price | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("cards")
      .select("*")
      .eq("effect_hash", effectHash)
      .order("promo", { ascending: true })
      .order("id", { ascending: true })
      .then(({ data }) => {
        const all = (data as Card[]) ?? [];
        const base = all[0] ?? null;
        setCard(base);
        setVariants(all);
        setSelectedVariant(base);
        if (base) {
          supabase.from("card_prices").select("*").eq("card_id", base.id)
            .order("recorded_at", { ascending: false }).limit(1).single()
            .then(({ data: p }) => { setPrice(p as Price); setLoading(false); });
        } else {
          setLoading(false);
        }
      });
  }, [effectHash]);

  const displayCard = selectedVariant ?? card;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const rarityColor = displayCard ? (RARITY_COLOR[displayCard.rarity] ?? "#fff") : "#fff";

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
        animation: "fadeIn 0.15s ease",
      }} />

      {/* Modal */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 101,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px", pointerEvents: "none",
      }}>
        <div style={{
          background: "rgba(18,18,22,0.97)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px", width: "100%", maxWidth: "820px", maxHeight: "90vh",
          overflowY: "auto", pointerEvents: "all", position: "relative",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          animation: "modalIn 0.2s ease",
        }}>

          {/* Close button */}
          <button onClick={onClose} style={{
            position: "sticky", top: "12px", float: "right", marginRight: "12px",
            width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: "16px",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10, flexShrink: 0,
          }}>✕</button>

          {loading ? (
            <div style={{ padding: "80px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px", letterSpacing: "0.1em" }}>
              Loading...
            </div>
          ) : !displayCard ? (
            <div style={{ padding: "80px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Card not found</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "0" }}>

              {/* Left — image + varianti */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ borderRadius: "12px", overflow: "hidden", boxShadow: `0 0 32px ${rarityColor}44`, aspectRatio: "63/88" }}>
                  {displayCard.image_url
                    ? <img src={displayCard.image_url} alt={displayCard.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    : <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)" }} />
                  }
                </div>

                {/* Selettore varianti */}
                {variants.length > 1 && (
                  <div>
                    <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "6px" }}>
                      {variants.length} Variants
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {variants.map((v) => (
                        <button key={v.id} onClick={() => setSelectedVariant(v)} style={{
                          padding: "5px 8px", borderRadius: "6px", textAlign: "left",
                          background: selectedVariant?.id === v.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                          border: selectedVariant?.id === v.id ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                          color: selectedVariant?.id === v.id ? "#fff" : "rgba(255,255,255,0.5)",
                          fontSize: "10px", letterSpacing: "0.04em", cursor: "pointer",
                          lineHeight: 1.3,
                        }}>
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {displayCard.has_foil && (
                  <div style={{ textAlign: "center", fontSize: "10px", letterSpacing: "0.12em", color: "#a78bfa" }}>✦ Foil available</div>
                )}
                {displayCard.cm_url && (
                  <a href={displayCard.cm_url} target="_blank" rel="noopener noreferrer" style={{
                    display: "block", textAlign: "center", padding: "8px",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px", color: "rgba(255,255,255,0.5)", fontSize: "10px",
                    letterSpacing: "0.08em", textDecoration: "none",
                  }}>CardMarket ↗</a>
                )}
              </div>

              {/* Right — info */}
              <div style={{ padding: "24px 24px 24px 0", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>

                {/* Name + rarity */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <h2 style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "clamp(20px,2.5vw,30px)", color: "#fff", letterSpacing: "0.06em", flex: 1 }}>
                    {displayCard.name}
                  </h2>
                  <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "10px", letterSpacing: "0.1em", border: `1px solid ${rarityColor}`, color: rarityColor, background: `${rarityColor}18`, whiteSpace: "nowrap", marginTop: "4px" }}>
                    {displayCard.rarity}
                  </span>
                </div>

                {/* Type line */}
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "0.08em", marginBottom: "18px" }}>
                  {[displayCard.card_type, displayCard.supertype].filter(Boolean).join(" · ")} · {displayCard.set_name}
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
                  {displayCard.cost != null && <Stat label="Cost" value={String(displayCard.cost)} />}
                  {displayCard.might != null && <Stat label="Might" value={String(displayCard.might)} />}
                  {displayCard.color?.length > 0 && <Stat label="Domain" value={displayCard.color.join(", ")} />}
                  {displayCard.cycle && <Stat label="Cycle" value={displayCard.cycle} />}
                </div>

                {/* Tags */}
                {displayCard.tags?.length > 0 && (
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {displayCard.tags.map((t) => (
                      <span key={t} style={{ padding: "2px 9px", borderRadius: "20px", fontSize: "10px", letterSpacing: "0.06em", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.55)" }}>{t}</span>
                    ))}
                  </div>
                )}

                {/* Effect */}
                {displayCard.effect && (
                  <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", marginBottom: "10px" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>Effect</div>
                    <div style={{ fontSize: "13px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}
                      dangerouslySetInnerHTML={{ __html: displayCard.effect.replace(/<br\s*\/?>/gi, "<br/>") }}
                    />
                  </div>
                )}

                {/* Flavor */}
                {displayCard.flavor && (
                  <div style={{ padding: "10px 14px", borderLeft: "2px solid rgba(255,255,255,0.08)", marginBottom: "18px" }}>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontStyle: "italic", lineHeight: 1.6 }}>{displayCard.flavor}</p>
                  </div>
                )}

                {/* Prices */}
                {price && (
                  <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>Market Prices</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 70px 70px", gap: "6px" }}>
                      {["", "Price", "1D", "7D"].map((h) => (
                        <span key={h} style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>{h}</span>
                      ))}
                      {displayCard.has_normal && <>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Standard</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{price.price && price.price > 0 ? `€${price.price.toFixed(2)}` : "—"}</span>
                        <Delta val={price.delta_1d} />
                        <Delta val={price.delta_7d} />
                      </>}
                      {displayCard.has_foil && <>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Foil</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{price.foil_price && price.foil_price > 0 ? `€${price.foil_price.toFixed(2)}` : "—"}</span>
                        <Delta val={price.delta_1d_foil} />
                        <Delta val={price.delta_7d_foil} />
                      </>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
