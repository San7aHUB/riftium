"use client";

export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/riftbound-bg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "saturate(0.3)",
      }} />
      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(30, 30, 30, 0.55)",
      }} />
    </div>
  );
}
