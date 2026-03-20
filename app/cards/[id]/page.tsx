"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  recorded_at: string;
}

const RARITY_COLOR: Record<string, string> = {
  Common: "#9ca3af",
  Uncommon: "#34d399",
  Rare: "#60a5fa",
  Epic: "#a78bfa",
  Legendary: "#fbbf24",
};

function Delta({ val }: { val: number | null }) {
  if (val === null || val === 0) return <span style={{ color: "rgba(255,255,255,0.3)" }}>—</span>;
  const positive = val > 0;
  return (
    <span style={{ color: positive ? "#34d399" : "#f87171", fontSize: "12px" }}>
      {positive ? "▲" : "▼"} €{Math.abs(val).toFixed(2)}
    </span>
  );
}

function PriceRow({ label, price, delta1d, delta7d }: { label: string; price: number | null; delta1d: number | null; delta7d: number | null }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 80px", gap: "8px", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>{price != null && price > 0 ? `€${price.toFixed(2)}` : "—"}</span>
      <Delta val={delta1d} />
      <Delta val={delta7d} />
    </div>
  );
}

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [card, setCard] = useState<Card | null>(null);
  const [price, setPrice] = useState<Price | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("cards").select("*").eq("id", id).single(),
      supabase.from("card_prices").select("*").eq("card_id", id).order("recorded_at", { ascending: false }).limit(1).single(),
    ]).then(([{ data: cardData }, { data: priceData }]) => {
      setCard(cardData as Card);
      setPrice(priceData as Price);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
      <div style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", fontSize: "13px" }}>Loading...</div>
    </div>
  );

  if (!card) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
      <div style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", fontSize: "13px" }}>Card not found</div>
    </div>
  );

  const rarityColor = RARITY_COLOR[card.rarity] ?? "#fff";

  return (
    <div style={{ minHeight: "100vh", paddingTop: "80px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Back */}
        <button onClick={() => router.back()} style={{
          background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer",
          fontSize: "12px", letterSpacing: "0.12em", marginBottom: "32px", padding: 0, display: "flex", alignItems: "center", gap: "6px",
        }}>← Back to cards</button>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "48px", alignItems: "start" }}>

          {/* Card image */}
          <div>
            <div style={{ borderRadius: "14px", overflow: "hidden", boxShadow: `0 0 40px ${rarityColor}33`, aspectRatio: "63/88" }}>
              {card.image_url
                ? <img src={card.image_url} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                : <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)" }} />
              }
            </div>

            {/* Foil badge */}
            {card.has_foil && (
              <div style={{ marginTop: "12px", textAlign: "center", fontSize: "11px", letterSpacing: "0.12em", color: "#a78bfa" }}>
                ✦ Foil available
              </div>
            )}

            {/* CardMarket link */}
            {card.cm_url && (
              <a href={card.cm_url} target="_blank" rel="noopener noreferrer" style={{
                display: "block", marginTop: "12px", textAlign: "center", padding: "10px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", color: "rgba(255,255,255,0.6)", fontSize: "11px",
                letterSpacing: "0.1em", textDecoration: "none", transition: "all 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                View on CardMarket ↗
              </a>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Name + rarity */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
              <h1 style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "clamp(24px,3vw,40px)", color: "#fff", letterSpacing: "0.06em" }}>
                {card.name}
              </h1>
              <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", letterSpacing: "0.1em", border: `1px solid ${rarityColor}`, color: rarityColor, background: `${rarityColor}18`, whiteSpace: "nowrap" }}>
                {card.rarity}
              </span>
            </div>

            {/* Type line */}
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", letterSpacing: "0.1em", marginBottom: "24px" }}>
              {[card.card_type, card.supertype].filter(Boolean).join(" · ")} · {card.set_name}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <Stat label="Cost" value={card.cost != null ? String(card.cost) : "—"} />
              {card.might != null && <Stat label="Might" value={String(card.might)} />}
              {card.color?.length > 0 && <Stat label="Domain" value={card.color.join(", ")} />}
              {card.cycle && <Stat label="Cycle" value={card.cycle} />}
            </div>

            {/* Tags */}
            {card.tags?.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
                {card.tags.map((t) => (
                  <span key={t} style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", letterSpacing: "0.08em", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Effect */}
            {card.effect && (
              <div style={{ padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>Effect</div>
                <div style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}
                  dangerouslySetInnerHTML={{ __html: card.effect.replace(/<br\s*\/?>/gi, "<br/>") }}
                />
              </div>
            )}

            {/* Flavor */}
            {card.flavor && (
              <div style={{ padding: "12px 16px", borderLeft: "2px solid rgba(255,255,255,0.1)", marginBottom: "28px" }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontStyle: "italic", lineHeight: 1.6 }}>
                  {card.flavor}
                </p>
              </div>
            )}

            {/* Prices */}
            {price && (
              <div style={{ padding: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", marginBottom: "12px" }}>Market Prices</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 80px", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}> </span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>Price</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>1D</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>7D</span>
                </div>
                {card.has_normal && <PriceRow label="Standard" price={price.price} delta1d={price.delta_1d} delta7d={price.delta_7d} />}
                {card.has_foil && <PriceRow label="Foil" price={price.foil_price} delta1d={price.delta_1d_foil} delta7d={price.delta_7d_foil} />}
                {price.cm_price != null && price.cm_price > 0 && <PriceRow label="CardMarket" price={price.cm_price} delta1d={price.cm_price ? null : null} delta7d={null} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", minWidth: "70px", textAlign: "center" }}>
      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>{value}</div>
    </div>
  );
}
