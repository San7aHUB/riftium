"use client";

import Link from "next/link";

export default function MarketPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "rgba(255,255,255,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <div style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "48px", letterSpacing: "0.1em", color: "#fff" }}>MARKET</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)" }}>COMING SOON</div>
      <Link href="/" style={{ marginTop: "24px", fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>← BACK TO HOME</Link>
    </div>
  );
}
