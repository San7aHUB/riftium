"use client";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>


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
