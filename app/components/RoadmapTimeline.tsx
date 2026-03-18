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
      { name: "Bologna",  sub: "Regional Qualifier · Feb 20–22" },
      { name: "Las Vegas", sub: "Regional Qualifier · Feb 27–Mar 1" },
      { name: "PAX East",  sub: "Convention · Mar 26–30" },
      { name: "Lille",     sub: "Regional Qualifier · Apr 17–19" },
      { name: "Atlanta",   sub: "Regional Qualifier · Apr 24–26" },
    ],
  },
  {
    set: "Unleashed",
    label: "SET 3",
    date: "May 8",
    iso: "2026-05-08",
    events: [
      { name: "Sydney",    sub: "Regional Qualifier · May 15–17" },
      { name: "Vancouver", sub: "Regional Qualifier · May 29–31" },
      { name: "Utrecht",   sub: "Regional Qualifier · Jun 12–14" },
      { name: "Hartford",  sub: "Regional Qualifier · Jun 19–21" },
    ],
  },
  {
    set: "Vendetta",
    label: "SET 4",
    date: "Jul 31",
    iso: "2026-07-31",
    events: [
      { name: "Gen Con",    sub: "Convention · Jul 30–Aug 2" },
      { name: "Barcelona",  sub: "Regional Qualifier · Aug 21–23" },
      { name: "Singapore",  sub: "Regional Qualifier · Sep 4–6" },
      { name: "Los Angeles",sub: "Regional Qualifier · Sep 25–27" },
    ],
  },
  {
    set: "Radiance",
    label: "SET 5",
    date: "Oct 23",
    iso: "2026-10-23",
    events: [
      { name: "PAX Unplugged", sub: "Convention · Dec 4–6" },
    ],
  },
];

export default function RoadmapTimeline() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{
      width: "100%",
      maxWidth: "700px",
      marginBottom: "44px",
      animation: "heroSubIn 0.7s 0.25s ease both",
    }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginBottom: "16px",
      }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "8px",
          letterSpacing: "0.28em",
          color: "rgba(255,255,255,0.2)",
        }}>2026 ROADMAP</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* Phases row */}
      <div style={{ position: "relative" }}>

        {/* Connecting line */}
        <div style={{
          position: "absolute",
          top: "21px",
          left: "10%", right: "10%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 15%, rgba(255,255,255,0.12) 85%, transparent)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px" }}>
          {PHASES.map((phase, i) => {
            const past = new Date(phase.iso) < TODAY;
            const isNext = !past && PHASES.every((p, j) => j >= i || new Date(p.iso) < TODAY);
            const isOpen = open === i;

            return (
              <div
                key={phase.set}
                onClick={() => setOpen(isOpen ? null : i)}
                style={{ cursor: "pointer" }}
              >
                {/* Node + set info */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 4px 12px",
                  borderBottom: `1px solid ${isOpen ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                  transition: "border-color 0.2s",
                }}>
                  {/* Node */}
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isNext && (
                      <span style={{
                        position: "absolute",
                        width: "24px", height: "24px",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.2)",
                        animation: "glow-pulse 2.5s ease-in-out infinite",
                      }} />
                    )}
                    <div style={{
                      width: past ? "8px" : isNext ? "12px" : "10px",
                      height: past ? "8px" : isNext ? "12px" : "10px",
                      borderRadius: "50%",
                      background: past ? "rgba(255,255,255,0.15)"
                        : isNext ? "#ffffff"
                        : "rgba(255,255,255,0.4)",
                      boxShadow: isNext ? "0 0 14px rgba(255,255,255,0.6)" : "none",
                    }} />
                  </div>

                  {/* Set name */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "'Tilt Warp', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      color: past ? "rgba(255,255,255,0.2)"
                        : isNext ? "#ffffff"
                        : "rgba(255,255,255,0.6)",
                      marginBottom: "3px",
                    }}>
                      {phase.set}
                    </div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "8px",
                      letterSpacing: "0.14em",
                      color: past ? "rgba(255,255,255,0.1)"
                        : isNext ? "rgba(255,255,255,0.45)"
                        : "rgba(255,255,255,0.2)",
                    }}>
                      {phase.label} · {phase.date}
                    </div>
                  </div>

                  {/* Event count */}
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "8px",
                    letterSpacing: "0.1em",
                    color: isOpen ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)",
                    display: "flex", alignItems: "center", gap: "4px",
                    transition: "color 0.2s",
                  }}>
                    <span>{phase.events.length} EVENTS</span>
                    <span style={{
                      display: "inline-block",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      lineHeight: 1,
                    }}>▾</span>
                  </div>
                </div>

                {/* Event list (expandable) */}
                <div style={{
                  overflow: "hidden",
                  maxHeight: isOpen ? `${phase.events.length * 44}px` : "0px",
                  transition: "max-height 0.25s ease",
                }}>
                  {phase.events.map((ev, j) => (
                    <div key={j} style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      animation: isOpen ? `newsCardIn 0.25s ${j * 0.04}s ease both` : "none",
                    }}>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.6)",
                        letterSpacing: "0.04em",
                        marginBottom: "2px",
                      }}>{ev.name}</div>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "8px",
                        color: "rgba(255,255,255,0.2)",
                        letterSpacing: "0.06em",
                      }}>{ev.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
