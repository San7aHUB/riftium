"use client";

const today = new Date();

const SETS = [
  { name: "Spiritforged", label: "SET 2", date: "Feb 13", iso: "2026-02-13", above: true  },
  { name: "Unleashed",    label: "SET 3", date: "May 8",  iso: "2026-05-08", above: false },
  { name: "Vendetta",     label: "SET 4", date: "Jul 31", iso: "2026-07-31", above: true  },
  { name: "Radiance",     label: "SET 5", date: "Oct 23", iso: "2026-10-23", above: false },
];

export default function RoadmapTimeline() {
  const nextIdx = SETS.findIndex(s => new Date(s.iso) > today);

  return (
    <div style={{
      width: "100%",
      maxWidth: "580px",
      marginBottom: "36px",
      animation: "heroSubIn 0.7s 0.3s ease both",
      position: "relative",
    }}>

      {/* Labels above the line */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", position: "relative" }}>
        {SETS.map((s, i) => {
          const past = new Date(s.iso) < today;
          const isNext = i === nextIdx;
          if (!s.above) return <div key={s.name} style={{ flex: 1 }} />;
          return (
            <div key={s.name} style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: i === 0 ? "flex-start" : i === SETS.length - 1 ? "flex-end" : "center",
              gap: "2px",
            }}>
              <span style={{
                fontFamily: "'Tilt Warp', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: past
                  ? "rgba(255,255,255,0.2)"
                  : isNext
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.55)",
                transition: "color 0.3s",
              }}>
                {s.name}
              </span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.18em",
                color: past ? "rgba(255,255,255,0.12)" : isNext ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
              }}>
                {s.label} · {s.date}
              </span>
            </div>
          );
        })}
      </div>

      {/* Line + nodes */}
      <div style={{ position: "relative", height: "20px", display: "flex", alignItems: "center" }}>

        {/* Background line */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          height: "1px",
          background: "rgba(255,255,255,0.08)",
        }} />

        {/* Progress fill up to next node */}
        {nextIdx > 0 && (
          <div style={{
            position: "absolute",
            left: 0,
            width: `${((nextIdx) / (SETS.length - 1)) * 100}%`,
            height: "1px",
            background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12))",
          }} />
        )}

        {/* Nodes */}
        <div style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {SETS.map((s, i) => {
            const past = new Date(s.iso) < today;
            const isNext = i === nextIdx;
            return (
              <div key={s.name} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Outer glow ring (next only) */}
                {isNext && (
                  <span style={{
                    position: "absolute",
                    width: "22px", height: "22px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    animation: "glow-pulse 2.5s ease-in-out infinite",
                  }} />
                )}
                {/* Node */}
                <span style={{
                  width: past ? "6px" : isNext ? "10px" : "7px",
                  height: past ? "6px" : isNext ? "10px" : "7px",
                  borderRadius: "50%",
                  background: past
                    ? "rgba(255,255,255,0.18)"
                    : isNext
                    ? "#ffffff"
                    : "rgba(255,255,255,0.45)",
                  boxShadow: isNext ? "0 0 12px rgba(255,255,255,0.6)" : "none",
                  display: "block",
                  transition: "all 0.3s",
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels below the line */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        {SETS.map((s, i) => {
          const past = new Date(s.iso) < today;
          const isNext = i === nextIdx;
          if (s.above) return <div key={s.name} style={{ flex: 1 }} />;
          return (
            <div key={s.name} style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: i === 0 ? "flex-start" : i === SETS.length - 1 ? "flex-end" : "center",
              gap: "2px",
            }}>
              <span style={{
                fontFamily: "'Tilt Warp', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: past
                  ? "rgba(255,255,255,0.2)"
                  : isNext
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.55)",
              }}>
                {s.name}
              </span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.18em",
                color: past ? "rgba(255,255,255,0.12)" : isNext ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
              }}>
                {s.label} · {s.date}
              </span>
            </div>
          );
        })}
      </div>

      {/* "2026 ROADMAP" caption */}
      <div style={{
        position: "absolute",
        top: "50%",
        right: 0,
        transform: "translateY(-50%) translateX(calc(100% + 14px))",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "2px",
        opacity: 0.3,
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "8px",
          letterSpacing: "0.25em",
          color: "#fff",
          whiteSpace: "nowrap",
        }}>2026</span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "8px",
          letterSpacing: "0.25em",
          color: "#fff",
          whiteSpace: "nowrap",
        }}>ROADMAP</span>
      </div>
    </div>
  );
}
