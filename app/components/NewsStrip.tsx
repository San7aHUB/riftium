"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CATEGORY_COLOR: Record<string, string> = {
  patch:     "#ef4444",
  community: "#38bdf8",
  event:     "#22c55e",
  general:   "rgba(255,255,255,0.7)",
};

interface NewsItem {
  title: string;
  slug: string;
  category: string;
}

export default function NewsStrip() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase
      .from("news")
      .select("title, slug, category")
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  if (items.length === 0) return null;

  return (
    <div style={{
      marginTop: "48px",
      width: "100%",
      maxWidth: "700px",
      display: "flex",
      flexDirection: "column",
      gap: "1px",
      animation: "heroSubIn 0.6s 1.2s ease both",
    }}>
      {/* Label */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginBottom: "10px",
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.55)",
        }}>
          LATEST
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.15)" }} />
        <Link href="/news" style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.55)",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
        >
          ALL NEWS →
        </Link>
      </div>

      {/* Items */}
      {items.map((item, i) => (
        <Link
          key={item.slug}
          href={`/news/${item.slug}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "9px 14px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "6px",
            textDecoration: "none",
            transition: "background 0.15s, border-color 0.15s",
            animation: `newsCardIn 0.4s ${0.1 + i * 0.08}s ease both`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.02)";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.05)";
          }}
        >
          {/* Category dot */}
          <span style={{
            width: "5px", height: "5px",
            borderRadius: "50%",
            background: CATEGORY_COLOR[item.category] ?? CATEGORY_COLOR.general,
            boxShadow: `0 0 6px ${CATEGORY_COLOR[item.category] ?? "rgba(255,255,255,0.3)"}`,
            flexShrink: 0,
          }} />

          {/* Category pill */}
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: CATEGORY_COLOR[item.category] ?? CATEGORY_COLOR.general,
            flexShrink: 0,
            minWidth: "52px",
          }}>
            {item.category.toUpperCase()}
          </span>

          {/* Divider */}
          <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

          {/* Title */}
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            color: "rgba(255,255,255,0.8)",
            letterSpacing: "0.03em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            transition: "color 0.15s",
          }}>
            {item.title}
          </span>

          {/* Arrow */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color: "rgba(255,255,255,0.15)", flexShrink: 0 }}>
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      ))}
    </div>
  );
}
