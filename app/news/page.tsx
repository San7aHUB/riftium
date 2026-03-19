"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  published_at: string;
}

const CATEGORIES = ["All", "General", "Patch", "Event", "Community"];

const CATEGORY_COLOR: Record<string, string> = {
  patch:     "#ef4444",
  community: "#38bdf8",
  event:     "#22c55e",
  general:   "rgba(255,255,255,0.45)",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const q = supabase
      .from("news")
      .select("id, title, slug, excerpt, image_url, category, published_at")
      .order("published_at", { ascending: false });

    if (category !== "All") q.eq("category", category.toLowerCase());

    q.then(({ data }) => {
      if (data) setArticles(data);
      setLoading(false);
    });
  }, [category]);

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 2 }}>

      <main style={{ paddingTop: "80px" }}>

        {/* Header */}
        <div style={{ padding: "60px 32px 40px", maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>
            DISPATCH
          </p>
          <h1 style={{ fontFamily: "'Tilt Warp', sans-serif", fontSize: "clamp(32px, 6vw, 64px)", color: "#fff", letterSpacing: "0.06em", lineHeight: 1, marginBottom: "32px" }}>
            RIFTBOUND NEWS
          </h1>

          {/* Category filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 14px",
                  background: category === cat ? "#fff" : "transparent",
                  border: `1px solid ${category === cat ? "#fff" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: "4px",
                  color: category === cat ? "#000" : "rgba(255,255,255,0.55)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px",
                  fontWeight: category === cat ? 700 : 400,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", margin: "0 32px 40px" }} />

        {/* Grid */}
        <div style={{ padding: "0 32px 80px", maxWidth: "1400px", margin: "0 auto" }}>

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1px" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ aspectRatio: "16/9", background: "linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                  <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ height: "10px", background: "var(--bg-elevated)", borderRadius: "3px", width: "30%" }} />
                    <div style={{ height: "16px", background: "var(--bg-elevated)", borderRadius: "3px", width: "80%" }} />
                    <div style={{ height: "16px", background: "var(--bg-elevated)", borderRadius: "3px", width: "55%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && articles.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.25)", fontFamily: "'Tilt Warp', sans-serif", fontSize: "16px", letterSpacing: "0.08em" }}>
              NO ARTICLES YET
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1px" }}>
              {articles.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    textDecoration: "none", overflow: "hidden",
                    transition: "border-color 0.2s, background 0.2s",
                    animation: `newsCardIn 0.4s ${Math.min(i * 0.06, 0.3)}s ease both`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.22)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.025)";
                  }}
                >
                  <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "var(--bg-deep)" }}>
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s", filter: "brightness(0.9)" }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.12 }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "16px 16px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ padding: "2px 7px", background: "rgba(255,255,255,0.04)", border: `1px solid ${CATEGORY_COLOR[article.category] ?? "rgba(255,255,255,0.1)"}`, borderRadius: "3px", fontSize: "10px", letterSpacing: "0.1em", color: CATEGORY_COLOR[article.category] ?? "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}>
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                    <h2 style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 600,
                      color: "#fff", lineHeight: 1.35, margin: 0,
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p style={{
                        fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.6, margin: 0,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "28px 32px", color: "rgba(255,255,255,0.15)", fontSize: "11px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--bg-void)" }}>
        <span style={{ fontFamily: "'Tilt Warp', sans-serif", letterSpacing: "0.14em" }}>RIFTIUM</span>
      </footer>
    </div>
  );
}
