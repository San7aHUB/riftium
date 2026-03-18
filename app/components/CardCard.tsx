"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

interface CardCardProps {
  card: ScryfallCard;
  index: number;
}

const RARITY_COLORS: Record<string, string> = {
  common: "#9ca3af",
  uncommon: "#94a3b8",
  rare: "#c9a84c",
  mythic: "#f97316",
  special: "#a855f7",
  bonus: "#ec4899",
};

function parseMana(cost: string): React.ReactNode[] {
  if (!cost) return [];
  const symbols = cost.match(/\{[^}]+\}/g) || [];
  return symbols.map((sym, i) => {
    const inner = sym.slice(1, -1);
    const colorMap: Record<string, string> = { W: "#fef3c7", U: "#93c5fd", B: "#c084fc", R: "#fca5a5", G: "#86efac", C: "#9ca3af" };
    const bg = colorMap[inner] || "#6b7280";
    return (
      <span key={i} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: "16px", height: "16px", borderRadius: "50%",
        background: bg, color: "#000", fontSize: "9px", fontWeight: 700,
        flexShrink: 0, lineHeight: 1,
      }}>
        {inner.length <= 2 ? inner : ""}
      </span>
    );
  });
}

export default function CardCard({ card, index }: CardCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function saveCard() {
    if (saved || saving) return;
    setSaving(true);
    const imageUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || null;
    await supabase.from("cards").upsert({
      scryfall_id: card.id,
      name: card.name,
      mana_cost: card.mana_cost || null,
      type_line: card.type_line,
      rarity: card.rarity,
      set_code: card.set,
      set_name: card.set_name,
      image_url: imageUrl,
      oracle_text: card.oracle_text || null,
      power: card.power || null,
      toughness: card.toughness || null,
      price_usd: card.prices?.usd || null,
    }, { onConflict: "scryfall_id" });
    setSaving(false);
    setSaved(true);
  }

  const imageUrl = imgError
    ? null
    : (card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal);

  const rarityColor = RARITY_COLORS[card.rarity] || "#9ca3af";

  return (
    <div
      className="card-animate"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        background: "var(--bg-surface)",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.4)" : "var(--border-subtle)"}`,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.15)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}>
        {/* Card image */}
        <div style={{ position: "relative", aspectRatio: "63/88", background: "var(--bg-deep)" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={card.name}
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "filter 0.25s",
                filter: hovered ? "brightness(1.05)" : "brightness(0.95)",
              }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: "8px",
              color: "var(--text-muted)",
              padding: "16px",
              textAlign: "center",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{ fontSize: "11px", fontFamily: "'Dongle', sans-serif" }}>{card.name}</span>
            </div>
          )}

          {/* Rarity gem */}
          <div style={{
            position: "absolute", top: "8px", right: "8px",
            width: "10px", height: "10px", borderRadius: "50%",
            background: rarityColor,
            boxShadow: `0 0 8px ${rarityColor}`,
          }} title={card.rarity} />

          {/* Save button */}
          {hovered && (
            <button
              onClick={saveCard}
              disabled={saving}
              title={saved ? "Saved!" : "Save to collection"}
              style={{
                position: "absolute", top: "8px", left: "8px",
                width: "26px", height: "26px",
                background: saved ? "rgba(34,197,94,0.85)" : "rgba(7,9,13,0.8)",
                border: `1px solid ${saved ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.2)"}`,
                borderRadius: "50%",
                color: "#fff", cursor: saved ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px",
                transition: "all 0.2s",
                backdropFilter: "blur(4px)",
              }}
            >
              {saving ? "…" : saved ? "✓" : "+"}
            </button>
          )}

          {/* Hover overlay */}
          {hovered && card.oracle_text && (
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(7,9,13,0.97) 0%, rgba(7,9,13,0.7) 60%, transparent 100%)",
              display: "flex", alignItems: "flex-end",
              padding: "12px",
              transition: "opacity 0.2s",
            }}>
              <p style={{
                fontSize: "11px",
                lineHeight: 1.5,
                color: "var(--text-secondary)",
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {card.oracle_text}
              </p>
            </div>
          )}
        </div>

        {/* Card info */}
        <div style={{ padding: "10px 12px 12px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px", marginBottom: "4px" }}>
            <span style={{
              fontFamily: "'Dongle', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              flex: 1,
            }}>
              {card.name}
            </span>
            {card.mana_cost && (
              <div style={{ display: "flex", gap: "2px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "60px" }}>
                {parseMana(card.mana_cost)}
              </div>
            )}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>
            {card.type_line}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {card.set.toUpperCase()}
            </span>
            {card.prices?.usd && (
              <span style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 500 }}>
                ${card.prices.usd}
              </span>
            )}
            {(card.power && card.toughness) && (
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "'Dongle', sans-serif" }}>
                {card.power}/{card.toughness}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
