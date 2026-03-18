"use client";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>

      {/* Diamond grid pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='0.7'%3E%3Cpolygon points='28,5 51,28 28,51 5,28'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "56px 56px",
      }} />

      {/* Orb 1 — cool gray, top-left */}
      <div style={{
        position: "absolute",
        width: "700px", height: "700px",
        top: "-150px", left: "-120px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(80,85,95,0.18) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "orbDrift1 22s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 2 — warm gray, bottom-right */}
      <div style={{
        position: "absolute",
        width: "600px", height: "600px",
        bottom: "-120px", right: "-100px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(70,70,70,0.15) 0%, transparent 70%)",
        filter: "blur(65px)",
        animation: "orbDrift2 28s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Orb 3 — center breathe, slightly lighter */}
      <div style={{
        position: "absolute",
        width: "800px", height: "450px",
        top: "30%", left: "20%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(60,62,68,0.12) 0%, transparent 70%)",
        filter: "blur(70px)",
        animation: "orbBreathe 18s ease-in-out infinite",
        willChange: "transform, opacity",
      }} />

      {/* Orb 4 — top-right accent */}
      <div style={{
        position: "absolute",
        width: "400px", height: "400px",
        top: "10%", right: "5%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(75,78,85,0.14) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "orbDrift3 32s ease-in-out infinite",
        willChange: "transform",
      }} />

    </div>
  );
}
