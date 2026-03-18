"use client";

import { useState } from "react";

export interface Filters {
  colors: string[];
  type: string;
  rarity: string;
  format: string;
  cmc: string;
}

interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const COLORS = [
  { id: "w", label: "White", cls: "mana-w" },
  { id: "u", label: "Blue", cls: "mana-u" },
  { id: "b", label: "Black", cls: "mana-b" },
  { id: "r", label: "Red", cls: "mana-r" },
  { id: "g", label: "Green", cls: "mana-g" },
  { id: "c", label: "Colorless", cls: "mana-c" },
];

const TYPES = ["", "Creature", "Instant", "Sorcery", "Enchantment", "Artifact", "Planeswalker", "Land", "Battle"];
const RARITIES = ["", "Common", "Uncommon", "Rare", "Mythic"];
const FORMATS = ["", "Standard", "Pioneer", "Modern", "Legacy", "Vintage", "Commander", "Pauper"];

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  function toggleColor(id: string) {
    const colors = filters.colors.includes(id)
      ? filters.colors.filter((c) => c !== id)
      : [...filters.colors, id];
    onChange({ ...filters, colors });
  }

  function set(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  const activeCount = [
    filters.colors.length > 0,
    filters.type !== "",
    filters.rarity !== "",
    filters.format !== "",
    filters.cmc !== "",
  ].filter(Boolean).length;

  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          background: open ? "rgba(255,255,255,0.1)" : "rgba(22,27,43,0.8)",
          border: `1px solid ${open ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)"}`,
          borderRadius: "8px",
          color: "var(--text-primary)",
          fontFamily: "'Dongle', sans-serif",
          fontSize: "18px",
          cursor: "pointer",
          transition: "all 0.2s",
          backdropFilter: "blur(8px)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="20" y2="12" />
          <line x1="12" y1="18" x2="20" y2="18" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span style={{
            background: "var(--gold)",
            color: "#000",
            borderRadius: "999px",
            padding: "1px 7px",
            fontSize: "11px",
            fontWeight: 600,
          }}>
            {activeCount}
          </span>
        )}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: 0,
          width: "420px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-normal)",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          backdropFilter: "blur(16px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}>
          {/* Colors */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px", fontFamily: "'Dongle', sans-serif" }}>
              Color Identity
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => toggleColor(c.id)}
                  title={c.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: filters.colors.includes(c.id) ? "1px solid var(--gold)" : "1px solid var(--border-subtle)",
                    background: filters.colors.includes(c.id) ? "rgba(255,255,255,0.1)" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  <span className={c.cls} style={{ width: "10px", height: "10px", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Dongle', sans-serif" }}>
              Card Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => set("type", e.target.value)}
              style={selectStyle}
            >
              {TYPES.map((t) => <option key={t} value={t.toLowerCase()}>{t || "Any type"}</option>)}
            </select>
          </div>

          {/* Rarity */}
          <div>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Dongle', sans-serif" }}>
              Rarity
            </label>
            <select
              value={filters.rarity}
              onChange={(e) => set("rarity", e.target.value)}
              style={selectStyle}
            >
              {RARITIES.map((r) => <option key={r} value={r.toLowerCase()}>{r || "Any rarity"}</option>)}
            </select>
          </div>

          {/* Format */}
          <div>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Dongle', sans-serif" }}>
              Format
            </label>
            <select
              value={filters.format}
              onChange={(e) => set("format", e.target.value)}
              style={selectStyle}
            >
              {FORMATS.map((f) => <option key={f} value={f.toLowerCase()}>{f || "Any format"}</option>)}
            </select>
          </div>

          {/* CMC */}
          <div>
            <label style={{ display: "block", fontSize: "11px", letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Dongle', sans-serif" }}>
              Mana Value
            </label>
            <select
              value={filters.cmc}
              onChange={(e) => set("cmc", e.target.value)}
              style={selectStyle}
            >
              <option value="">Any</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7+">7+</option>
            </select>
          </div>

          {/* Reset */}
          {activeCount > 0 && (
            <div style={{ gridColumn: "1 / -1" }}>
              <button
                onClick={() => onChange({ colors: [], type: "", rarity: "", format: "", cmc: "" })}
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "'Dongle', sans-serif",
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: "var(--bg-surface)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "6px",
  color: "var(--text-primary)",
  fontFamily: "'Dongle', sans-serif",
  fontSize: "13px",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5248' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: "30px",
};
