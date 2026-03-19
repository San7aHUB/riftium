"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  category: string;
  published_at: string;
}

const CATEGORY_COLOR: Record<string, string> = {
  patch:     "#ef4444",
  community: "#38bdf8",
  event:     "#22c55e",
  general:   "rgba(255,255,255,0.45)",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("news")
      .select("*")
      .eq("slug", params.slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setArticle(data);
        setLoading(false);
      });
  }, [params.slug]);

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>

      <main style={{ paddingTop: "80px" }}>

        {loading && (
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 32px" }}>
            <div style={{ height: "400px", background: "linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: "32px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ height: "16px", background: "var(--bg-elevated)", borderRadius: "3px", width: "25%" }} />
              <div style={{ height: "48px", background: "var(--bg-elevated)", borderRadius: "3px", width: "90%" }} />
              <div style={{ height: "48px", background: "var(--bg-elevated)", borderRadius: "3px", width: "70%" }} />
            </div>
          </div>
        )}

        {notFound && (
          <div style={{ textAlign: "center", padding: "120px 32px", fontFamily: "'Tilt Warp', sans-serif" }}>
            <p style={{ fontSize: "64px", color: "rgba(255,255,255,0.06)", marginBottom: "16px" }}>404</p>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: "24px" }}>ARTICLE NOT FOUND</p>
            <Link href="/news" style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", fontFamily: "'Inter', sans-serif", textDecoration: "underline" }}>
              Back to News
            </Link>
          </div>
        )}

        {article && (
          <>
            {/* Hero image */}
            {article.image_url && (
              <div style={{ position: "relative", width: "100%", maxHeight: "520px", overflow: "hidden" }}>
                <img
                  src={article.image_url}
                  alt={article.title}
                  style={{ width: "100%", height: "520px", objectFit: "cover", display: "block", filter: "brightness(0.75)" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "70%",
                  background: "linear-gradient(to top, #090909 0%, transparent 100%)",
                }} />
              </div>
            )}

            {/* Article content */}
            <div style={{ maxWidth: "780px", margin: "0 auto", padding: article.image_url ? "0 32px 80px" : "60px 32px 80px" }}>

              {/* Meta */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", marginTop: article.image_url ? "-60px" : 0, position: "relative" }}>
                <span style={{ padding: "3px 10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${CATEGORY_COLOR[article.category] ?? "rgba(255,255,255,0.15)"}`, borderRadius: "4px", fontSize: "10px", letterSpacing: "0.12em", color: CATEGORY_COLOR[article.category] ?? "rgba(255,255,255,0.7)", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                  {article.category}
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>
                  {formatDate(article.published_at)}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "'Tilt Warp', sans-serif",
                fontSize: "clamp(28px, 5vw, 52px)",
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "0.04em",
                marginBottom: "16px",
              }}>
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p style={{
                  fontSize: "17px",
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.65,
                  marginBottom: "40px",
                  fontWeight: 300,
                  borderLeft: "2px solid rgba(255,255,255,0.15)",
                  paddingLeft: "16px",
                }}>
                  {article.excerpt}
                </p>
              )}

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "40px" }} />

              {/* Body */}
              {article.content && (
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", lineHeight: 1.8, color: "rgba(255,255,255,0.7)", fontWeight: 300 }}>
                  {article.content.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginBottom: "20px" }}>{para}</p>
                  ))}
                </div>
              )}

              {/* Back link */}
              <div style={{ marginTop: "60px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <Link href="/news" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  fontFamily: "'Inter', sans-serif", fontSize: "12px",
                  color: "rgba(255,255,255,0.4)", textDecoration: "none",
                  letterSpacing: "0.08em", transition: "color 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  BACK TO NEWS
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "28px 32px", color: "rgba(255,255,255,0.15)", fontSize: "11px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--bg-void)" }}>
        <span style={{ fontFamily: "'Tilt Warp', sans-serif", letterSpacing: "0.14em" }}>RIFTIUM</span>
      </footer>
    </div>
  );
}
