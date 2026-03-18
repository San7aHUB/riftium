"use client";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>

      {/* Soft glow top-left — warm amber */}
      <div style={{
        position: "absolute",
        width: "700px", height: "700px",
        top: "-200px", left: "-150px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(227,149,41,0.15) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "orbDrift1 22s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Soft glow bottom-right — deep teal */}
      <div style={{
        position: "absolute",
        width: "650px", height: "650px",
        bottom: "-150px", right: "-120px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,58,80,0.35) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "orbDrift2 26s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Center breathe */}
      <div style={{
        position: "absolute",
        width: "800px", height: "500px",
        top: "30%", left: "20%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(100,65,10,0.08) 0%, transparent 70%)",
        filter: "blur(70px)",
        animation: "orbBreathe 18s ease-in-out infinite",
        willChange: "transform, opacity",
      }} />

    </div>
  );
}
