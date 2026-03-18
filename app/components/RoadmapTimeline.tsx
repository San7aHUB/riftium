"use client";

import { useState } from "react";

const TODAY = new Date();

const PHASES = [
  {
    set: "Spiritforged",
    label: "SET 2",
    date: "Feb 13",
    iso: "2026-02-13",
    events: [
      { name: "Spiritforged Pre-Rift", type: "Preview",   dates: "Feb 6–12" },
      { name: "Bologna",               type: "Qualifier", dates: "Feb 20–22" },
      { name: "Las Vegas",             type: "Qualifier", dates: "Feb 27–Mar 1" },
      { name: "PAX East",              type: "Convention", dates: "Mar 26–30" },
      { name: "Lille",                 type: "Qualifier", dates: "Apr 17–19" },
      { name: "Atlanta",               type: "Qualifier", dates: "Apr 24–26" },
    ],
  },
  {
    set: "Unleashed",
    label: "SET 3",
    date: "May 8",
    iso: "2026-05-08",
    events: [
      { name: "Unleashed Pre-Rift", type: "Preview",   dates: "May 1–7" },
      { name: "Sydney",             type: "Qualifier", dates: "May 15–17" },
      { name: "Vancouver",          type: "Qualifier", dates: "May 29–31" },
      { name: "Utrecht",            type: "Qualifier", dates: "Jun 12–14" },
      { name: "Hartford",           type: "Qualifier", dates: "Jun 19–21" },
    ],
  },
  {
    set: "Vendetta",
    label: "SET 4",
    date: "Jul 31",
    iso: "2026-07-31",
    events: [
      { name: "Vendetta Pre-Rift", type: "Preview",    dates: "Jul 24–30" },
      { name: "Gen Con",           type: "Convention", dates: "Jul 30–Aug 2" },
      { name: "Barcelona",         type: "Qualifier",  dates: "Aug 21–23" },
      { name: "Singapore",         type: "Qualifier",  dates: "Sep 4–6" },
      { name: "Los Angeles",       type: "Qualifier",  dates: "Sep 25–27" },
    ],
  },
  {
    set: "Radiance",
    label: "SET 5",
    date: "Oct 23",
    iso: "2026-10-23",
    events: [
      { name: "PAX Unplugged", type: "Convention", dates: "Dec 4–6" },
    ],
  },
];

export default function RoadmapTimeline() {
  const [open, setOpen] = useState<number | null>(null);

  const nextIdx = PHASES.findIndex(p => new Date(p.iso) >= TODAY);

  return (
    <div style={{
      width: "100%",
      maxWidth: "700px",
      margin: "0 auto",
      animation: "heroSubIn 0.6s 0.7s ease both",
    }}>
      {/* Label */}
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "8px",
        letterSpacing: "0.3em",
        color: "rgba(255,255,255,0.25)",
        marginBottom: "10px",
        textAlign: "left",
      }}>
        2026 ROADMAP
      </div>

      {/* 4 panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
        {PHASES.map((phase, i) => {
          const past    = new Date(phase.iso) < TODAY;
          const isNext  = i === nextIdx;
          const isOpen  = open === i;
          const isLast  = i === PHASES.length - 1;

          return (
            <div
              key={phase.set}
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                borderRight: isLast ? "none" : "1px solid rgba(255,255,255,0.07)",
                padding: "0 16px 0 0",
                marginRight: isLast ? 0 : 16,
                cursor: "pointer",
              }}
            >
              {/* Top accent bar */}
              <div style={{
                height: "2px",
                marginBottom: "14px",
                background: past
                  ? "rgba(255,255,255,0.1)"
                  : isNext
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.3)",
                boxShadow: isNext ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                transition: "background 0.2s",
              }} />

              {/* Set label */}
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "8px",
                letterSpacing: "0.2em",
                color: past ? "rgba(255,255,255,0.25)" : isNext ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
                marginBottom: "6px",
                textAlign: "left",
              }}>
                {phase.label}
              </div>

              {/* Set name */}
              <div style={{
                fontFamily: "'Tilt Warp', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.05em",
                color: past ? "rgba(255,255,255,0.3)" : "#ffffff",
                marginBottom: "4px",
                textAlign: "left",
              }}>
                {phase.set}
              </div>

              {/* Date */}
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.1em",
                color: past ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
                marginBottom: "12px",
                textAlign: "left",
              }}>
                {past ? "✓ " : isNext ? "→ " : ""}{phase.date}
              </div>

              {/* Toggle button */}
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "8px",
                letterSpacing: "0.12em",
                color: isOpen ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "10px",
                transition: "color 0.15s",
              }}>
                <span>{phase.events.length} EVENTS</span>
                <span style={{
                  display: "inline-block",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                }}>▾</span>
              </div>

              {/* Event list */}
              <div style={{
                overflow: "hidden",
                maxHeight: isOpen ? `${phase.events.length * 52}px` : "0",
                transition: "max-height 0.28s ease",
              }}>
                {phase.events.map((ev, j) => (
                  <div key={j} style={{
                    paddingBottom: "10px",
                    marginBottom: "10px",
                    borderBottom: j < phase.events.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    textAlign: "left",
                  }}>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      color: "#ffffff",
                      letterSpacing: "0.03em",
                      marginBottom: "3px",
                    }}>
                      {ev.name}
                    </div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "8px",
                      color: ev.type === "Preview" ? "rgba(168,85,247,0.8)" : "rgba(255,255,255,0.4)",
                      letterSpacing: "0.08em",
                    }}>
                      {ev.type.toUpperCase()} · {ev.dates}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
