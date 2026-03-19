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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function CategoryPill({ label }: { label: string }) {
  return (
    <span style={{
      padding: "2px 8px",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "4px",
      fontSize: "10px",
      letterSpacing: "0.1em",
      color: "rgba(255,255,255,0.6)",
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
    }}>
      {label}
    </span>
  );
}

function SkeletonCard({ tall }: { tall?: boolean }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{
        aspectRatio: tall ? "4/3" : "16/9",
        background: "linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ height: "12px", background: "var(--bg-elevated)", borderRadius: "3px", width: "40%" }} />
        <div style={{ height: tall ? "20px" : "14px", background: "var(--bg-elevated)", borderRadius: "3px", width: "85%" }} />
        <div style={{ height: tall ? "20px" : "14px", background: "var(--bg-elevated)", borderRadius: "3px", width: "60%" }} />
      </div>
    </div>
  );
}

export default function NewsRecap() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("news")
      .select("id, title, slug, excerpt, image_url, category, published_at")
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setArticles(data);
        setLoading(false);
      });
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section style={{
      position: "relative",
      zIndex: 2,
      padding: "0 32px 80px",
      maxWidth: "1400px",
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
          <span style={{
            fontFamily: "'Tilt Warp', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.35)",
          }}>
            DISPATCH
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.12), transparent)" }} />
          <Link href="/news" style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            VIEW ALL
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="news-grid">
          <SkeletonCard tall />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="news-grid">
          {articles.map((article, i) => {
            const isFeatured = i === 0;
            return (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  textDecoration: "none",
                  overflow: "hidden",
                  transition: "border-color 0.2s, background 0.2s",
                  animation: `newsCardIn 0.5s ${i * 0.1}s ease both`,
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
                {/* Image */}
                <div style={{ position: "relative", aspectRatio: isFeatured ? "4/3" : "16/9", overflow: "hidden", background: "var(--bg-deep)" }}>
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.15 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  {/* Gradient fade bottom */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
                    background: "linear-gradient(to top, rgba(10,10,10,0.8), transparent)",
                    pointerEvents: "none",
                  }} />
                </div>

                {/* Content */}
                <div style={{ padding: isFeatured ? "20px 20px 24px" : "14px 14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: isFeatured ? "10px" : "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CategoryPill label={article.category} />
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em" }}>
                      {formatDate(article.published_at)}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: isFeatured ? "'Tilt Warp', sans-serif" : "'Outfit', sans-serif",
                    fontSize: isFeatured ? "clamp(16px, 2vw, 22px)" : "14px",
                    fontWeight: isFeatured ? 400 : 600,
                    color: "#ffffff",
                    lineHeight: 1.3,
                    margin: 0,
                    letterSpacing: isFeatured ? "0.04em" : "0.02em",
                    display: "-webkit-box",
                    WebkitLineClamp: isFeatured ? 3 : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {article.title}
                  </h3>

                  {isFeatured && article.excerpt && (
                    <p style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.6,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {article.excerpt}
                    </p>
                  )}
                </div>

                {/* Decorative number watermark */}
                <span className="news-number-bg" style={{ fontSize: "clamp(60px, 8vw, 100px)" }}>
                  0{i + 1}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
