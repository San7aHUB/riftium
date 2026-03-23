"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";
import CardModal from "@/app/components/CardModal";

interface CollectionCard {
  id: number;
  quantity: number;
  foil_qty: number;
  cards: {
    id: string;
    name: string;
    image_url: string;
    rarity: string;
    set_name: string;
    card_type: string;
    effect_hash: string;
  };
}

const RARITY_COLOR: Record<string, string> = {
  Common: "#9ca3af", Uncommon: "#34d399", Rare: "#60a5fa", Epic: "#c084fc", Legendary: "#fbbf24",
};

export default function CollectionPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CollectionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHash, setSelectedHash] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/");
  }, [authLoading, isLoggedIn, router]);

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("user_collection")
      .select("id, quantity, foil_qty, cards(id, name, image_url, rarity, set_name, card_type, effect_hash)")
      .order("id", { ascending: false });
    setItems((data as CollectionCard[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (isLoggedIn) fetchCollection(); }, [isLoggedIn, fetchCollection]);

  const updateQty = async (item: CollectionCard, qty: number, foilQty: number) => {
    if (qty <= 0 && foilQty <= 0) {
      await supabase.from("user_collection").delete().eq("id", item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      await supabase.from("user_collection").update({ quantity: qty, foil_qty: foilQty }).eq("id", item.id);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: qty, foil_qty: foilQty } : i));
    }
  };

  const totalCards = items.reduce((s, i) => s + i.quantity + i.foil_qty, 0);
  const uniqueCards = items.length;

  if (authLoading) return null;

  return (
    <div style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <div style={{ padding: "32px 40px 0", maxWidth: "1600px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "clamp(28px,4vw,48px)", color: "#fff", letterSpacing: "0.08em", marginBottom: "4px" }}>
          COLLEZIONE
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", letterSpacing: "0.1em" }}>
          {loading ? "CARICAMENTO..." : `${uniqueCards} CARTE UNICHE · ${totalCards} COPIE TOTALI`}
        </p>
      </div>

      <div style={{ padding: "24px 40px 60px", maxWidth: "1600px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: "63/88", borderRadius: "10px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "rgba(255,255,255,0.3)", fontSize: "14px", letterSpacing: "0.1em" }}>
            Nessuna carta nella collezione.<br />
            <span style={{ fontSize: "12px", opacity: 0.6 }}>Cerca una carta e aggiungila dalla pagina Cards.</span>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
            {items.map(item => {
              const card = item.cards;
              const rarityColor = RARITY_COLOR[card.rarity] ?? "#fff";
              return (
                <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* Card image */}
                  <div onClick={() => setSelectedHash(card.effect_hash)} style={{ cursor: "pointer", position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "63/88", background: "rgba(255,255,255,0.05)", transition: "transform 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px) scale(1.02)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "")}
                  >
                    {card.image_url && <img src={card.image_url} alt={card.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                    <div style={{ position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", borderRadius: "50%", background: rarityColor, boxShadow: `0 0 6px ${rarityColor}` }} />
                  </div>

                  {/* Name */}
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</div>

                  {/* Qty controls */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <QtyRow label="STD" value={item.quantity} color="#fff"
                      onDec={() => updateQty(item, Math.max(0, item.quantity - 1), item.foil_qty)}
                      onInc={() => updateQty(item, item.quantity + 1, item.foil_qty)} />
                    <QtyRow label="FOIL" value={item.foil_qty} color="#c084fc"
                      onDec={() => updateQty(item, item.quantity, Math.max(0, item.foil_qty - 1))}
                      onInc={() => updateQty(item, item.quantity, item.foil_qty + 1)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedHash && <CardModal effectHash={selectedHash} onClose={() => setSelectedHash(null)} />}
    </div>
  );
}

function QtyRow({ label, value, color, onDec, onInc }: {
  label: string; value: number; color: string; onDec: () => void; onInc: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ fontSize: "9px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", width: "28px" }}>{label}</span>
      <button onClick={onDec} disabled={value === 0} style={{
        width: "22px", height: "22px", borderRadius: "5px", border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)", color: value === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)",
        fontSize: "14px", cursor: value === 0 ? "default" : "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", transition: "all 0.15s", fontFamily: "inherit",
      }}>−</button>
      <span style={{ fontSize: "14px", fontWeight: 700, color, minWidth: "20px", textAlign: "center" }}>{value}</span>
      <button onClick={onInc} style={{
        width: "22px", height: "22px", borderRadius: "5px", border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)",
        fontSize: "14px", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", transition: "all 0.15s", fontFamily: "inherit",
      }}>+</button>
    </div>
  );
}
