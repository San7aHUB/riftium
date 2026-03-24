"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/contexts/AuthContext";

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
  cardtrader_url: string | null;
  promo: boolean;
}

interface Price {
  price: number | null;
  foil_price: number | null;
  delta_1d: number | null;
  delta_1d_foil: number | null;
  delta_7d: number | null;
  delta_7d_foil: number | null;
}

const RARITY_COLOR: Record<string, string> = {
  Common: "#9ca3af", Uncommon: "#34d399", Rare: "#60a5fa", Epic: "#c084fc", Legendary: "#fbbf24",
};
const DOMAIN_COLOR: Record<string, string> = {
  Calm: "#60a5fa", Chaos: "#a78bfa", Fury: "#f87171", Valor: "#fbbf24", Whimsy: "#f9a8d4",
};
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
const TYPES = ["Unit", "Spell", "Gear"];
const COLORS = ["Calm", "Chaos", "Fury", "Valor", "Whimsy"];

function Delta({ val }: { val: number | null }) {
  if (!val || Math.abs(val) < 0.001) return <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>—</span>;
  const pos = val > 0;
  return <span style={{ color: pos ? "#34d399" : "#f87171", fontSize: "11px", fontWeight: 600 }}>{pos ? "+" : ""}€{val.toFixed(2)}</span>;
}

const fieldLabel: React.CSSProperties = {
  fontSize: "10px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)",
  display: "block", marginBottom: "5px",
};
const fieldInput: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px",
  padding: "8px 12px", color: "#fff", fontSize: "13px",
  fontFamily: "inherit", outline: "none", transition: "border-color 0.15s",
};

export default function CardModal({ effectHash, onClose }: { effectHash: string; onClose: () => void }) {
  const { isAdmin } = useAuth();
  const [variants, setVariants] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card | null>(null);
  const [price, setPrice] = useState<Price | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Card>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    supabase.from("cards").select("*").eq("effect_hash", effectHash)
      .order("promo", { ascending: true }).order("id", { ascending: true })
      .then(({ data }) => {
        const all = (data as Card[]) ?? [];
        const base = all[0] ?? null;
        setVariants(all); setSelected(base);
        if (base) {
          supabase.from("card_prices").select("*").eq("card_id", base.id)
            .order("recorded_at", { ascending: false }).limit(1).single()
            .then(({ data: p }) => { setPrice(p as Price); setLoading(false); });
        } else { setLoading(false); }
      });
  }, [effectHash]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { if (editMode) setEditMode(false); else onClose(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, editMode]);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const openEdit = () => {
    if (!selected) return;
    setForm({ ...selected });
    setEditMode(true);
    setSaveMsg("");
  };

  const setField = (key: keyof Card, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true); setSaveMsg("");
    const { error } = await supabase.from("cards").update(form).eq("id", selected.id);
    if (error) { setSaveMsg("Errore: " + error.message); }
    else {
      const updated = { ...selected, ...form } as Card;
      setSelected(updated);
      setVariants(vs => vs.map(v => v.id === updated.id ? updated : v));
      setSaveMsg("Salvato!");
      setTimeout(() => { setEditMode(false); setSaveMsg(""); }, 800);
    }
    setSaving(false);
  };

  const card = selected;
  const rarityColor = card ? (RARITY_COLOR[card.rarity] ?? "#aaa") : "#aaa";

  return (
    <>
      <div onClick={() => { if (!editMode) onClose(); }} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
        animation: "fadeIn 0.15s ease",
      }} />

      <div style={{
        position: "fixed", inset: 0, zIndex: 101,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", pointerEvents: "none",
      }}>
        <div style={{
          pointerEvents: "all",
          background: "linear-gradient(145deg, rgba(22,22,30,0.98) 0%, rgba(14,14,20,0.99) 100%)",
          border: `1px solid ${editMode ? "rgba(192,132,252,0.4)" : rarityColor + "30"}`,
          borderRadius: "20px", width: "100%", maxWidth: "860px", maxHeight: "88vh",
          display: "flex", flexDirection: "column",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.8)`,
          animation: "modalIn 0.2s cubic-bezier(0.16,1,0.3,1)",
          overflow: "hidden", position: "relative",
        }}>

          {/* Admin gear */}
          {isAdmin && !editMode && (
            <button onClick={openEdit} title="Modifica carta" style={{
              position: "absolute", top: "16px", right: "56px", zIndex: 10,
              width: "30px", height: "30px", borderRadius: "50%",
              border: "1px solid rgba(192,132,252,0.3)",
              background: "rgba(192,132,252,0.08)", color: "rgba(192,132,252,0.7)",
              fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(192,132,252,0.2)"; (e.currentTarget as HTMLElement).style.color = "#c084fc"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(192,132,252,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(192,132,252,0.7)"; }}
            >⚙</button>
          )}

          {/* Close */}
          <button onClick={() => { if (editMode) setEditMode(false); else onClose(); }} style={{
            position: "absolute", top: "16px", right: "16px", zIndex: 10,
            width: "30px", height: "30px", borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
            fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
          >✕</button>

          {loading ? (
            <div style={{ padding: "100px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "12px", letterSpacing: "0.15em" }}>Loading...</div>
          ) : !card ? (
            <div style={{ padding: "100px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>Card not found</div>
          ) : (
            <div style={{ display: "flex", overflow: "hidden", flex: 1 }}>

              {/* ── Left column ── */}
              <div style={{
                width: "260px", flexShrink: 0, padding: "28px 20px 24px 28px",
                display: "flex", flexDirection: "column", gap: "16px",
                borderRight: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  borderRadius: "14px", overflow: "hidden", aspectRatio: "63/88",
                  boxShadow: `0 8px 40px ${rarityColor}40, 0 0 0 1px ${rarityColor}30`, flexShrink: 0,
                }}>
                  {card.image_url
                    ? <img src={card.image_url} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    : <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.04)" }} />
                  }
                </div>

                {variants.length > 1 && (
                  <div>
                    <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", marginBottom: "8px" }}>{variants.length} VARIANTS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {variants.map((v) => (
                        <button key={v.id} onClick={() => { setSelected(v); setEditMode(false); }} title={v.name} style={{
                          width: "44px", height: "62px", borderRadius: "6px", overflow: "hidden", padding: 0,
                          border: selected?.id === v.id ? `2px solid ${rarityColor}` : "2px solid rgba(255,255,255,0.08)",
                          cursor: "pointer", opacity: selected?.id === v.id ? 1 : 0.5, transition: "all 0.15s",
                          boxShadow: selected?.id === v.id ? `0 0 12px ${rarityColor}60` : "none",
                        }}
                          onMouseEnter={e => { if (selected?.id !== v.id) (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                          onMouseLeave={e => { if (selected?.id !== v.id) (e.currentTarget as HTMLElement).style.opacity = "0.5"; }}
                        >
                          {v.image_url ? <img src={v.image_url} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.04)" }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
                  {card.cardtrader_url && !editMode && (
                    <a href={card.cardtrader_url} target="_blank" rel="noopener noreferrer" style={{
                      display: "block", textAlign: "center", padding: "7px",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "10px",
                      letterSpacing: "0.08em", textDecoration: "none", transition: "all 0.15s",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    >CardTrader ↗</a>
                  )}
                </div>
              </div>

              {/* ── Right column ── */}
              <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 28px 28px" }}>

                {editMode ? (
                  /* ═══ EDIT MODE ═══ */
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                    <div style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#c084fc", marginBottom: "4px" }}>MODIFICA CARTA</div>

                    {/* Name */}
                    <div>
                      <label style={fieldLabel}>NOME</label>
                      <input style={fieldInput} value={form.name ?? ""} onChange={e => setField("name", e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                    </div>

                    {/* Type / Supertype / Rarity */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={fieldLabel}>TIPO</label>
                        <select style={{ ...fieldInput, cursor: "pointer" }} value={form.card_type ?? ""} onChange={e => setField("card_type", e.target.value)}>
                          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={fieldLabel}>SOTTOTIPO</label>
                        <input style={fieldInput} value={form.supertype ?? ""} onChange={e => setField("supertype", e.target.value)}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                      </div>
                      <div>
                        <label style={fieldLabel}>RARITÀ</label>
                        <select style={{ ...fieldInput, cursor: "pointer" }} value={form.rarity ?? ""} onChange={e => setField("rarity", e.target.value)}>
                          {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Cost / Might / Set / Cycle */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={fieldLabel}>COSTO</label>
                        <input type="number" style={fieldInput} value={form.cost ?? ""} onChange={e => setField("cost", parseInt(e.target.value))}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                      </div>
                      <div>
                        <label style={fieldLabel}>MIGHT</label>
                        <input type="number" style={fieldInput} value={form.might ?? ""} onChange={e => setField("might", e.target.value === "" ? null : parseInt(e.target.value))}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                      </div>
                      <div>
                        <label style={fieldLabel}>SET</label>
                        <input style={fieldInput} value={form.set_name ?? ""} onChange={e => setField("set_name", e.target.value)}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                      </div>
                      <div>
                        <label style={fieldLabel}>CYCLE</label>
                        <input style={fieldInput} value={form.cycle ?? ""} onChange={e => setField("cycle", e.target.value || null)}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <label style={fieldLabel}>DOMINI</label>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {COLORS.map(c => {
                          const active = (form.color ?? []).includes(c);
                          return (
                            <button key={c} type="button" onClick={() => {
                              const curr = form.color ?? [];
                              setField("color", active ? curr.filter(x => x !== c) : [...curr, c]);
                            }} style={{
                              padding: "5px 12px", borderRadius: "20px", fontSize: "11px", cursor: "pointer",
                              border: active ? `1px solid ${DOMAIN_COLOR[c]}` : "1px solid rgba(255,255,255,0.12)",
                              background: active ? `${DOMAIN_COLOR[c]}20` : "rgba(255,255,255,0.04)",
                              color: active ? DOMAIN_COLOR[c] : "rgba(255,255,255,0.4)",
                              transition: "all 0.15s",
                            }}>{c}</button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label style={fieldLabel}>TAG (separati da virgola)</label>
                      <input style={fieldInput} value={(form.tags ?? []).join(", ")}
                        onChange={e => setField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                    </div>

                    {/* Effect */}
                    <div>
                      <label style={fieldLabel}>EFFETTO</label>
                      <textarea rows={4} style={{ ...fieldInput, resize: "vertical", lineHeight: 1.6 }}
                        value={form.effect ?? ""} onChange={e => setField("effect", e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                    </div>

                    {/* Flavor */}
                    <div>
                      <label style={fieldLabel}>FLAVOR TEXT</label>
                      <textarea rows={2} style={{ ...fieldInput, resize: "vertical", lineHeight: 1.6 }}
                        value={form.flavor ?? ""} onChange={e => setField("flavor", e.target.value)}
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                    </div>

                    {/* Image URL / CM URL */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={fieldLabel}>IMAGE URL</label>
                        <input style={fieldInput} value={form.image_url ?? ""} onChange={e => setField("image_url", e.target.value)}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                      </div>
                      <div>
                        <label style={fieldLabel}>CARDMARKET URL</label>
                        <input style={fieldInput} value={form.cm_url ?? ""} onChange={e => setField("cm_url", e.target.value || null)}
                          onFocus={e => (e.currentTarget.style.borderColor = "rgba(192,132,252,0.5)")}
                          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
                      </div>
                    </div>

                    {/* Flags */}
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                      {([["has_normal", "Standard"], ["has_foil", "Foil"], ["promo", "Promo"]] as [keyof Card, string][]).map(([key, label]) => (
                        <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                          <input type="checkbox" checked={!!form[key]} onChange={e => setField(key, e.target.checked)}
                            style={{ width: "15px", height: "15px", accentColor: "#c084fc", cursor: "pointer" }} />
                          {label}
                        </label>
                      ))}
                    </div>

                    {/* Save / Cancel */}
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "4px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <button onClick={handleSave} disabled={saving} style={{
                        padding: "10px 28px", borderRadius: "10px", border: "none",
                        background: saving ? "rgba(192,132,252,0.3)" : "#c084fc",
                        color: "#fff", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em",
                        cursor: saving ? "default" : "pointer", fontFamily: "inherit", transition: "opacity 0.15s",
                      }}
                        onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = "0.85"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                      >{saving ? "..." : "SALVA"}</button>
                      <button onClick={() => setEditMode(false)} style={{
                        padding: "10px 20px", borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.12)", background: "transparent",
                        color: "rgba(255,255,255,0.5)", fontSize: "12px",
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                      >Annulla</button>
                      {saveMsg && <span style={{ fontSize: "12px", color: saveMsg.startsWith("Errore") ? "#f87171" : "#34d399" }}>{saveMsg}</span>}
                    </div>
                  </div>

                ) : (
                  /* ═══ VIEW MODE ═══ */
                  <>
                    <div style={{ marginBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: "9px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)",
                          padding: "3px 8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}>{card.set_name?.toUpperCase()}</span>
                        {card.promo && (
                          <span style={{
                            fontSize: "9px", letterSpacing: "0.12em", color: "#fbbf24",
                            padding: "3px 8px", background: "rgba(251,191,36,0.08)",
                            borderRadius: "4px", border: "1px solid rgba(251,191,36,0.2)",
                          }}>PROMO</span>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "clamp(22px,3vw,34px)", color: "#fff", lineHeight: 1.1, letterSpacing: "0.04em", marginBottom: "8px" }}>{card.name}</h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>{[card.card_type, card.supertype].filter(Boolean).join(" · ")}</span>
                        <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "10px", letterSpacing: "0.1em", border: `1px solid ${rarityColor}60`, color: rarityColor, background: `${rarityColor}12` }}>{card.rarity}</span>
                      </div>
                    </div>

                    <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "18px 0" }} />

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                      {card.cost != null && (
                        <div style={{ padding: "8px 16px", borderRadius: "10px", textAlign: "center", minWidth: "56px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "2px" }}>COST</div>
                          <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{card.cost}</div>
                        </div>
                      )}
                      {card.might != null && (
                        <div style={{ padding: "8px 16px", borderRadius: "10px", textAlign: "center", minWidth: "56px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "2px" }}>MIGHT</div>
                          <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{card.might}</div>
                        </div>
                      )}
                      {card.color?.map((c) => (
                        <div key={c} style={{ padding: "8px 16px", borderRadius: "10px", textAlign: "center", background: `${DOMAIN_COLOR[c] ?? "#fff"}10`, border: `1px solid ${DOMAIN_COLOR[c] ?? "#fff"}30` }}>
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "2px" }}>DOMAIN</div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: DOMAIN_COLOR[c] ?? "#fff", letterSpacing: "0.04em" }}>{c}</div>
                        </div>
                      ))}
                      {card.cycle && (
                        <div style={{ padding: "8px 16px", borderRadius: "10px", textAlign: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "2px" }}>CYCLE</div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{card.cycle}</div>
                        </div>
                      )}
                    </div>

                    {card.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "20px" }}>
                        {card.tags.map((t) => (
                          <span key={t} style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "10px", letterSpacing: "0.06em", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.5)" }}>{t}</span>
                        ))}
                      </div>
                    )}

                    {card.effect && (
                      <div style={{ padding: "16px 18px", borderRadius: "12px", marginBottom: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: `3px solid ${rarityColor}50` }}>
                        <div style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", marginBottom: "8px" }}>EFFECT</div>
                        <div style={{ fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.82)" }} dangerouslySetInnerHTML={{ __html: card.effect.replace(/<br\s*\/?>/gi, "<br/>") }} />
                      </div>
                    )}

                    {card.flavor && (
                      <div style={{ padding: "10px 16px", marginBottom: "20px" }}>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", fontStyle: "italic", lineHeight: 1.65 }}>&ldquo;{card.flavor}&rdquo;</p>
                      </div>
                    )}

                    {price && (price.price || price.foil_price) && (
                      <>
                        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "18px" }} />
                        <div style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", marginBottom: "12px" }}>MARKET PRICES</div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          {price.price != null && price.price > 0 && (
                            <div style={{ padding: "12px 16px", borderRadius: "10px", minWidth: "120px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "6px" }}>STANDARD</div>
                              <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>€{price.price.toFixed(2)}</div>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <div><span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginRight: "4px" }}>1D</span><Delta val={price.delta_1d} /></div>
                                <div><span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginRight: "4px" }}>7D</span><Delta val={price.delta_7d} /></div>
                              </div>
                            </div>
                          )}
                          {price.foil_price != null && price.foil_price > 0 && (
                            <div style={{ padding: "12px 16px", borderRadius: "10px", minWidth: "120px", background: "rgba(192,132,252,0.04)", border: "1px solid rgba(192,132,252,0.15)" }}>
                              <div style={{ fontSize: "9px", color: "#c084fc", letterSpacing: "0.1em", opacity: 0.7, marginBottom: "6px" }}>FOIL</div>
                              <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>€{price.foil_price.toFixed(2)}</div>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <div><span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginRight: "4px" }}>1D</span><Delta val={price.delta_1d_foil} /></div>
                                <div><span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginRight: "4px" }}>7D</span><Delta val={price.delta_7d_foil} /></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

