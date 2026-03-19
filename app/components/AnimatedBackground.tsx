"use client";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      {/* Base gradient (was body::before) */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 50% at 20% 10%, rgba(60,60,60,0.4) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 80% 90%, rgba(40,40,40,0.35) 0%, transparent 55%), linear-gradient(160deg, #1e1e1e 0%, #161616 50%, #111111 100%)",
      }} />
      {/* Grain texture (was body::after) */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px",
        opacity: 0.4,
      }} />
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
