"use client";

import { useState } from "react";

const YEAR_START = new Date("2026-01-01").getTime();
const YEAR_END   = new Date("2026-12-31").getTime();
const TODAY      = new Date();

function pct(iso: string) {
  const t = new Date(iso).getTime();
  return Math.max(0, Math.min(100, ((t - YEAR_START) / (YEAR_END - YEAR_START)) * 100));
}

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

const SETS = [
  { name: "Spiritforged", sub: "SET 2", iso: "2026-02-13" },
  { name: "Unleashed",    sub: "SET 3", iso: "2026-05-08" },
  { name: "Vendetta",     sub: "SET 4", iso: "2026-07-31" },
  { name: "Radiance",     sub: "SET 5", iso: "2026-10-23" },
];

const QUALIFIERS = [
  { name: "Bologna, Italy",        dates: "Feb 20–22",  iso: "2026-02-21" },
  { name: "Las Vegas, NV",         dates: "Feb 27–Mar 1", iso: "2026-02-28" },
  { name: "Lille, France",         dates: "Apr 17–19",  iso: "2026-04-18" },
  { name: "Atlanta, GA",           dates: "Apr 24–26",  iso: "2026-04-25" },
  { name: "Sydney, Australia",     dates: "May 15–17",  iso: "2026-05-16" },
  { name: "Vancouver, Canada",     dates: "May 29–31",  iso: "2026-05-30" },
  { name: "Utrecht, Netherlands",  dates: "Jun 12–14",  iso: "2026-06-13" },
  { name: "Hartford, CT",          dates: "Jun 19–21",  iso: "2026-06-20" },
  { name: "Barcelona, Spain",      dates: "Aug 21–23",  iso: "2026-08-22" },
  { name: "Singapore",             dates: "Sep 4–6",    iso: "2026-09-05" },
  { name: "Los Angeles, CA",       dates: "Sep 25–27",  iso: "2026-09-26" },
];

const CONVENTIONS = [
  { name: "PAX East",      dates: "Mar 26–30", iso: "2026-03-27" },
  { name: "Gen Con Indy",  dates: "Jul 30–Aug 2", iso: "2026-07-31" },
  { name: "PAX Unplugged", dates: "Dec 4–6",   iso: "2026-12-05" },
];

type Tip = { label: string; sub: string; x: number; above: boolean } | null;

export default function RoadmapTimeline() {
  const [tip, setTip] = useState<Tip>(null);

  const todayPct = pct(TODAY.toISOString());

  return (
    <div style={{
      width: "100%",
      maxWidth: "700px",
      marginBottom: "40px",
      animation: "heroSubIn 0.7s 0.25s ease both",
      position: "relative",
      userSelect: "none",
    }}>

      {/* Legend */}
      <div style={{
        display: "flex", gap: "18px", justifyContent: "center",
        marginBottom: "18px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "8px",
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.2)",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", display: "inline-block" }} />
          SET RELEASE
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", border: "1px solid rgba(99,179,237,0.7)", background: "rgba(99,179,237,0.2)", display: "inline-block" }} />
          REGIONAL QUALIFIER
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{
            width: "7px", height: "7px", display: "inline-block",
            background: "rgba(251,191,36,0.4)",
            transform: "rotate(45deg)",
          }} />
          CONVENTION
        </span>
      </div>

      {/* Timeline area */}
      <div style={{ position: "relative", height: "80px" }}>

        {/* SET labels above line */}
        {SETS.map(s => {
          const p = pct(s.iso);
          const past = new Date(s.iso) < TODAY;
          const isNext = !past && SETS.every(x => new Date(x.iso) >= TODAY || x.iso < s.iso);
          return (
            <div key={s.iso} style={{
              position: "absolute",
              left: `${p}%`,
              top: 0,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              pointerEvents: "none",
            }}>
              <span style={{
                fontFamily: "'Tilt Warp', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.07em",
                color: past ? "rgba(255,255,255,0.18)" : isNext ? "#fff" : "rgba(255,255,255,0.55)",
                whiteSpace: "nowrap",
              }}>{s.name}</span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "8px",
                letterSpacing: "0.15em",
                color: past ? "rgba(255,255,255,0.1)" : isNext ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)",
                whiteSpace: "nowrap",
              }}>{s.sub}</span>
            </div>
          );
        })}

        {/* The axis line — sits at 60% of the 80px container */}
        <div style={{ position: "absolute", top: "58px", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.1)" }} />

        {/* Month ticks */}
        {MONTHS.map((m, i) => {
          const x = (i / 11) * 100;
          return (
            <div key={m} style={{
              position: "absolute",
              left: `${x}%`,
              top: "52px",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
            }}>
              <div style={{ width: "1px", height: "5px", background: "rgba(255,255,255,0.07)" }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "7px",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.15)",
                marginTop: "3px",
              }}>{m}</span>
            </div>
          );
        })}

        {/* TODAY marker */}
        <div style={{
          position: "absolute",
          left: `${todayPct}%`,
          top: "48px",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}>
          <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.35)" }} />
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.5)", marginTop: "-2px" }} />
        </div>

        {/* SET nodes on the line */}
        {SETS.map(s => {
          const p = pct(s.iso);
          const past = new Date(s.iso) < TODAY;
          const nextSet = SETS.find(x => new Date(x.iso) >= TODAY);
          const isNext = nextSet?.iso === s.iso;
          return (
            <div
              key={s.iso}
              style={{
                position: "absolute",
                left: `${p}%`,
                top: "51px",
                transform: "translateX(-50%)",
                width: isNext ? "14px" : "10px",
                height: isNext ? "14px" : "10px",
                borderRadius: "50%",
                background: past ? "rgba(255,255,255,0.15)" : isNext ? "#ffffff" : "rgba(255,255,255,0.55)",
                boxShadow: isNext ? "0 0 16px rgba(255,255,255,0.7), 0 0 4px rgba(255,255,255,0.4)" : "none",
                animation: isNext ? "glow-pulse 2.5s ease-in-out infinite" : "none",
                cursor: "default",
                zIndex: 4,
                marginTop: isNext ? "-2px" : "0px",
              }}
              onMouseEnter={() => setTip({ label: s.name, sub: `${s.sub} · ${new Date(s.iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`, x: p, above: true })}
              onMouseLeave={() => setTip(null)}
            />
          );
        })}

        {/* QUALIFIER dots */}
        {QUALIFIERS.map(q => {
          const p = pct(q.iso);
          const past = new Date(q.iso) < TODAY;
          return (
            <div
              key={q.iso + q.name}
              style={{
                position: "absolute",
                left: `${p}%`,
                top: "64px",
                transform: "translateX(-50%)",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                border: `1px solid ${past ? "rgba(99,179,237,0.2)" : "rgba(99,179,237,0.7)"}`,
                background: past ? "rgba(99,179,237,0.06)" : "rgba(99,179,237,0.18)",
                cursor: "default",
                zIndex: 3,
              }}
              onMouseEnter={() => setTip({ label: q.name, sub: `Regional Qualifier · ${q.dates}`, x: p, above: false })}
              onMouseLeave={() => setTip(null)}
            />
          );
        })}

        {/* CONVENTION diamonds */}
        {CONVENTIONS.map(c => {
          const p = pct(c.iso);
          const past = new Date(c.iso) < TODAY;
          return (
            <div
              key={c.iso}
              style={{
                position: "absolute",
                left: `${p}%`,
                top: "63px",
                transform: "translateX(-50%) rotate(45deg)",
                width: "8px",
                height: "8px",
                background: past ? "rgba(251,191,36,0.08)" : "rgba(251,191,36,0.35)",
                border: `1px solid ${past ? "rgba(251,191,36,0.15)" : "rgba(251,191,36,0.6)"}`,
                cursor: "default",
                zIndex: 3,
              }}
              onMouseEnter={() => setTip({ label: c.name, sub: `Convention · ${c.dates}`, x: p, above: false })}
              onMouseLeave={() => setTip(null)}
            />
          );
        })}

        {/* Tooltip */}
        {tip && (
          <div style={{
            position: "absolute",
            left: `${tip.x}%`,
            top: tip.above ? "36px" : "auto",
            bottom: tip.above ? "auto" : "0px",
            transform: `translateX(${tip.x > 80 ? "-90%" : tip.x < 15 ? "-5%" : "-50%"})`,
            background: "rgba(12,14,20,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "6px",
            padding: "7px 12px",
            pointerEvents: "none",
            zIndex: 20,
            whiteSpace: "nowrap",
          }}>
            <div style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "11px", color: "#fff", letterSpacing: "0.06em" }}>{tip.label}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginTop: "3px" }}>{tip.sub}</div>
          </div>
        )}
      </div>
    </div>
  );
}
