"use client";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>

      {/* Orb 1 — teal, top-left, slow drift */}
      <div style={{
        position: "absolute",
        width: "600px", height: "600px",
        top: "-100px", left: "-80px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,120,140,0.28) 0%, transparent 70%)",
        filter: "blur(40px)",
        animation: "orbDrift1 18s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 2 — arcane green, bottom-right, slow pulse */}
      <div style={{
        position: "absolute",
        width: "500px", height: "500px",
        bottom: "-80px", right: "-60px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,100,70,0.25) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "orbDrift2 22s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 3 — deep blue, center, breathe */}
      <div style={{
        position: "absolute",
        width: "700px", height: "400px",
        top: "30%", left: "30%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(8,60,120,0.2) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "orbBreathe 14s ease-in-out infinite",
        willChange: "transform, opacity",
      }} />

      {/* Orb 4 — teal accent, mid-right */}
      <div style={{
        position: "absolute",
        width: "350px", height: "350px",
        top: "20%", right: "8%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,140,160,0.18) 0%, transparent 70%)",
        filter: "blur(45px)",
        animation: "orbDrift3 26s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 5 — green glow, bottom-left */}
      <div style={{
        position: "absolute",
        width: "300px", height: "300px",
        bottom: "15%", left: "10%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(20,120,80,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
        animation: "orbDrift2 30s ease-in-out infinite reverse",
        willChange: "transform",
      }} />

    </div>
  );
}
