"use client";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>

      {/* Orb 1 — gold warm, top-left */}
      <div style={{
        position: "absolute",
        width: "650px", height: "650px",
        top: "-120px", left: "-100px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(160,110,20,0.22) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "orbDrift1 20s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 2 — dark gold, bottom-right */}
      <div style={{
        position: "absolute",
        width: "550px", height: "550px",
        bottom: "-100px", right: "-80px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(140,95,15,0.2) 0%, transparent 70%)",
        filter: "blur(55px)",
        animation: "orbDrift2 24s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 3 — anthracite warm, center breathe */}
      <div style={{
        position: "absolute",
        width: "700px", height: "420px",
        top: "35%", left: "25%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(80,65,30,0.15) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "orbBreathe 16s ease-in-out infinite",
        willChange: "transform, opacity",
      }} />

      {/* Orb 4 — bright gold accent, mid-right */}
      <div style={{
        position: "absolute",
        width: "380px", height: "380px",
        top: "18%", right: "6%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,130,25,0.16) 0%, transparent 70%)",
        filter: "blur(45px)",
        animation: "orbDrift3 28s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 5 — muted gold, bottom-left */}
      <div style={{
        position: "absolute",
        width: "320px", height: "320px",
        bottom: "18%", left: "8%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(120,90,18,0.14) 0%, transparent 70%)",
        filter: "blur(42px)",
        animation: "orbDrift2 32s ease-in-out infinite reverse",
        willChange: "transform",
      }} />

    </div>
  );
}
