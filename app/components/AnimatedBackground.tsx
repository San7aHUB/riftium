"use client";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", width: "700px", height: "700px",
        top: "-150px", left: "-120px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(80,80,80,0.15) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "orbDrift1 22s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: "600px", height: "600px",
        bottom: "-120px", right: "-100px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(60,60,60,0.12) 0%, transparent 70%)",
        filter: "blur(65px)",
        animation: "orbDrift2 28s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: "800px", height: "450px",
        top: "30%", left: "20%", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(50,50,50,0.1) 0%, transparent 70%)",
        filter: "blur(70px)",
        animation: "orbBreathe 18s ease-in-out infinite",
      }} />
    </div>
  );
}
